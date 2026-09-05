import React, { useState } from "react";

function QuickSilver_toDo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [searchTask, setSearchTask] = useState<string>("");
  const [searchMode, setSearchMode] = useState(false);

  type Task = {
    id: string;
    text: string;
    completed: boolean;
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: crypto.randomUUID(),
        text: newTask.trim(),
        completed: false,
      };
      setTasks((t) => [...t, task]);
      setNewTask("");
    }
  }

  function deleteTask(taskId: string) {
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
  function moveDown(index: number) {
    const updatedTasks = [...tasks];
    [updatedTasks[index], updatedTasks[index + 1]] = [
      updatedTasks[index + 1],
      updatedTasks[index],
    ];
    setTasks(updatedTasks);
  }

  function toggleTask(taskId: string) {
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

  //setting the input to be equal to searchTask
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTask(event.target.value);
  }

  //making filtered task float to the top
  //if the filtered tasks index is not equal to 0 swap it with the item above it

  function searchBtn() {
    const filteredTask = tasks.filter((tasks) =>
      tasks.text.toLowerCase().includes(searchTask.toLowerCase()),
    );
    if (filteredTask.length !== 0) {
      const sortedTasks = [
        ...filteredTask,
        ...tasks.filter((task) => !filteredTask.includes(task)),
      ];
      setTasks(sortedTasks);
    }
    if (filteredTask.length === 0) {
      alert("task not found");
    }
  }

  return (
    <div className="to-do-list">
      <h1>Quick-Silver To-Do</h1>
      <div className="task-input">
        {searchMode ? (
          <>
            <input
              type="text"
              placeholder="Search task"
              value={searchTask}
              onChange={handleSearch}
            />
            <button className="searchBtn" onClick={() => searchBtn()}>
              search
            </button>
            <button
              className="cancle-search"
              onClick={() => {
                setSearchMode(!searchMode);
                setSearchTask("");
              }}
            >
              🚫
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter a task"
              value={newTask}
              onChange={handleInputChange}
            />
            <button className="add-button" onClick={addTask}>
              Add
            </button>
            <button
              className="toggleSearch"
              onClick={() => {
                setSearchMode(!searchMode);
                setNewTask("");
              }}
            >
              🔎
            </button>
          </>
        )}
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={task.id} className="to-do-item">
            <span className="item-title">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="checker"
              ></input>
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
                className="text"
              >
                {task.text}
              </span>
            </span>

            <span className="item-actions">
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
              <button
                className="move-up"
                disabled={tasks.length === 1 || index === 0}
                onClick={() => moveUp(index)}
              >
                ☝️
              </button>
              <button
                className="move-down"
                disabled={tasks.length === 1 || index === tasks.length - 1}
                onClick={() => moveDown(index)}
              >
                👇
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickSilver_toDo;
