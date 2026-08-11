"use client"

import { useState } from "react";

type TaskFormProps = {
  onCreate: (task: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) => void;
};

export default function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due_date, setDueDate] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, description, due_date, topic });
    setTitle("");
    setDescription("");
    setDueDate("");
    setTopic("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 p-4 border rounded-xl">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="border p-2 rounded"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={due_date}
        onChange={e => setDueDate(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Topic"
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="px-3 py-1 border rounded bg-black text-white">
        Create Task
      </button>
    </form>
  );
}