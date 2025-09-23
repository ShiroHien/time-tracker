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
}

const TaskTracker: React.FC<TaskTrackerProps> = ({
  tasks,
  taskHours,
  onAddTask,
  onDeleteTask,
  onChangeHours,
}) => {
  const [newTaskName, setNewTaskName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(newTaskName);
    setNewTaskName('');
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

      <div className="flex flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              hours={taskHours.get(task.id) || 0}
              onDelete={() => onDeleteTask(task.id)}
              onIncrement={() => onChangeHours(task.id, 1)}
              onDecrement={() => onChangeHours(task.id, -1)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-lg">No tasks yet.</p>
            <p>Add one to get started tracking your time!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTracker;
