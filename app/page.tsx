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



  return (
    <div>
      <h1>My Todo App</h1>
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