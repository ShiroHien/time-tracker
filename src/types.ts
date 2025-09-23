export interface Task {
  id: string;
  name: string;
}

export interface LogEntry {
  id: string;
  taskId: string;
  date: string; 
  hours: 1 | -1;
}

export type View = 'tasks' | 'analysis';
