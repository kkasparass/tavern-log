import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RichTextEditor } from "./RichTextEditor";

let capturedOnUpdate: ((args: { editor: { getHTML: () => string } }) => void) | undefined;

const fakeEditor = {
  getHTML: vi.fn(() => "<p>hello</p>"),
  commands: { setContent: vi.fn() },
};

vi.mock("@tiptap/react", () => ({
  useEditor: (options: { onUpdate?: (args: { editor: { getHTML: () => string } }) => void }) => {
    capturedOnUpdate = options.onUpdate;
    return fakeEditor;
  },
  EditorContent: () => <div data-testid="editor" />,
}));

vi.mock("@tiptap/starter-kit", () => ({ default: {} }));

describe("RichTextEditor", () => {
  it("renders the editor container", () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  it("calls onChange when the editor content updates", () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="" onChange={onChange} />);

    capturedOnUpdate?.({ editor: fakeEditor });

    expect(onChange).toHaveBeenCalledWith("<p>hello</p>");
  });
});
