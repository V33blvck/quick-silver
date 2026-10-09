import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usPersistedState } from "../hooks/usePersistedState";
import type { Task } from "../utils/types";
import { Tooltip } from "react-tooltip";
import ProgressBar from "../utils/progressBar";

interface groupProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}
interface Group {
  text: string;
  id: string;
}

export default function HomePage({ tasks, setTasks }: groupProps) {
  const [groupTasks, setGroupTasks] = usPersistedState<Group[]>("group", []); //<Group[]>([]);
  const [groupText, setGroupText] = useState("");
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [displayGrid, setDisplayGrid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (groupText.trim() !== "") {
      const group: Group = {
        text: groupText,
        id: crypto.randomUUID(),
      };
      setGroupTasks((g) => [...g, group]);
      setGroupText("");
      closeDialog();
    }
    if (groupText.trim() === "") {
      setErrorMessage("No Input Detected");
    }
  }

  function handleGroup(event: React.ChangeEvent<HTMLInputElement>) {
    setGroupText(event.target.value);
  }

  function openGroup(groupName: string) {
    navigate("/todo", { state: { groupName } });
  }

  function deleteGroup(groupId: string, tasks: Task[]) {
    const updatedGroup = groupTasks.filter((element) => element.id !== groupId);
    setGroupTasks(updatedGroup);
    const selectedGroup = groupTasks.find((group) => group.id === groupId);
    const updatedTasks = tasks.filter(
      (tasks) => tasks.taskGroup !== selectedGroup?.text,
    );
    setTasks(updatedTasks);
  }

  function openDialog() {
    dialogRef.current?.showModal();
    setErrorMessage("");
  }
  function closeDialog() {
    dialogRef.current?.close();
    setErrorMessage("");
  }
  function handleClickDialog(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  }
  function groupProgress(groupName: string) {
    const groupTasks = tasks.filter((task) => {
      return task.taskGroup === groupName;
    });
    if (groupTasks.length === 0) {
      return 0;
    }
    const completedTasks = groupTasks.filter((task) => task.completed).length;
    return (completedTasks / groupTasks.length) * 100;
  }

  return (
    <div className="Group-display">
      <header>
        <h1 className="home-header">Quick-Silver To-Do</h1>
        <button
          onClick={() => {
            setDisplayGrid(!displayGrid);
          }}
          className="display-btn"
        >
          {displayGrid ? <span>🟰</span> : <span>🪟</span>}
        </button>
      </header>

      <dialog ref={dialogRef} onClick={handleClickDialog}>
        <span className="popup">
          <form onSubmit={handleSubmit} className="group-input" method="dialog">
            <input
              onChange={handleGroup}
              placeholder="Enter Group Name"
              value={groupText}
              type="text"
              className="enter-group"
            />
            <button type="submit" className="add-button">
              Add
            </button>
            <button onClick={closeDialog} className="cancle-btn">
              🚫
            </button>
            <>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          </form>
        </span>
      </dialog>

      <span className={displayGrid ? "grid-wrapper" : "row-wrapper"}>
        <span
          className={
            displayGrid ? "individual-grid-wrapper" : "individual-row-wrapper"
          }
        >
          <button
            onClick={openDialog}
            className={displayGrid ? "create-group-grid" : "create-group-row"}
          >
            + Create Task Group
          </button>
        </span>
        {groupTasks.map((group) => (
          <span
            className={
              displayGrid ? "progress-wrapper-grid" : "progress-wrapper-row"
            }
          >
            <span
              className={
                displayGrid
                  ? "individual-grid-wrapper"
                  : "individual-row-wrapper"
              }
            >
              <button
                key={group.id}
                className={displayGrid ? "group-item-grid" : "group-item-row"}
                onClick={() => {
                  openGroup(group.text);
                }}
              >
                {group.text}
              </button>
              <button
                onClick={() => deleteGroup(group.id, tasks)}
                className="delete-button"
                data-tooltip-id="group-tooltips"
                data-tooltip-content="Delete group"
              >
                ❌
              </button>
            </span>
            <div className="progress-bar">
              <ProgressBar
                progress={groupProgress(group.text)}
                height="10px"
                color="#2196f3"
                backgroundColor="#ddd"
              />
            </div>
          </span>
        ))}
      </span>
      <Tooltip
        id="group-tooltips"
        place="top"
        style={{
          backgroundColor: "#333",
          color: "#fff",
          fontSize: "0.7rem",
        }}
      />
    </div>
  );
}
