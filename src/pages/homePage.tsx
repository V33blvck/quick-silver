import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usPersistedState } from "../hooks/usePersistedState";
import type { Task } from "../utils/types";

interface groupProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function HomePage({ tasks, setTasks }: groupProps) {
  const [groupTasks, setGroupTasks] = usPersistedState<Group[]>("group", []); //<Group[]>([]);
  const [groupText, setGroupText] = useState("");
  const navigate = useNavigate();
  interface Group {
    text: string;
    id: string;
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (groupText.trim() !== "") {
      const group: Group = {
        text: groupText,
        id: crypto.randomUUID(),
      };
      setGroupTasks((g) => [...g, group]);
      setGroupText("");
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
  return (
    <div className="Group-display">
      <h1 className="home-header">Quick-Silver To-Do</h1>
      <form onSubmit={handleSubmit} className="group-input">
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
      </form>

      {groupTasks.map((group) => (
        <span className="group-wrapper">
          <span className="individual-group-wrapper">
            {" "}
            <button
              key={group.id}
              className="group-item"
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
        </span>
      ))}
    </div>
  );
}
