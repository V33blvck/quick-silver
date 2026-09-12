import React, { useState } from "react";

function QuickSilver_toDo() {
  //states for add and tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  //states for search input
  const [searchTask, setSearchTask] = useState<string>("");
  const [searchMode, setSearchMode] = useState(false);
  //states for search button
  const [isSearching, setIsSearching] = useState(false);
  const [filtering, setFiltering] = useState(false);

  interface Task {
    id: string;
    text: string;
    completed: boolean;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
  /*function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTask(event.target.value);
  }*/

  /*
    making filtered task float to the top
    displaying two filtered arrays from tasks, filtered task: the search
    and task.filter the task without the filtered item
    displaying filteredTask then task.filter after in sortedTasks.
  */
  //this is the global filter
  const filterTask = tasks.filter((tasks) =>
    tasks.text.toLowerCase().includes(searchTask),
  );
  ("");

  function doTheSearch(value?: string) {
    let stringToUse = value || searchTask;
    console.log(value);
    const filteredTask = tasks.filter((tasks) =>
      tasks.text.toLowerCase().includes(stringToUse.toLowerCase()),
    );
    if (filteredTask.length !== 0) {
      const sortedTasks = [
        ...filteredTask,
        ...tasks.filter((task) => !filteredTask.includes(task)),
      ];
      setTasks(sortedTasks);
    }
    setFiltering(true);
    if (filtering && filteredTask.length === 0) {
      alert("task not found");
    }
  }

  function toggleSearch() {
    setSearchMode(!searchMode);
    setNewTask("");
    setSearchTask("");
  }

  return (
    <div className="to-do-list">
      <h1>Quick-Silver To-Do</h1>
      <form onSubmit={handleSubmit} className="task-input">
        {searchMode ? (
          <>
            <input
              type="text"
              placeholder="Search task"
              value={searchTask}
              onChange={(event) => {
                setSearchTask(event.target.value);
                doTheSearch(event.target.value);
              }}
            />
            <button
              type="submit"
              className="search-Btn"
              onClick={() => setIsSearching(!isSearching)}
            >
              search
            </button>
            <button className="cancle-search" onClick={toggleSearch}>
              🚫
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter a task"
              name="task"
              value={newTask}
              onChange={handleInputChange}
            />
            <button className="add-button" type="submit">
              Add
            </button>
            <button
              className="toggleSearch"
              onClick={toggleSearch}
              disabled={tasks.length === 1 || tasks.length === 0}
            >
              🔎
            </button>
          </>
        )}
      </form>

      <ul className="item-container">
        {(isSearching ? filterTask : tasks).map((task, index) => (
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
                ❌
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
