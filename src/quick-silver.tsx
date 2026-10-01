import React, { useEffect, useState } from "react";
import { setItem } from "./utils/localStorage";
import { date } from "./utils/time";
import { useLocation } from "react-router-dom";
import type { Task } from "./utils/types";

interface todoProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

function QuickSilver_toDo({ tasks, setTasks }: todoProps) {
  //states for add and tasks
  //persisting tasks with local storage

  useEffect(() => {
    setItem("tasks", tasks);
  }, [tasks]);

  const location = useLocation();
  const groupName = location.state?.groupName;

  const [newTask, setNewTask] = useState<string>("");
  //states for search input
  const [searchTask, setSearchTask] = useState<string>("");
  const [searchMode, setSearchMode] = useState(false);
  //states for search button
  //state for search button
  const [isSearching, setIsSearching] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [filtering, setFiltering] = useState(false);

  //Task form object
  //time fetching global variable used by task.startTime and displayCompleteTime

  //form function for creating new tasks
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newTask.trim() === "" && searchMode === false && isToggling === false) {
      setErrorMessage("no input detected");
      return;
    }
    if (newTask.trim() !== "") {
      setErrorMessage("");
    }
    if (newTask.trim() !== "") {
      const task: Task = {
        id: crypto.randomUUID(),
        text: newTask.trim(),
        completed: false,
        time: "",
        startTime: date.toLocaleString(),
        taskGroup: groupName,
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
  const filterTask = tasks.filter(
    (tasks) =>
      tasks.text.toLowerCase().includes(searchTask) &&
      tasks.taskGroup === groupName,
  );

  /*
  live filtering for search bar
  separating the tasks into two arrays: 
  one that contains tasks with entered characters and the top(filtered tasks)
  and another that contains the ones without at the bottom(tasks !filteredTasks)
  */
  function doTheSearch(value?: string) {
    let stringToUse = value || searchTask;
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
    }
    if (searchTask !== "" && filterTask.length === 0) {
      setErrorMessage("task not found");
    }
    if (searchTask !== "" && filterTask.length !== 0) {
      setErrorMessage("");
    }
  }

  function resetError(value?: string) {
    const userInput = value || searchTask.trim() || newTask.trim();
    if (userInput !== "") {
      setErrorMessage("");
      setIsSearching(false);
      setIsToggling(false);
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

  const groupTasks = tasks.filter((task) => {
    return task.taskGroup === groupName;
  });

  return (
    <div className="to-do-list">
      <h1>{groupName.toUpperCase()}</h1>
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
              <button
                type="button"
                className="cancle-btn"
                onClick={toggleSearch}
              >
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
                type="button"
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
        {(isSearching ? filterTask : groupTasks).map((task, index) => (
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
