"use client"

import { useState, useEffect } from "react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";

type Task = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: string;
  is_archived: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const createTask = async (newTask: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const created = await res.json();
    setTasks([...tasks, created]);
  };

  const archiveTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: 1 }),
    });
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortTasks = (key: "topic" | "status" | "due_date") => {
    const sorted = [...tasks].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setTasks(sorted);
  };



  return (
    <div>
      <h1>My Todo App</h1>
      <div className="flex gap-2 mb-4">
      <button onClick={() => sortTasks("topic")} className="px-3 py-1 border rounded">Sort by Topic</button>
      <button onClick={() => sortTasks("status")} className="px-3 py-1 border rounded">Sort by Status</button>
      <button onClick={() => sortTasks("due_date")} className="px-3 py-1 border rounded">Sort by Due Date</button>
    </div>
      <TaskForm onCreate={createTask}/>
      <ul>
        {tasks.filter(task => !task.is_archived).map(task => (
          <li key={task.id}>
            <TaskCard task={task} onArchive={archiveTask} />
          </li>
        ))}
      </ul>
    </div>
  );
}