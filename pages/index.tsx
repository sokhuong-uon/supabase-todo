import { InputBox } from "@/components/InputBox";
import { useEffect, useState } from "react";

import { useTodo, Todo } from "@/hooks/useTodo";
import { TodoCard } from "@/components/TodoCard";
import { useSupabase } from "@/hooks/useSupabase";
import { useApplicationContext } from "./_app";

export default function Home() {
  const supabase = useSupabase();

  const { todos, setTodos } = useApplicationContext();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [searchQuery, setSearchQuery] = useState("");

  const onSearchChange = (query: string) => {
    setSearchQuery(query);

    const filtered = todos.filter((todo) => {
      return todo.task.includes(query);
    });

    setFilteredTodos(filtered);
  };

  const { addTodo, deleteTodo, updateTodo, toggleTodo } = useTodo(todos);

  // edit
  const [editingTask, setEditingTask] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const onCancelEdit = () => {
    setIsEdit(false);
    setEditingTask("");
    setEditId(null);
  };

  const prepareEdit = (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setIsEdit(true);
      setEditId(id);
      setEditingTask(todo.task);
    }

    // try to focus the element
    const inputElement = document.getElementById("input-box") as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
    }
  };

  const onEdit = (id: number, task: string) => {
    updateTodo(id, task);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("todo")
        .select()
        .order("task", { ascending: true });

      if (error) {
        console.log(error);
      }

      if (data) {
        setTodos(data as Todo[]);
      }
    };

    fetchData();
  }, []);

  const toggle = (id: number, isDone: boolean) => {
    toggleTodo(id, isDone);
  };

  return (
    <main className="flex flex-col w-full h-full gap-4 p-4">
      <h1 className="w-full h-12 text-2xl">Tasks</h1>

      <div className="w-full h-12">
        <InputBox
          addTodo={addTodo}
          task={editingTask}
          editingId={editId}
          onCancelEdit={onCancelEdit}
          isEdit={isEdit}
          onEdit={onEdit}
          onSearchChange={onSearchChange}
          isEnableAddNew={filteredTodos.length === 0}
        />
      </div>

      <div className="flex flex-col gap-2">
        <ul className="flex flex-col w-full h-full gap-2 ">
          {(searchQuery === "" || isEdit) &&
            todos.map((todo) => (
              <li key={todo.id} className={editId === todo.id ? "bg-red-500" : ""}>
                <TodoCard
                  todo={todo}
                  onDelete={deleteTodo}
                  onEdit={prepareEdit}
                  onToggle={toggle}
                  key={todo.id}
                ></TodoCard>
              </li>
            ))}

          {searchQuery !== "" &&
            !isEdit &&
            filteredTodos.map((todo) => (
              <li key={todo.id} className={editId === todo.id ? "bg-red-500" : ""}>
                <TodoCard
                  todo={todo}
                  onDelete={deleteTodo}
                  onEdit={prepareEdit}
                  onToggle={toggle}
                  key={todo.id}
                ></TodoCard>
              </li>
            ))}
          {searchQuery !== "" && !isEdit && filteredTodos.length === 0 && (
            <li>No match found</li>
          )}
        </ul>
      </div>
    </main>
  );
}
