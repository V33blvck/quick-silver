import React, { useState } from "react";

function QuickSilver_toDo() {
  //states for add and tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  //states for search input
  const [searchTask, setSearchTask] = useState<string>("");
  const [searchMode, setSearchMode] = useState(false);
  //states for search button
  //const [isAdding, setIsAdding] = useState(false);
  //state for search button
  const [isSearching, setIsSearching] = useState(false);
  //state for live filtering
  const [filtering, setFiltering] = useState(false);

  //Task form object
  interface Task {
    id: string;
    text: string;
    completed: boolean;
    time: string;
    startTime: string;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  //time fetching global variable used by task.startTime and displayCompleteTime
  const timestamp: number = Date.now();
  const date: Date = new Date(timestamp);

  //form function for creating new tasks
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newTask.trim() !== "") {
      const task: Task = {
        id: crypto.randomUUID(),
        text: newTask.trim(),
        completed: false,
        time: "",
        startTime: date.toLocaleString(),
      };
      setTasks((t) => [...t, task]);
      setNewTask("");
    }
  }
  /*
    setIsAdding(true);
    if (
      (isAdding && newTask.trim() === "") ||
      (isSearching && searchTask.trim() === "")
    ) {
      console.log("no input detected");
      alert("no input detected");
      //setErrorMessage("no Input Detected");
    }
    setErrorMessage("");*/

  function deleteTask(taskId: string) {
    const updatedTasks = tasks.filter((element) => element.id !== taskId);
    setTasks(updatedTasks);
  }

  //switching indexes with the task above
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
  //switching indexes with the task below
  function moveDown(index: number) {
    const updatedTasks = [...tasks];
    [updatedTasks[index], updatedTasks[index + 1]] = [
      updatedTasks[index + 1],
      updatedTasks[index],
    ];
    setTasks(updatedTasks);
  }

  //toggle for task.completed state
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

  //this is the global filter
  const filterTask = tasks.filter((tasks) =>
    tasks.text.toLowerCase().includes(searchTask),
  );

  /*
  live filtering for search bar
  separating the tasks into two arrays: 
  one that contains tasks with entered characters and the top(filtered tasks)
  and another that contains the ones without at the bottom(tasks !filteredTasks)
  */
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

  //changing between searching and adding tasks. resetting their inputs.
  function toggleSearch() {
    setSearchMode(!searchMode);
    setNewTask("");
    setSearchTask("");
  }
  //Time that will be updated everytime you check the checkbox.
  //setting task.time to be date.now .toLocaleString
  function displayCompleteTime(task: Task, taskId: string) {
    if (task.completed === false) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              time: date.toLocaleString(),
            };
          }
          return task;
        }),
      );
    }
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
          <div className="item-wrapper">
            <li key={task.id} className="to-do-item">
              <span className="item-title">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    toggleTask(task.id);
                    displayCompleteTime(task, task.id);
                  }}
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
            <span className="task-times">
              <>
                {task.completed ? (
                  <p>completed: {task.time}</p>
                ) : (
                  <p>started: {task.startTime}</p>
                )}
              </>
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default QuickSilver_toDo;
