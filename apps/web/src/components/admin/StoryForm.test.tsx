import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StoryForm } from "./StoryForm";
import { mockStory } from "@/test/fixtures";

vi.mock("./RichTextEditor", () => ({
  RichTextEditor: ({ onChange }: { value: string; onChange: (v: string) => void }) => (
    <div data-testid="rich-text-editor" onClick={() => onChange("<p>updated content</p>")} />
  ),
}));

const defaultProps = {
  editingStory: null,
  title: "",
  setTitle: vi.fn(),
  content: "",
  setContent: vi.fn(),
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
  isSaving: false,
  saveError: false,
};

describe("StoryForm", () => {
  it("shows 'New Story' heading when editingStory is null", () => {
    render(<StoryForm {...defaultProps} />);
    expect(screen.getByText("New Story")).toBeInTheDocument();
  });

  it("shows 'Edit Story' heading when editingStory is set", () => {
    render(<StoryForm {...defaultProps} editingStory={mockStory} />);
    expect(screen.getByText("Edit Story")).toBeInTheDocument();
  });

  it("renders the title input and rich text editor", () => {
    render(<StoryForm {...defaultProps} />);
    expect(screen.getByPlaceholderText("Story title")).toBeInTheDocument();
    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
  });

  it("calls setTitle when the title input changes", async () => {
    const setTitle = vi.fn();
    render(<StoryForm {...defaultProps} setTitle={setTitle} />);
    await userEvent.type(screen.getByPlaceholderText("Story title"), "A");
    expect(setTitle).toHaveBeenCalled();
  });

  it("calls setContent when the editor fires onChange", async () => {
    const setContent = vi.fn();
    render(<StoryForm {...defaultProps} setContent={setContent} />);
    await userEvent.click(screen.getByTestId("rich-text-editor"));
    expect(setContent).toHaveBeenCalledWith("<p>updated content</p>");
  });

  it("disables Save when title is empty", () => {
    render(<StoryForm {...defaultProps} title="" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("enables Save when title is non-empty", () => {
    render(<StoryForm {...defaultProps} title="My Story" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("shows Saving… and disables the button when isSaving", () => {
    render(<StoryForm {...defaultProps} title="My Story" isSaving />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("calls onSubmit when Save is clicked", async () => {
    const onSubmit = vi.fn();
    render(<StoryForm {...defaultProps} title="My Story" onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    render(<StoryForm {...defaultProps} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows error message when saveError is true", () => {
    render(<StoryForm {...defaultProps} saveError />);
    expect(screen.getByText("Failed to save story.")).toBeInTheDocument();
  });
});
