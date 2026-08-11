"use client"

import { useState, useEffect } from "react";

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
  
    return (
      <div>
        <h1>My Todo App</h1>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
            {task.title} — {task.status}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
