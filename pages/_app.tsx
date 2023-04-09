import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import "./globals.css";
import { Layout } from "./layout";
import type { AppProps } from "next/app";
import { useSupabase } from "@/hooks/useSupabase";
import { Todo } from "@/hooks/useTodo";

export const ApplicationContext = React.createContext<{
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
} | null>(null);

export const useApplicationContext = () => {
  const applicationContext = useContext(ApplicationContext);
  if (!applicationContext) {
    throw new Error(
      "useApplicationContext must be used within a ApplicationContext.Provider"
    );
  }

  return applicationContext;
};

function App({ Component, pageProps }: AppProps) {
  const [todos, setTodos] = useState([] as Todo[]);
  const supabase = useSupabase();

  useEffect(() => {
    supabase
      .channel("todo-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "todo" },
        (payload) => {
          const newTodo = payload.new as Todo;
          setTodos((prev) => {
            return [newTodo, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "todo" },
        (payload) => {
          const oldTodo = payload.old as Todo;
          setTodos((prev) => {
            return prev.filter((todo) => todo.id !== oldTodo.id);
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "todo" },
        (payload) => {
          const newTodo = payload.new as Todo;
          setTodos((prev) => {
            return prev.map((todo) => {
              if (todo.id === newTodo.id) {
                return newTodo;
              }
              return todo;
            });
          });
        }
      )
      .subscribe();
  }, []);

  return (
    <ApplicationContext.Provider value={{ todos, setTodos }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApplicationContext.Provider>
  );
}

export default App;
