import React, { useState } from "react";

function QuickSilver_toDo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  type Task = {
    id: number;
    text: string;
    completed: boolean;
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
      };
      setTasks((t) => [...t, task]);
      setNewTask("");
    }
  }

  function deleteTask(taskId: number) {
    const updatedTasks = tasks.filter((element) => element.id !== taskId);
    setTasks(updatedTasks);
  }

  function moveUp(index: number) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function toggleTask(taskId: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      }),
    );
  }

  return (
    <div className="to-do-list">
      <h1>Quick-Silver To-Do</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
              className="text"
            >
              {task.text}
            </span>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="checker"
            ></input>

            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
            <button className="move-up" onClick={() => moveUp(index)}>
              ☝️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickSilver_toDo;
