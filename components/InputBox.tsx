import { useEffect, useRef, useState } from "react";

type InputBoxProps = {
  addTodo: (task: string) => void;
  task: string;
  isEdit: boolean;
  editingId: number | null;
  onEdit: (id: number, task: string) => void;
  onCancelEdit: () => void;
  onSearchChange: (query: string) => void;
  isEnableAddNew: boolean;
};

export const InputBox = ({
  addTodo,
  task,
  isEdit,
  editingId,
  onEdit,
  onCancelEdit,
  onSearchChange,
  isEnableAddNew,
}: InputBoxProps) => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTodoValid, setIsTodoValid] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isEdit) {
      e.preventDefault();

      if (inputElement.current !== null) {
        const text = inputElement.current.value;

        if (text !== undefined && text !== "" && editingId !== null) {
          onEdit(editingId, text);
          // @ts-ignore
          inputElement.current.value = "";
        } else {
          setError("Please enter a task");
        }
      }

      // after edit, reset the state
      onCancelEdit();
    } else {
      e.preventDefault();

      const text = inputElement.current?.value;
      if (text !== undefined && text !== "") {
        addTodo(text);
        // @ts-ignore
        inputElement.current.value = "";
      } else {
        setError("Please enter a task");
      }
    }

    // after submit, reset the search query
    onSearchChange("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }

    onSearchChange(e.target.value);

    if (e.target.value !== "") {
      setIsTodoValid(true);
    } else {
      setIsTodoValid(false);
    }
  };

  const onCancel = () => {
    onCancelEdit();
  };

  useEffect(() => {
    if (inputElement.current !== null) inputElement.current.value = task;
  }, [task]);

  return (
    <form className="flex w-full h-full gap-4" onSubmit={onSubmit}>
      <input
        id="input-box"
        ref={inputElement}
        onChange={onChange}
        type="text"
        className="flex-1 h-full px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ring-blue-500 ring-2"
        placeholder="Enter a task"
      />

      {isEdit && (
        <>
          <button
            disabled={!isTodoValid}
            className="w-24 h-full bg-teal-600 rounded-md disabled:opacity-60"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-24 h-full rounded-md shadow-md"
          >
            Cancel
          </button>
        </>
      )}
      {!isEdit && (
        <button
          type="submit"
          disabled={!isTodoValid && !isEnableAddNew}
          className="w-24 h-full bg-teal-600 rounded-md disabled:opacity-60"
        >
          Add
        </button>
      )}
    </form>
  );
};
