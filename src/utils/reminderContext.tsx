import { createContext } from "react";

interface Reminder {
  id: string;
  title: string;
  date: Date;
}
interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
}

export const ReminderContext = createContext<ReminderContextType | null>(null);
export function ReminderProvider({ children }) {}
