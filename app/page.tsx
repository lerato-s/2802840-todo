"use client"

import { useState, useEffect } from "react";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import EditTaskForm from "./components/EditTaskForm";

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
  const [showArchived, setShowArchived] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortKey, setSortKey] = useState<"topic" | "status" | "due_date" | null>(null);

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

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setTasks(tasks.map(task => task.id === id ? updated : task));
    setEditingTask(null);
  };

  const archiveTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: 1 }),
    });
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, is_archived: 1 } : task
    ));
  };

  const restoreTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: 0 }),
    });
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, is_archived: 0 } : task
    ));
  };

  const sortTasks = (key: "topic" | "status" | "due_date") => {
    setSortKey(key);
    const sorted = [...tasks].sort((a, b) => {
      const valA = a[key] || "";
      const valB = b[key] || "";
      
      
      if (key === "due_date") {
        return new Date(valA).getTime() - new Date(valB).getTime();
      }
      
      
      return valA.toLowerCase().localeCompare(valB.toLowerCase());
    });
    setTasks(sorted);
  };

  const activeTasks = tasks.filter(task => !task.is_archived);
  const archivedTasks = tasks.filter(task => task.is_archived);

  return (
    <div className="max-w-4xl mx-auto px-8 py-10 md:py-16 flex-1">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gradient-title">
        My Todo App
      </h1>

      {/* Toggle buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
            !showArchived 
              ? 'bg-[#FFB7C5] text-white shadow-md' 
              : 'bg-[#FFF8E7] text-[#6B4F3A] hover:bg-[#FFB7C5]/20'
          }`}
        >
          Active Tasks ({activeTasks.length})
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
            showArchived 
              ? 'bg-[#8B7A6E] text-white shadow-md' 
              : 'bg-[#FFF8E7] text-[#6B4F3A] hover:bg-[#8B7A6E]/20'
          }`}
        >
          Archived ({archivedTasks.length})
        </button>
      </div>

      {/* Sort Buttons */}
      {!showArchived && (
        <div className="flex flex-wrap gap-3 mb-8 p-5 rounded-2xl bg-[#FFF8E7]/60 border-2 border-[#FFB7C5]/20 backdrop-blur-sm">
          <button 
            onClick={() => sortTasks("topic")} 
            className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 bg-[#FFB7C5]/10 hover:bg-[#FFB7C5]/20 hover:-translate-y-0.5 border-2 border-[#FFB7C5]/20 hover:border-[#FFB7C5] text-[#6B4F3A]"
          >
            Sort by Topic
          </button>
          <button 
            onClick={() => sortTasks("status")} 
            className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 bg-[#FFB7C5]/10 hover:bg-[#FFB7C5]/20 hover:-translate-y-0.5 border-2 border-[#FFB7C5]/20 hover:border-[#FFB7C5] text-[#6B4F3A]"
          >
            Sort by Status
          </button>
          <button 
            onClick={() => sortTasks("due_date")} 
            className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 bg-[#FFB7C5]/10 hover:bg-[#FFB7C5]/20 hover:-translate-y-0.5 border-2 border-[#FFB7C5]/20 hover:border-[#FFB7C5] text-[#6B4F3A]"
          >
            Sort by Due Date
          </button>
        </div>
      )}

      {/* Create Task Form */}
      {!showArchived && (
        <div className="p-8 mb-10 rounded-2xl bg-pastel-form border-2 border-[#FFB7C5]/30 shadow-[0_8px_32px_rgba(255,183,197,0.15)] animate-slide-in">
          <h2 className="text-2xl font-semibold mb-5 text-[#4A3728]">Create New Task</h2>
          <TaskForm onCreate={createTask} />
        </div>
      )}

      {/* Edit Task Modal/Form */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold text-[#4A3728]">Edit Task</h2>
              <button
                onClick={() => setEditingTask(null)}
                className="text-[#8B7A6E] hover:text-[#4A3728] text-3xl"
              >
                ×
              </button>
            </div>
            <EditTaskForm 
              task={editingTask} 
              onUpdate={updateTask} 
            />
          </div>
        </div>
      )}

      {/* Task List or Archived Tasks */}
      {showArchived ? (
        archivedTasks.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-[#FFF8E7]/50 border-2 border-dashed border-[#FFB7C5]/30 text-[#8B7A6E]">
            <p className="text-xl mb-2">No archived tasks</p>
            <p className="text-sm">Archive tasks to see them here</p>
          </div>
        ) : (
          <div className="space-y-5">  {/* ← Increased spacing */}
            {archivedTasks.map(task => (
              <div key={task.id} className="p-6 rounded-2xl bg-[#FFF8E7]/60 border-2 border-gray-200/50 opacity-75 hover:opacity-100 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#6B4F3A] line-through">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-[#8B7A6E] mt-1 line-through">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-sm text-[#8B7A6E]">{task.due_date}</span>
                      <span className="text-sm text-[#8B7A6E]">{task.topic}</span>
                      <span className="text-xs bg-gray-200/50 px-3 py-1 rounded-full">
                        {task.status || 'Todo'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => restoreTask(task.id)}
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-[#A8FFB7]/30 hover:bg-[#A8FFB7]/50 text-[#4AA86B] transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        activeTasks.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-[#FFF8E7]/50 border-2 border-dashed border-[#FFB7C5]/30 text-[#8B7A6E]">
            <p className="text-xl mb-2">No tasks yet</p>
            <p className="text-sm">Create your first task above!</p>
          </div>
        ) : (
          <div className="space-y-5">  {/* ← Increased spacing */}
            {activeTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onArchive={archiveTask}
                onEdit={() => setEditingTask(task)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}