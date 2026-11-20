import { AlarmClock, Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// interface NotePadProps {
//   date: Date;
//   text: string;
// }

function NotePad() {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.state?.selected;
  const title = location.state?.newReminder;
  const [toDoNote, setToDoNote] = useState("");
  return (
    <>
      <header className="notes-header">
        <div className="notes-header-left">
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            <ChevronLeft size={27} />
          </button>
        </div>
        <div className="notes-header-right">
          <button>
            <Check size={24} />
          </button>
          <button>
            <span>
              <AlarmClock size={24} />
            </span>
          </button>
        </div>
      </header>
      <h2 className="note-title">{title}</h2>
      <textarea
        placeholder="Start Typing your notes..."
        rows={10}
        cols={50}
        className="note-pad"
        onChange={(e) => setToDoNote(e.target.value)}
      />
    </>
  );
}
export default NotePad;
