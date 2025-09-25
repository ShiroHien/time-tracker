import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { PlusIcon, MinusIcon, TrashIcon } from './icons';

interface TaskItemProps {
  task: Task;
  hours: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
  onToggleDone?: () => void;
  onRename?: (id: string, newName: string) => void;
  // drag events
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, hours, onIncrement, onDecrement, onDelete, onToggleDone, onRename, draggable, onDragStart, onDragOver, onDrop }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(task.name);
  }, [task.name]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const finishEdit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== task.name) onRename?.(task.id, trimmed);
    else setValue(task.name);
  };

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragOver={(e) => onDragOver?.(e, task.id)}
      onDrop={(e) => onDrop?.(e, task.id)}
      className={`bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 ${task.done ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={!!task.done} onChange={onToggleDone} aria-label={task.done ? 'Mark as active' : 'Mark as done'} className="w-4 h-4" />
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') finishEdit(); if (e.key === 'Escape') { setEditing(false); setValue(task.name); } }}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-100"
          />
        ) : (
          <span onDoubleClick={() => setEditing(true)} className="font-medium text-gray-200 text-lg select-none">{task.name}</span>
        )}
      </div>
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
