import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddReminder() {
  const [selected, setSelected] = useState<Date>();
  const [newReminder, setNewReminder] = useState<string>("");
  const navigate = useNavigate();
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  function handleTitle() {}
  function openPrevious() {
    navigate("/");
  }

  function createReminder(selected: Date, newReminder: string) {
    navigate("/notes", {
      state: { selected: selected, newReminder: newReminder },
    });
  }

  return (
    <form onSubmit={handleTitle}>
      <div className="reminder-header">
        <button onClick={openPrevious}>
          <span className="previous-icon">
            <ChevronLeft size={27} />
          </span>
        </button>
        <h3>Add Reminder</h3>
      </div>
      <p className="title-question">What do you want to be reminded?</p>
      <input
        className="title-input"
        type="text"
        placeholder="Enter your title..."
        value={newReminder}
        onChange={(event) => {
          setNewReminder(event.target.value);
        }}
      />
      <p className="select-date">Select Date</p>
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
      <p className="select-time">Select Time</p>
      <div className="times">
        <button className="time-btn-1">
          9:00 <br />
          <p>AM</p>
        </button>
        <button className="time-btn-2">
          12:00 <br />
          <p>PM</p>
        </button>
        <button className="time-btn-3">
          3:00
          <br />
          <p>PM</p>
        </button>
      </div>
      <button
        type="submit"
        className="create-reminder"
        onClick={() => {
          if (selected) {
            createReminder(selected, newReminder);
          }
        }}
      >
        Create Reminder
      </button>
    </form>
  );
}

export default AddReminder;
