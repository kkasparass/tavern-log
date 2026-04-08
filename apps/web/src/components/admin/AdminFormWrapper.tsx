"use client";
import React from "react";

interface AdminFormWrapperProps {
  inline?: boolean;
  isEditing: boolean;
  itemName: string;
  isPending: boolean;
  isError: boolean;
  isSubmitDisabled: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

export function AdminFormWrapper({
  inline = false,
  isEditing,
  itemName,
  isPending,
  isError,
  isSubmitDisabled,
  onSubmit,
  onCancel,
  children,
}: AdminFormWrapperProps) {
  const fields = (
    <>
      {!inline && (
        <h2 className="mb-4 text-sm font-semibold text-white/70">
          {isEditing ? `Edit ${itemName}` : `New ${itemName}`}
        </h2>
      )}
      {children}
      {isError && (
        <p className="mb-3 text-sm text-red-400">
          Failed to {isEditing ? "update" : "create"} {itemName.toLowerCase()}.
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={isPending || isSubmitDisabled}
          className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </>
  );

  if (inline) return <div className="w-full">{fields}</div>;

  return (
    <div className="mb-6 rounded border border-white/10 bg-gray-900 p-4">{fields}</div>
  );
}
