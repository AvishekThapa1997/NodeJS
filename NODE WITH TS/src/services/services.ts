import * as fs from "fs/promises";
import * as path from "path";
import Todo from "../model/Todo";

export const getTodos: () => Promise<Todo[]> = async () => {
  const jsonString = await fs.readFile(
    path.join(__dirname, "..", "..", "data", "data.json"),
    "utf-8"
  );
  const jsonObj = JSON.parse(jsonString);
  return jsonObj.todos.map((jsonItem: any) => {
    const todo: Todo = {
      id: jsonItem.id,
      content: jsonItem.content,
    };
    return todo;
  });
};
