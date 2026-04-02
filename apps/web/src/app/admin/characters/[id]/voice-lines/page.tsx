"use client";
import { useState } from "react";
import { useVoiceLinesAdmin } from "@/components/admin/useVoiceLinesAdmin";
import { VoiceLineForm } from "@/components/admin/VoiceLineForm";
import { VoiceLineList } from "@/components/admin/VoiceLineList";

export default function VoiceLinesPage({ params }: { params: { id: string } }) {
  const [showForm, setShowForm] = useState(false);
  const {
    voiceLines,
    isPending,
    isError,
    nextOrder,
    create,
    isCreating,
    createError,
    remove,
    isDeleting,
    moveUp,
    moveDown,
  } = useVoiceLinesAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Voice Lines</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Voice Line
          </button>
        )}
      </div>

      {showForm && (
        <VoiceLineForm
          onSubmit={(data) => {
            create(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
          nextOrder={nextOrder}
          isPending={isCreating}
          isError={createError}
        />
      )}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">Failed to load voice lines.</p>}

      {voiceLines && (
        <VoiceLineList
          voiceLines={voiceLines}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onDelete={remove}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
