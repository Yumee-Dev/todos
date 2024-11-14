import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders app", () => {
  render(<App />);

  const todosHeader = screen.getByText("todos");

  expect(todosHeader).toBeInTheDocument();
});

test("adds new todo on press Enter", () => {
  render(<App />);

  const newTodoInput = screen.getByPlaceholderText("What needs to be done?");

  fireEvent.click(newTodoInput);

  fireEvent.change(newTodoInput, { target: { value: "Новая тудушка" } });

  fireEvent.keyDown(newTodoInput, { key: "Enter", code: "Enter" });

  expect(screen.getByTestId("todos-list")).toContainElement(
    screen.getByText("Новая тудушка")
  );
});

test("adds new todo on click Plus button", () => {
  render(<App />);

  const newTodoInput = screen.getByPlaceholderText("What needs to be done?");

  fireEvent.click(newTodoInput);

  fireEvent.change(newTodoInput, { target: { value: "Ещё одна тудушка" } });

  fireEvent.click(screen.getByText("+"));

  expect(screen.getByTestId("todos-list")).toContainElement(
    screen.getByText("Ещё одна тудушка")
  );
});

test("completes todo on click circle", () => {
  render(<App />);

  const circle = screen.getAllByTestId("completed-circle")[0];
  const todo = screen.getByText("Ещё одна тудушка");

  expect(circle).toHaveClass("circle", { exact: true });
  expect(todo).toHaveClass("todo-text", { exact: true });

  fireEvent.click(circle);

  expect(circle).toHaveClass("circle completed", { exact: true });
  expect(todo).toHaveClass("todo-text completed", { exact: true });
});

test("uncompletes todo on click circle again", () => {
  render(<App />);

  const circle = screen.getAllByTestId("completed-circle")[0];
  const todo = screen.getByText("Ещё одна тудушка");

  expect(circle).toHaveClass("circle completed", { exact: true });
  expect(todo).toHaveClass("todo-text completed", { exact: true });

  fireEvent.click(circle);

  expect(circle).toHaveClass("circle", { exact: true });
  expect(todo).toHaveClass("todo-text", { exact: true });
});

test("shows only active todos on filter active", () => {
  render(<App />);

  const activeFilter = screen.getByText(/Active.*/);

  fireEvent.click(activeFilter);

  const activeTodos = screen.queryAllByTestId("active-todo");
  const completedTodos = screen.queryAllByTestId("completed-todo");

  expect(activeTodos).toHaveLength(4);
  expect(completedTodos).toHaveLength(0);
});

test("shows only completed todos on filter completed", () => {
  render(<App />);

  const completedFilter = screen.getByText(/Completed.*/);

  fireEvent.click(completedFilter);

  const activeTodos = screen.queryAllByTestId("active-todo");
  const completedTodos = screen.queryAllByTestId("completed-todo");

  expect(activeTodos).toHaveLength(0);
  expect(completedTodos).toHaveLength(1);
});

test("clears completed todos on click Clear completed button", () => {
  render(<App />);

  let completedTodos = screen.queryAllByTestId("completed-todo");

  expect(completedTodos).toHaveLength(1);

  const clearCompleted = screen.getByTestId("clear-completed");

  fireEvent.click(clearCompleted);

  completedTodos = screen.queryAllByTestId("completed-todo");

  expect(completedTodos).toHaveLength(0);
});
