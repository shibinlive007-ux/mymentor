'use client';

import React, { useState } from 'react';
import { PlannerTask, TaskType } from '@/types/planner';
import { X } from 'lucide-react';

interface TaskEditModalProps {
  isOpen: boolean;
  task: PlannerTask | null;
  onClose: () => void;
  onSave: (updatedTask: PlannerTask) => void;
}

const TASK_TYPES: Array<{ value: TaskType; label: string }> = [
  { value: 'new_study', label: '📖 New Study' },
  { value: 'revision', label: '🔄 Spaced Revision' },
  { value: 'pyq', label: '✍️ PYQs & MCQs' },
  { value: 'current_affairs', label: '📰 Current Affairs' },
  { value: 'answer_writing', label: '📝 Answer Writing' },
  { value: 'mock_test', label: '🎯 Mock Test' },
];

function TaskEditForm({
  task,
  onClose,
  onSave,
}: {
  task: PlannerTask;
  onClose: () => void;
  onSave: (updatedTask: PlannerTask) => void;
}) {
  const [subjectName, setSubjectName] = useState(task.subjectName);
  const [topicTitle, setTopicTitle] = useState(task.topicTitle);
  const [taskType, setTaskType] = useState<TaskType>(task.taskType);
  const [durationMinutes, setDurationMinutes] = useState(task.durationMinutes);
  const [reason, setReason] = useState(task.reason);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...task,
      subjectName,
      topicTitle,
      taskType,
      durationMinutes: Math.max(15, Number(durationMinutes)),
      reason,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
          Subject
        </label>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
          className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
          Topic / Task Description
        </label>
        <input
          type="text"
          value={topicTitle}
          onChange={(e) => setTopicTitle(e.target.value)}
          required
          className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Task Type
          </label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
          >
            {TASK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Duration (minutes)
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="15"
              max="240"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] font-mono focus:outline-hidden focus:border-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
          Rationale / Mentor Reason
        </label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
        />
      </div>

      <div className="pt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] rounded-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-xl shadow-xs"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export function TaskEditModal({
  isOpen,
  task,
  onClose,
  onSave,
}: TaskEditModalProps) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-slideUp">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-raised)]">
          <h3 className="text-sm font-bold text-[var(--foreground)]">Edit Daily Task</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <TaskEditForm key={task.id} task={task} onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
}
