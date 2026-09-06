import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useState } from "react";
import { render } from "@testing-library/react";
import { TagInput } from "./TagInput";

function stubTagsFetch(tags: { tag: string; count: number }[]) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ tags }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function typeAndSettle(
  user: ReturnType<typeof userEvent.setup>,
  input: HTMLElement,
  text: string
) {
  await user.type(input, text);
}

function fetchTagsCount() {
  return (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
}

function Harness({
  initialTags = [],
}: {
  initialTags?: string[];
}) {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState(initialTags);
  return (
    <TagInput
      value={value}
      onValueChange={setValue}
      tags={tags}
      onAdd={(tag) => {
        const trimmed = (tag ?? value).trim();
        if (trimmed && !tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
          setTags([...tags, trimmed]);
        }
        setValue("");
      }}
      onRemove={(tag) => setTags(tags.filter((t) => t !== tag))}
    />
  );
}

function renderTagInput(initialTags: string[] = []) {
  return render(<Harness initialTags={initialTags} />);
}

const tagInput = () => screen.getByLabelText("Tag input");

describe("TagInput", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the input, Add button, and chips", () => {
    renderTagInput(["mage"]);
    expect(tagInput()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove tag mage" })).toBeInTheDocument();
  });

  it("shows suggestions narrowing to the typed prefix after debounce", async () => {
    const fetchMock = stubTagsFetch([
      { tag: "goblin", count: 3 },
      { tag: "gods", count: 1 },
    ]);
    const user = userEvent.setup();
    renderTagInput();
    await typeAndSettle(user, tagInput(), "go");
    await waitFor(() => {
      expect(screen.getByRole("listbox", { name: "Tag suggestions" })).toBeInTheDocument();
    });
    expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /gods/ })).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith("/api/tags?q=go");
    expect(tagInput()).toHaveAttribute("aria-expanded", "true");
  });

  it("fires at most one request per debounce window for rapid typing", async () => {
    const fetchMock = stubTagsFetch([]);
    const user = userEvent.setup();
    renderTagInput();
    await user.type(tagInput(), "goblin");
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith("/api/tags?q=goblin");
    await new Promise((r) => setTimeout(r, 350));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not open the dropdown for an empty input", async () => {
    stubTagsFetch([{ tag: "goblin", count: 1 }]);
    const user = userEvent.setup();
    renderTagInput();
    await user.type(tagInput(), "  ");
    await new Promise((r) => setTimeout(r, 350));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(fetchTagsCount()).toBe(0);
  });

  it("adds a highlighted suggestion with Enter and closes the dropdown", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderTagInput();
    await typeAndSettle(user, tagInput(), "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: /goblin/ })).toHaveAttribute("aria-selected", "true");
    expect(tagInput()).toHaveAttribute("aria-activedescendant", "tag-suggestion-0");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Remove tag goblin" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("adds a suggestion on click", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderTagInput();
    await typeAndSettle(user, tagInput(), "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.click(screen.getByRole("option", { name: /goblin/ }));
    expect(screen.getByRole("button", { name: "Remove tag goblin" })).toBeInTheDocument();
  });

  it("excludes already-added tags from suggestions", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderTagInput(["goblin"]);
    await typeAndSettle(user, tagInput(), "gob");
    await new Promise((r) => setTimeout(r, 350));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("falls back to adding the raw input with Enter when no suggestions exist", async () => {
    stubTagsFetch([]);
    const user = userEvent.setup();
    renderTagInput();
    await typeAndSettle(user, tagInput(), "scoundrel");
    await new Promise((r) => setTimeout(r, 350));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Remove tag scoundrel" })).toBeInTheDocument();
  });

  it("closes the dropdown on Escape without adding a tag", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderTagInput();
    await typeAndSettle(user, tagInput(), "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove tag goblin" })).not.toBeInTheDocument();
  });

  it("closes the dropdown on blur without adding a tag", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderTagInput();
    await typeAndSettle(user, tagInput(), "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.tab();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove tag goblin" })).not.toBeInTheDocument();
  });
});
