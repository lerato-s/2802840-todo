"use client";

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
  onEdit: () => void;
};

export default function TaskCard({ task, onArchive, onEdit }: TaskCardProps) {
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== "Complete";

  const getStatusStyles = () => {
    switch(task.status) {
      case 'Todo': 
        return 'bg-[#FFD4A8]/30 text-[#C98B4A] border border-[#FFD4A8]/30';
      case 'In-Progress': 
        return 'bg-[#FFB7C5]/30 text-[#D47186] border border-[#FFB7C5]/30';
      case 'Complete': 
        return 'bg-[#A8FFB7]/30 text-[#4AA86B] border border-[#A8FFB7]/30';
      default: 
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(255,183,197,0.2)] mb-6 ${
      isOverdue 
        ? 'bg-pastel-card-overdue border-2 border-[#FF6B6B]/30 shadow-[0_4px_20px_rgba(255,107,107,0.1)]' 
        : 'bg-pastel-card border-2 border-[#FFB7C5]/20 shadow-[0_4px_20px_rgba(255,183,197,0.08)]'
    }`}>
      {/* Title with Overdue on the right */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="text-xl sm:text-2xl font-bold text-[#4A3728] flex-1">
          {task.title}
        </h3>
        {isOverdue && (
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FF4757] text-white animate-pulse-soft flex-shrink-0">
            Overdue
          </span>
        )}
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-base text-[#6B4F3A] mb-5 leading-relaxed">
          {task.description}
        </p>
      )}
      
      {/* Task Info - Due Date, Topic, Status in separate rows */}
      <div className="space-y-2.5 mb-5">
        {/* Due Date */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          isOverdue 
            ? 'bg-[#FF6B6B]/20 text-[#FF4757] border border-[#FF6B6B]/30' 
            : 'bg-[#D4E8FF]/40 text-[#4A7AA8] border border-[#D4E8FF]/40'
        }`}>
          Due: {formatDate(task.due_date)}
        </div>
        
        {/* Topic */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-[#FFEAA7]/40 text-[#8B7A3A] border border-[#FFEAA7]/40">
          {task.topic}
        </div>
        
        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles()}`}>
          {task.status === 'Todo'}
          {task.status === 'In-Progress'}
          {task.status === 'Complete'}
          {' '}{task.status || 'Todo'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={onEdit}
          className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-[#FFD4A8]/30 hover:bg-[#FFD4A8]/50 hover:-translate-y-0.5 border border-[#FFD4A8]/30 hover:border-[#FFD4A8] text-[#6B4F3A]"
        >
          Edit
        </button>
        <button
          className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-gray-200/20 hover:bg-gray-300/30 hover:-translate-y-0.5 border border-gray-300/30 hover:border-gray-400 text-[#8B7A6E]"
          onClick={() => onArchive(task.id)}
        >
          Archive
        </button>
      </div>
    </div>
  );
}