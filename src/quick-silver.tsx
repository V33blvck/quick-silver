import React, { useEffect, useState } from "react";
import { getItem, setItem } from "./utils/localStorage";

function QuickSilver_toDo() {
  //states for add and tasks
  //const [tasks, setTasks] = useState<Task[]>([]);
  //persisting tasks with local storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const item = getItem("tasks");
    return (item as Task[]) || [];
  });

  useEffect(() => {
    setItem("tasks", tasks);
  }, [tasks]);

  const [newTask, setNewTask] = useState<string>("");
  //states for search input
  const [searchTask, setSearchTask] = useState<string>("");
  const [searchMode, setSearchMode] = useState(false);
  //states for search button
  //state for search button
  const [isSearching, setIsSearching] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [filtering, setFiltering] = useState(false);

  //Task form object
  interface Task {
    id: string;
    text: string;
    completed: boolean;
    time: string;
    startTime: string;
  }

  //time fetching global variable used by task.startTime and displayCompleteTime
  const timestamp: number = Date.now();
  const date: Date = new Date(timestamp);

  //form function for creating new tasks
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newTask.trim() === "" && searchMode === false) {
      setErrorMessage("no input detected");
      console.log(errorMessage);
      return;
    }
    if (newTask.trim() !== "") {
      setErrorMessage("");
      console.log(errorMessage);
    }
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
    if (filtering && searchTask !== "") {
      setErrorMessage("");
    }
  }

  function searchBtn() {
    setIsSearching(!isSearching);
    if (searchTask.trim() === "") {
      setErrorMessage("no input detected");
      console.log(errorMessage);
    }
    if (searchTask !== "" && filterTask.length === 0) {
      setErrorMessage("task not found");
      console.log(errorMessage);
    }
    if (searchTask !== "" && filterTask.length !== 0) {
      setErrorMessage("");
      console.log(errorMessage);
    }
  }

  function resetError(value?: string) {
    const userInput = value || searchTask.trim() || newTask.trim();
    if (userInput !== "") {
      setErrorMessage("");
      setIsSearching(false);
    }
  }

  //changing between searching and adding tasks. resetting the in
  // puts.
  function toggleSearch() {
    setSearchMode(!searchMode);
    setNewTask("");
    setSearchTask("");
    setErrorMessage("");
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
            <div className="input-wrappers">
              <input
                type="text"
                placeholder="Search task"
                value={searchTask}
                onChange={(event) => {
                  setSearchTask(event.target.value);
                  doTheSearch(event.target.value);
                  resetError(event.target.value);
                }}
              />
              <button type="submit" className="search-Btn" onClick={searchBtn}>
                search
              </button>
              <button className="cancle-search" onClick={toggleSearch}>
                🚫
              </button>
            </div>
            <>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          </>
        ) : (
          <>
            <div className="input-wrappers">
              <input
                type="text"
                placeholder="Enter a task"
                name="task"
                value={newTask}
                onChange={(event) => {
                  setNewTask(event.target.value);
                  resetError(event.target.value);
                }}
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
            </div>
            <>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          </>
        )}
      </form>
      <ul className="item-container">
        {(isSearching ? filterTask : tasks).map((task, index) => (
          <div className="item-wrapper">
            <span className="li-wrapper">
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
                    className="move-up"
                    disabled={tasks.length === 1 || index === 0}
                    onClick={() => moveUp(index)}
                  >
                    <span className="move-up-emoji">☝️</span>
                  </button>
                  <button
                    className="move-down"
                    disabled={tasks.length === 1 || index === tasks.length - 1}
                    onClick={() => moveDown(index)}
                  >
                    <span className="move-down-emoji">👇</span>
                  </button>
                </span>
              </li>
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                ❌
              </button>
            </span>
            <span className="task-times">
              {task.completed ? (
                <p>completed: {task.time}</p>
              ) : (
                <p>started: {task.startTime}</p>
              )}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default QuickSilver_toDo;
