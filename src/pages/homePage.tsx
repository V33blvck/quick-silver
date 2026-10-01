import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usPersistedState } from "../hooks/usePersistedState";
import type { Task } from "../utils/types";

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
          {displayGrid ? (
            <span className="display-emoji">🟰</span>
          ) : (
            <span className="display-emoji">🪟</span>
          )}
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

      <span className={displayGrid ? "group-wrapper" : "row-wrapper"}>
        <span
          className={
            displayGrid ? "individual-group-wrapper" : "individual-row-wrapper"
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
              displayGrid
                ? "individual-group-wrapper"
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
            >
              ❌
            </button>
          </span>
        ))}
      </span>
    </div>
  );
}
