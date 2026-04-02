"use client";
import { useStoriesAdmin } from "@/components/admin/useStoriesAdmin";
import { StoryForm } from "@/components/admin/StoryForm";
import { StoryList } from "@/components/admin/StoryList";

export default function StoriesPage({ params }: { params: { id: string } }) {
  const {
    stories,
    isPending,
    isError,
    showForm,
    editingStory,
    title,
    setTitle,
    content,
    setContent,
    openNewForm,
    openEditForm,
    closeForm,
    handleSubmit,
    isSaving,
    saveError,
    toggleMutation,
    deleteMutation,
  } = useStoriesAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Stories</h1>
        {!showForm && (
          <button
            onClick={openNewForm}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Story
          </button>
        )}
      </div>

      {showForm && (
        <StoryForm
          editingStory={editingStory}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">Failed to load stories.</p>}

      {stories && (
        <StoryList
          stories={stories}
          onEdit={openEditForm}
          onToggle={(story) => toggleMutation.mutate(story)}
          onDelete={(id) => deleteMutation.mutate(id)}
          isToggling={toggleMutation.isPending}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
