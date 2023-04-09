import { Todo } from "@/hooks/useTodo";

type TodoCardProps = {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number, isDone: boolean) => void;
  onEdit: (id: number) => void;
};

export const TodoCard = ({ todo, onDelete, onEdit, onToggle }: TodoCardProps) => {
  const deleteItem = () => {
    onDelete(todo.id);
  };

  const editItem = () => {
    onEdit(todo.id);
  };

  const onCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(todo.id, e.target.checked);
  };

  return (
    <div className="flex w-full h-12 rounded-md shadow-md">
      <div className="flex items-center justify-center w-12 h-full px-2">
        <input
          onChange={onCheckBoxChange}
          checked={todo.is_done}
          type="checkbox"
          name="done"
          id={`${todo.id}`}
          className="w-6 h-6 border"
        />
      </div>

      <div className={`flex items-center flex-1 ${todo.is_done ? "line-through" : ""}`}>
        {todo.task}
      </div>

      <div className="px-2 ml-auto">
        <button onClick={editItem} className="w-12 h-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9833 5.48122L3.66957 16.7949L3.42466 19.4889C3.36812 20.1109 3.88915 20.6319 4.51109 20.5754L7.2051 20.3304L18.5188 9.01675L14.9833 5.48122Z"
              fill="#2E3A59"
            />
            <path
              d="M19.2259 8.30964L21.3472 6.18831C21.7378 5.79778 21.7378 5.16462 21.3472 4.77409L19.2259 2.65277C18.8354 2.26225 18.2022 2.26225 17.8117 2.65277L15.6904 4.77411L19.2259 8.30964Z"
              fill="#2E3A59"
            />
          </svg>
        </button>

        <button onClick={deleteItem} className="w-12 h-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 2H9C7.897 2 7 2.897 7 4V5H3V7H5V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V7H21V5H17V4C17 2.897 16.103 2 15 2ZM9 4H15V5H9V4ZM17 20H7V7H17V20Z"
              fill="#2E3A59"
            />
            <path d="M9 9H11V18H9V9Z" fill="#2E3A59" />
            <path d="M13 9H15V18H13V9Z" fill="#2E3A59" />
          </svg>
        </button>
      </div>
    </div>
  );
};
