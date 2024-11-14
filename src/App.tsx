import { KeyboardEvent, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Todo } from "./typings";
import "./App.css";

function App() {
  const [newTodoText, setNewTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([
    { id: nanoid(8), text: "Тестовое задание" },
    { id: nanoid(8), text: "Прекрасный код", completed: true },
    { id: nanoid(8), text: "Покрытие тестами" },
  ]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const selectedTodos = {
    all: todos,
    active: activeTodos,
    completed: completedTodos,
  }[filter]
    .slice(0)
    .reverse();

  const addTodo = () => {
    if (newTodoText.length === 0) return;

    setTodos((prev) => {
      const newTodos = [...prev, { id: nanoid(8), text: newTodoText }];

      localStorage.setItem("todos", JSON.stringify(newTodos));

      return newTodos;
    });

    setNewTodoText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    addTodo();
  };

  const handleClickCircle = (id: string) => {
    setTodos((prev) => {
      const todoIndex = prev.findIndex((todo) => todo.id === id);
      const newTodos = prev
        .slice(0, todoIndex)
        .concat([
          {
            id,
            text: prev[todoIndex].text,
            completed: !prev[todoIndex].completed,
          },
        ])
        .concat(prev.slice(todoIndex + 1));

      localStorage.setItem("todos", JSON.stringify(newTodos));

      return newTodos;
    });
  };

  const handleClearCompleted = () => {
    setTodos((prev) => {
      const newTodos = prev.filter((todo) => !todo.completed);

      localStorage.setItem("todos", JSON.stringify(newTodos));

      return newTodos;
    });
  };

  useEffect(() => {
    const todos = localStorage.getItem("todos");

    if (todos) setTodos(JSON.parse(todos));
  }, []);

  return (
    <div className="app">
      <header>
        <h1 className="header">todos</h1>
      </header>
      <main className="todos-container">
        <div className="todo-input">
          <input
            placeholder="What needs to be done?"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="add-button" onClick={addTodo}>
            +
          </button>
        </div>
        <div className="todos-list">
          <ul>
            {selectedTodos.map((todo) => {
              return (
                <li>
                  <button
                    onClick={() => handleClickCircle(todo.id)}
                    className={`circle ${todo.completed ? "completed" : ""}`}
                  ></button>
                  <div
                    className={`todo-text ${todo.completed ? "completed" : ""}`}
                  >
                    {todo.text}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <nav className="controls">
          <div className="filters">
            <button
              className={`btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All {todos.length}
            </button>
            <button
              className={`btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active {activeTodos.length}
            </button>
            <button
              className={`btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed {completedTodos.length}
            </button>
          </div>
          <div className="clear-completed" onClick={handleClearCompleted}>
            <button className="btn">
              <span className="icon">&#x1F5D1;</span>
              <span className="clear-completed-text">Clear completed</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

export default App;
