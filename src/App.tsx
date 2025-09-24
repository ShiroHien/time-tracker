import React, { useState, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Task, LogEntry, View } from './types';
import TaskTracker from './components/TaskTracker';
import Analysis from './components/Analysis';
import { ChartBarIcon, ListBulletIcon } from './components/icons';

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('logs', []);
  const [view, setView] = useState<View>('tasks');

  const taskHours = useMemo(() => {
    const hoursMap = new Map<string, number>();
    logs.forEach(log => {
      hoursMap.set(log.taskId, (hoursMap.get(log.taskId) || 0) + log.hours);
    });
    return hoursMap;
  }, [logs]);

  const addTask = (name: string) => {
    if (name.trim() === '') return;
    const newTask: Task = { id: crypto.randomUUID(), name: name.trim(), done: false };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    // remove the task entry but keep logs/analysis (they are preserved)
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleDone = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
  };

  const changeHours = (taskId: string, amount: 1 | -1) => {
    const currentHours = taskHours.get(taskId) || 0;
    if (currentHours + amount < 0) return;

    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      taskId,
      date: new Date().toISOString(),
      hours: amount,
    };
    setLogs(prev => [...prev, newLog]);
  };

  const NavButton: React.FC<{
    targetView: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ targetView, icon, label }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        view === targetView
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="w-[800px] h-[600px] bg-gray-900 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-700">
      <header className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <nav className="flex items-center gap-2">
          <NavButton targetView="tasks" icon={<ListBulletIcon />} label="Tasks" />
          <NavButton targetView="analysis" icon={<ChartBarIcon />} label="Analysis" />
        </nav>
        <div className="text-gray-400 font-semibold text-sm">Time Tracker</div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
        {view === 'tasks' ? (
          <TaskTracker
            tasks={tasks}
            taskHours={taskHours}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onChangeHours={changeHours}
            onToggleDone={toggleDone}
          />
        ) : (
          <Analysis tasks={tasks} logs={logs} />
        )}
      </main>
    </div>
  );
};

export default App;
