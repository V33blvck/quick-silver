import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddReminder() {
  const [selected, setSelected] = useState<Date>();
  const [newReminder, setNewReminder] = useState<string>("");
  const navigate = useNavigate();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function handleTitle() {}
  function openPrevious() {
    navigate("/");
  }

  return (
    <form onSubmit={handleTitle}>
      <div className="reminder-header">
        <button onClick={openPrevious}>
          <span className="previous-icon">
            <ChevronLeft size={30} />
          </span>
        </button>
        <h3>Add Reminder</h3>
      </div>
      <p>What do you want to be reminded?</p>
      <input
        className="title-input"
        type="text"
        placeholder="Enter your title..."
        value={newReminder}
        onChange={(event) => {
          setNewReminder(event.target.value);
        }}
      />
      <p>Select Date</p>
      <div className="calendar-wrapper">
        <DayPicker
          animate
          mode="single"
          selected={selected}
          onSelect={setSelected}
          navLayout="around"
          formatters={{ formatWeekdayName: (date) => weekdays[date.getDay()] }}
        />
      </div>
      <p>Select Time</p>
      <div className="times">
        <button>
          9:00 <br />
          AM
        </button>
        <button>
          12:00 <br />
          PM
        </button>
        <button>
          3:00
          <br />
          PM
        </button>
      </div>
      <button type="submit" className="create-reminder">
        Create Reminder
      </button>
    </form>
  );
}

export default AddReminder;
