import { useSupabase } from "./useSupabase";

export type Todo = {
  id: number;

  task: string;
  is_done: boolean;

  created_at: string;
};

const useTodo = (todos: Todo[]) => {
  const supabase = useSupabase();

  const fetchTodos = async () => {};

  const addTodo = async (task: string) => {
    const { error } = await supabase.from("todo").insert({ task, is_done: false });

    if (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todo").delete().eq("id", id);

    if (error) {
      console.log(error);
    }
  };

  const updateTodo = async (id: number, task: string) => {
    const { error } = await supabase.from("todo").update({ task }).eq("id", id);

    if (error) {
      console.log(error);
    }
  };

  const toggleTodo = async (id: number, isDone: boolean) => {
    const { error } = await supabase
      .from("todo")
      .update({ is_done: isDone })
      .eq("id", id);

    if (error) {
      console.log(error);
    }
  };

  return { todos, fetchTodos, addTodo, deleteTodo, updateTodo, toggleTodo };
};

export { useTodo };
