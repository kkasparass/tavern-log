"use client";
import React from "react";

export interface EditFormProps<TUpdateData> {
  onSaveEdit: (id: string, data: TUpdateData) => void;
  onCancelEdit: () => void;
  isSavingEdit: boolean;
  saveEditError: boolean;
}

interface AdminResourceListProps<TItem extends { id: string }, TUpdateData> {
  items: TItem[];
  editingItem: TItem | null;
  emptyMessage: string;
  renderItem: (item: TItem) => React.ReactNode;
  renderEditForm: (item: TItem, props: EditFormProps<TUpdateData>) => React.ReactNode;
  onEdit: (item: TItem) => void;
  onSaveEdit: (id: string, data: TUpdateData) => void;
  onCancelEdit: () => void;
  isSavingEdit: boolean;
  saveEditError: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function AdminResourceList<TItem extends { id: string }, TUpdateData>({
  items,
  editingItem,
  emptyMessage,
  renderItem,
  renderEditForm,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isSavingEdit,
  saveEditError,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: AdminResourceListProps<TItem, TUpdateData>) {
  if (items.length === 0) return <p className="text-white/40">{emptyMessage}</p>;

  const editFormProps: EditFormProps<TUpdateData> = { onSaveEdit, onCancelEdit, isSavingEdit, saveEditError };

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={item.id} className="rounded border border-white/10 bg-gray-900 px-4 py-3">
          {editingItem?.id === item.id ? (
            renderEditForm(item, editFormProps)
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 overflow-hidden">{renderItem(item)}</div>
              <div className="mt-2 flex shrink-0 items-center gap-1 sm:ml-4 sm:mt-0">
                <button
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="rounded px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => onMoveDown(index)}
                  disabled={index === items.length - 1}
                  className="rounded px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="rounded px-3 py-1 text-sm text-white/60 hover:bg-white/10 hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={isDeleting}
                  className="rounded px-3 py-1 text-sm text-red-400/70 hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
