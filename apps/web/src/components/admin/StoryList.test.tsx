import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StoryList } from "./StoryList";
import { mockStory } from "@/test/fixtures";
import type { StoryEntry } from "@/lib/types";

const draftStory: StoryEntry = {
  ...mockStory,
  id: "cuid-draft",
  title: "A Draft Story",
  isDraft: true,
  publishedAt: null,
};

const onEdit = vi.fn();
const onToggle = vi.fn();
const onDelete = vi.fn();

const defaultProps = {
  stories: [mockStory, draftStory],
  onEdit,
  onToggle,
  onDelete,
  isToggling: false,
  isDeleting: false,
};

describe("StoryList", () => {
  it("renders story titles", () => {
    render(<StoryList {...defaultProps} />);
    expect(screen.getByText("The Last Spell")).toBeInTheDocument();
  });

  it("shows Published badge for published stories and Draft for drafts", () => {
    render(<StoryList {...defaultProps} />);
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows Unpublish for published and Publish for draft", () => {
    render(<StoryList {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  it("calls onEdit with the story when Edit is clicked", async () => {
    render(<StoryList {...defaultProps} stories={[mockStory]} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(mockStory);
  });

  it("calls onToggle with the story when Publish/Unpublish is clicked", async () => {
    render(<StoryList {...defaultProps} stories={[mockStory]} />);
    await userEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    expect(onToggle).toHaveBeenCalledWith(mockStory);
  });

  it("calls onDelete with the story id when Delete is clicked", async () => {
    render(<StoryList {...defaultProps} stories={[mockStory]} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith(mockStory.id);
  });

  it("disables toggle and delete buttons when mutations are pending", () => {
    render(<StoryList {...defaultProps} isToggling isDeleting />);
    expect(screen.getByRole("button", { name: "Unpublish" })).toBeDisabled();
    screen.getAllByRole("button", { name: "Delete" }).forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("shows empty state when stories list is empty", () => {
    render(<StoryList {...defaultProps} stories={[]} />);
    expect(screen.getByText("No stories yet.")).toBeInTheDocument();
  });
});
