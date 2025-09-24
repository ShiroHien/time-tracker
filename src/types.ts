export interface Task {
  id: string;
  name: string;
  /** task completed/archived flag */
  done?: boolean;
}

export interface LogEntry {
  id: string;
  taskId: string;
  date: string; 
  hours: 1 | -1;
}

export type View = 'tasks' | 'analysis';
