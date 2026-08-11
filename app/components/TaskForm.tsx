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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        required
        className="form-input"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="form-textarea"
      />
      <input
        type="date"
        value={due_date}
        onChange={e => setDueDate(e.target.value)}
        required
        className="form-input"
      />
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Topic (e.g., Work, Personal)"
        required
        className="form-input"
      />
      <button type="submit" className="btn-primary">
        Create Task
      </button>
    </form>
  );
}