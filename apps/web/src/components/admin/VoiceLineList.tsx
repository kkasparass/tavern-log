"use client";
import type { CharacterVoiceLine } from "@/lib/types";
import { AdminResourceList, type EditFormProps } from "./AdminResourceList";
import { VoiceLineForm } from "./VoiceLineForm";

interface VoiceLineListProps {
  voiceLines: CharacterVoiceLine[];
  editingVoiceLine: CharacterVoiceLine | null;
  onEdit: (voiceLine: CharacterVoiceLine) => void;
  onSaveEdit: (id: string, data: { audioUrl?: string; transcript?: string; context?: string }) => void;
  onCancelEdit: () => void;
  isSavingEdit: boolean;
  saveEditError: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function VoiceLineList({
  voiceLines,
  editingVoiceLine,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isSavingEdit,
  saveEditError,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: VoiceLineListProps) {
  return (
    <AdminResourceList
      items={voiceLines}
      editingItem={editingVoiceLine}
      emptyMessage="No voice lines yet."
      renderItem={(vl) => (
        <>
          <p className="truncate text-sm text-white/50">{vl.audioUrl.split("/").pop()}</p>
          <p className="mt-0.5 text-white">{vl.transcript}</p>
          {vl.context && <p className="mt-0.5 text-sm text-white/50">{vl.context}</p>}
          <audio controls src={vl.audioUrl} className="mt-2 w-full" />
        </>
      )}
      renderEditForm={(vl, p: EditFormProps<{ audioUrl?: string; transcript?: string; context?: string }>) => (
        <VoiceLineForm
          inline
          initialValues={vl}
          onSubmit={(data) => p.onSaveEdit(vl.id, data)}
          onCancel={p.onCancelEdit}
          isPending={p.isSavingEdit}
          isError={p.saveEditError}
        />
      )}
      onEdit={onEdit}
      onSaveEdit={onSaveEdit}
      onCancelEdit={onCancelEdit}
      isSavingEdit={isSavingEdit}
      saveEditError={saveEditError}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
}
