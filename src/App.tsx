import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homePage";
import QuickSilver_toDo from "./quick-silver";
import type { Task } from "./utils/types";
import { useState } from "react";
import { getItem } from "./utils/localStorage";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const item = getItem("tasks");
    return (item as Task[]) || [];
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomePage tasks={tasks} setTasks={setTasks} />}
          />
          <Route
            path="/todo"
            element={<QuickSilver_toDo tasks={tasks} setTasks={setTasks} />}
          />
        </Routes>

        {/*<QuickSilver_toDo/> <HomePage />;*/}
      </BrowserRouter>
    </>
  );
}

export default App;
