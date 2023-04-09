import { useApplicationContext } from "@/pages/_app";
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  createClient,
} from "@supabase/supabase-js";
import { Todo } from "./useTodo";

const useSupabase = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
  return supabase;
};

export type SupabaseChannelOptions = {
  onInsert?: (payload: RealtimePostgresInsertPayload<{ [key: string]: any }>) => void;
  onUpdate?: (payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) => void;
  onDelete?: (payload: RealtimePostgresDeletePayload<{ [key: string]: any }>) => void;
};

const useSupabaseChannel = () => {
  const supabase = useSupabase();
  const { todos, setTodos } = useApplicationContext();

  const realtimeChannel = supabase
    .channel("todo-list")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "todo" },
      (payload) => {
        const newTodo = payload.new as Todo;
        setTodos([newTodo, ...todos]);
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "todo" },
      (payload) => {}
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "todo" },
      (payload) => {
        // onUpdate?.(payload);
      }
    )
    .subscribe();

  return realtimeChannel;
};

export { useSupabase, useSupabaseChannel };
