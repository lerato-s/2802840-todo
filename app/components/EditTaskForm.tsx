"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: string;
  is_archived: number;
};

type EditTaskFormProps = {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => void;
};

export default function EditTaskForm({ task, onUpdate }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [due_date, setDueDate] = useState(task.due_date);
  const [topic, setTopic] = useState(task.topic);
  const [status, setStatus] = useState(task.status || "Todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(task.id, { title, description, due_date, topic, status });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        required
        className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 bg-white/80 border-2 border-[#FFB7C5]/30 focus:ring-2 focus:ring-[#FFB7C5]/50 focus:bg-white/95 focus:border-[#FFB7C5] text-[#4A3728] placeholder-[#C9AFA0] outline-none"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 bg-white/80 border-2 border-[#FFB7C5]/30 focus:ring-2 focus:ring-[#FFB7C5]/50 focus:bg-white/95 focus:border-[#FFB7C5] text-[#4A3728] placeholder-[#C9AFA0] outline-none resize-none min-h-[60px]"
      />
      <input
        type="date"
        value={due_date}
        onChange={e => setDueDate(e.target.value)}
        required
        className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 bg-white/80 border-2 border-[#FFB7C5]/30 focus:ring-2 focus:ring-[#FFB7C5]/50 focus:bg-white/95 focus:border-[#FFB7C5] text-[#4A3728] outline-none"
      />
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Topic (e.g., Work, Personal)"
        required
        className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 bg-white/80 border-2 border-[#FFB7C5]/30 focus:ring-2 focus:ring-[#FFB7C5]/50 focus:bg-white/95 focus:border-[#FFB7C5] text-[#4A3728] placeholder-[#C9AFA0] outline-none"
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 bg-white/80 border-2 border-[#FFB7C5]/30 focus:ring-2 focus:ring-[#FFB7C5]/50 focus:bg-white/95 focus:border-[#FFB7C5] text-[#4A3728] outline-none"
      >
        <option value="Todo">Todo</option>
        <option value="In-Progress">In-Progress</option>
        <option value="Complete">Complete</option>
      </select>
      <button 
        type="submit" 
        className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-[#FFB7C5] to-[#FF8FA3] text-white shadow-[0_4px_15px_rgba(255,183,197,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(255,183,197,0.4)] active:scale-[0.98]"
      >
        Save Changes
      </button>
    </form>
  );
}