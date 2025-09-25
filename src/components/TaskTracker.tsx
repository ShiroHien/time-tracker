import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { PlusIcon } from './icons';

interface TaskTrackerProps {
  tasks: Task[];
  taskHours: Map<string, number>;
  onAddTask: (name: string) => void;
  onDeleteTask: (taskId: string) => void;
  onChangeHours: (taskId: string, amount: 1 | -1) => void;
  onToggleDone?: (taskId: string) => void;
  onRename?: (taskId: string, newName: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({
  tasks,
  taskHours,
  onAddTask,
  onDeleteTask,
  onChangeHours,
  onToggleDone,
  onRename,
  onReorder,
}) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [tab, setTab] = useState<'active' | 'done'>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(newTaskName);
    setNewTaskName('');
  };

  // drag state
  const dragItem = React.useRef<string | null>(null);
  const dragOverItem = React.useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragItem.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragOverItem.current = id;
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    const fromId = dragItem.current;
    const toId = id;
    if (!fromId || !toId || fromId === toId) return;
    const fromIndex = tasks.findIndex(t => t.id === fromId);
    const toIndex = tasks.findIndex(t => t.id === toId);
    if (fromIndex >= 0 && toIndex >= 0 && onReorder) onReorder(fromIndex, toIndex);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="flex flex-col gap-6 text-white animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-100">My Tasks</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={!newTaskName.trim()}
        >
          <PlusIcon />
          <span>Add Task</span>
        </button>
      </form>

      <div className="flex items-center gap-2">
        <button className={`px-3 py-1 rounded ${tab === 'active' ? 'bg-blue-600' : 'bg-gray-700'}`} onClick={() => setTab('active')}>Active</button>
        <button className={`px-3 py-1 rounded ${tab === 'done' ? 'bg-blue-600' : 'bg-gray-700'}`} onClick={() => setTab('done')}>Done</button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.filter(t => (tab === 'active' ? !t.done : t.done)).length > 0 ? (
          tasks.filter(t => (tab === 'active' ? !t.done : t.done)).map(task => (
            <TaskItem
              key={task.id}
              task={task}
              hours={taskHours.get(task.id) || 0}
              onDelete={() => onDeleteTask(task.id)}
              onIncrement={() => onChangeHours(task.id, 1)}
              onDecrement={() => onChangeHours(task.id, -1)}
              onToggleDone={() => onToggleDone && onToggleDone(task.id)}
              onRename={(id, newName) => onRename && onRename(id, newName)}
              draggable
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-lg">No tasks.</p>
            <p>{tab === 'active' ? 'Add one to get started tracking your time!' : 'No completed tasks yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTracker;
