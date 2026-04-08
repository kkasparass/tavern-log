"use client";
import React from "react";

interface AdminResourcePageProps {
  title: string;
  addLabel: string;
  loadError: string;
  showCreateForm: boolean;
  isPending: boolean;
  isError: boolean;
  openCreateForm: () => void;
  createForm: React.ReactNode;
  children: React.ReactNode;
}

export function AdminResourcePage({
  title,
  addLabel,
  loadError,
  showCreateForm,
  isPending,
  isError,
  openCreateForm,
  createForm,
  children,
}: AdminResourcePageProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {!showCreateForm && (
          <button
            onClick={openCreateForm}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            {addLabel}
          </button>
        )}
      </div>

      {showCreateForm && createForm}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">{loadError}</p>}

      {children}
    </div>
  );
}
