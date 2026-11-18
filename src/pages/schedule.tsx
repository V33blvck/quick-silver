import { useLocation } from "react-router-dom";
import { usPersistedState } from "../hooks/usePersistedState";
import { useEffect } from "react";
interface scheduleProps {
  date: Date;
  text: string;
}
function DisplaySchedule() {
  const location = useLocation();
  const selected = location.state?.selected;
  const title = location.state?.newReminder;
  const [scheduleList, setScheduleList] = usPersistedState<scheduleProps[]>(
    "scheduleList",
    [],
  );

  useEffect(() => {
    if (selected && title) {
      setScheduleList((prev) => [
        ...prev,
        {
          date: selected.toISOString(),
          text: title,
        },
      ]);
    }
  }, [location.key]);

  return (
    <>
      <h3>Your Schedule</h3>
      <div>
        {scheduleList.map((item, index) => (
          <button key={index}>
            <span>{new Date(item.date).toLocaleDateString()}</span>
            <br />
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default DisplaySchedule;
