type Task = {
    id: number;
    title: string;
    description: string;
    due_date: string;
    topic: string;
    status: string;
    is_archived: number;
  };
  
  type TaskCardProps = {
    task: Task;
    onArchive: (id: number) => void;
  };
  
  export default function TaskCard({ task, onArchive }: TaskCardProps) {
    return (
      <div className="p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
        <h2 className="font-bold">{task.title}</h2>
        <p>{task.description}</p>
        <p>Due: {task.due_date}</p>
        <p>{task.topic}</p>
        <p>{task.status}</p>
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-1 border rounded">Edit</button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => onArchive(task.id)}
          >
            Archive
          </button>
        </div>
      </div>
    );
  }