import React, { useState, useMemo } from 'react';
import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Task, LogEntry } from '../types';

interface AnalysisProps {
  tasks: Task[];
  logs: LogEntry[];
}

type TimeFrame = 'day' | 'week' | 'month' | 'overall';

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // sets week start to Monday
  const start = new Date(date.setDate(diff));
  start.setHours(0,0,0,0);
  return start;
};

const isSameWeek = (d1: Date, d2: Date) => {
    return getStartOfWeek(d1).getTime() === getStartOfWeek(d2).getTime();
}

const isSameMonth = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#fa8072', '#7b68ee'];

const Analysis: React.FC<AnalysisProps> = ({ tasks, logs }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('overall');
  const [chartType, setChartType] = useState<'pie'>('pie');
  const [includeDone, setIncludeDone] = useState(true);

  const filteredLogs = useMemo(() => {
    const now = new Date();
    if (timeFrame === 'overall') return logs;
    return logs.filter(log => {
      const logDate = new Date(log.date);
      if (timeFrame === 'day') return isSameDay(logDate, now);
      if (timeFrame === 'week') return isSameWeek(logDate, now);
      if (timeFrame === 'month') return isSameMonth(logDate, now);
      return false;
    });
  }, [logs, timeFrame]);

  const analysisData = useMemo(() => {
    const dataMap = new Map<string, number>();
    // optionally filter logs by whether their task is done or not
    const validTaskIds = new Set(tasks.filter(t => includeDone ? true : !t.done).map(t => t.id));

    filteredLogs.forEach(log => {
      if (!validTaskIds.has(log.taskId) && tasks.some(t => t.id === log.taskId)) return; // skip logs for done tasks when excluded
      dataMap.set(log.taskId, (dataMap.get(log.taskId) || 0) + log.hours);
    });

    const taskNameMap = new Map(tasks.map(t => [t.id, t.name]));
    
    return Array.from(dataMap.entries())
      .map(([taskId, hours]) => ({
        name: taskNameMap.get(taskId) || 'Deleted Task',
        hours,
      }))
      .filter(item => item.hours > 0)
      .sort((a, b) => b.hours - a.hours);
  }, [filteredLogs, tasks]);

  const totalHours = useMemo(() => analysisData.reduce((sum, item) => sum + item.hours, 0), [analysisData]);

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const TimeFrameButton: React.FC<{ frame: TimeFrame, label: string }> = ({ frame, label }) => (
    <button
      onClick={() => setTimeFrame(frame)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        timeFrame === frame ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-6 text-white h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Analysis</h1>
          <div className="flex gap-2 p-1 bg-gray-800 rounded-lg items-center">
            <TimeFrameButton frame="day" label="Today" />
            <TimeFrameButton frame="week" label="This Week" />
            <TimeFrameButton frame="month" label="This Month" />
            <TimeFrameButton frame="overall" label="Overall" />
              <div className="ml-2 flex items-center gap-2">
                <label className="text-sm text-gray-300">Include done</label>
                <input type="checkbox" checked={includeDone} onChange={(e) => setIncludeDone(e.target.checked)} className="w-4 h-4" />
              </div>
        </div>
      </div>
      
      {analysisData.length > 0 ? (
        <div className="flex-1 bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col">
            <div className="flex justify-end items-center mb-4 gap-4">
                <span className="text-gray-400 text-sm">Total Hours: <span className="font-bold text-lg text-blue-400">{totalHours}</span></span>
                <div className="flex gap-1 p-1 bg-gray-700 rounded-md">
                    <button onClick={() => setChartType('pie')} className={`px-3 py-1 text-xs rounded transition-colors ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}>Pie</button>
                </div>
            </div>
          <ResponsiveContainer width="100%" height="100%">
            {
                <PieChart>
                    <Pie
                        data={analysisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderPieLabel}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="hours"
                        nameKey="name"
                    >
                        {analysisData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#adb1b9ff', border: '1px solid #4A5568', borderRadius: '0.5rem' }} />
                    <Legend />
                </PieChart>
            }
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
          <p>No data available for this period. Start tracking your tasks!</p>
        </div>
      )}
    </div>
  );
};

export default Analysis;
