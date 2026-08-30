import React, { useState, useRef, useEffect } from "react";

function QuickSilver_toDo() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask("");
    }
  }
  function deleteTask(index: number) {
    const updatedTasks = tasks.filter((element, i) => i !== index);
    setTasks(updatedTasks);
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

      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            <span className="text">{task}</span>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default QuickSilver_toDo;
