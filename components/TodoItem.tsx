import React from "react";

type TodoItemProps = {
  text: string;
};

export const TodoItem = ({ text }: TodoItemProps) => {
  return <div>{text}</div>;
};
