import React from 'react';
import { Task } from '../types';
import { PlusIcon, MinusIcon, TrashIcon } from './icons';

interface TaskItemProps {
  task: Task;
  hours: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, hours, onIncrement, onDecrement, onDelete }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <span className="font-medium text-gray-200 text-lg">{task.name}</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={onDecrement} disabled={hours <= 0} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white">
            <MinusIcon />
          </button>
          <span className="text-xl font-bold w-12 text-center text-blue-400">{hours}h</span>
          <button onClick={onIncrement} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white">
            <PlusIcon />
          </button>
        </div>
        <button onClick={onDelete} className="text-gray-500 hover:text-red-500 transition-colors p-1">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
