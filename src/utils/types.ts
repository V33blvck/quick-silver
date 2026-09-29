export interface Task {
    id: string;
    text: string;
    completed: boolean;
    time: string;
    startTime: string;
    taskGroup?: string;
  }