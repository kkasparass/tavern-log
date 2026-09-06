import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { CharacterForm, type CharacterFormData } from "./CharacterForm";

vi.mock("next/link");

vi.mock("./ThemeSection", () => ({
  ThemeSection: () => <div data-testid="theme-section" />,
}));

vi.mock("./FileUpload", () => ({
  FileUpload: ({ label }: { onFileSelect: (file: File | null) => void; label?: string }) => (
    <div>{label ?? "Upload file"}</div>
  ),
}));

function renderForm(props: Partial<React.ComponentProps<typeof CharacterForm>> = {}) {
  const onSubmit = vi.fn();
  render(<CharacterForm onSubmit={onSubmit} isPending={false} submitLabel="Save" {...props} />);
  return { onSubmit };
}

describe("CharacterForm", () => {
  it("renders all fields", () => {
    renderForm();
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Tagline")).toBeInTheDocument();
    expect(screen.getByLabelText("Pronouns")).toBeInTheDocument();
    expect(screen.getByLabelText("Designed by")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    expect(screen.getByLabelText("Personality")).toBeInTheDocument();
    expect(screen.getByText("Thumbnail")).toBeInTheDocument();
    expect(screen.getByLabelText("Public")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByTestId("theme-section")).toBeInTheDocument();
  });

  it("has no system, campaign, or status inputs", () => {
    renderForm();
    expect(screen.queryByLabelText("System *")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Campaign")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
  });

  it("pre-fills fields from defaultValues", () => {
    renderForm({
      defaultValues: {
        name: "Mira Ashveil",
        tagline: "Ex-court mage turned wandering debt collector.",
        pronouns: "she/her",
        designedBy: "Placeholder Artist",
        bio: "A former court mage.",
        tags: ["mage", "wanderer"],
      },
    });
    expect(screen.getByLabelText("Name *")).toHaveValue("Mira Ashveil");
    expect(screen.getByLabelText("Tagline")).toHaveValue(
      "Ex-court mage turned wandering debt collector."
    );
    expect(screen.getByLabelText("Pronouns")).toHaveValue("she/her");
    expect(screen.getByLabelText("Designed by")).toHaveValue("Placeholder Artist");
    expect(screen.getByLabelText("Bio")).toHaveValue("A former court mage.");
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("wanderer")).toBeInTheDocument();
  });

  it("caps the tagline input at 140 characters", () => {
    renderForm();
    expect(screen.getByLabelText("Tagline")).toHaveAttribute("maxlength", "140");
  });

  it("calls onSubmit with correct data when submitted", async () => {
    const { onSubmit } = renderForm();
    await userEvent.type(screen.getByLabelText("Name *"), "Nara Solis");
    await userEvent.type(screen.getByLabelText("Tagline"), "Runs her own crew");
    await userEvent.type(screen.getByLabelText("Pronouns"), "she/her");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const submitted: CharacterFormData = onSubmit.mock.calls[0][0];
    expect(submitted.name).toBe("Nara Solis");
    expect(submitted.tagline).toBe("Runs her own crew");
    expect(submitted.pronouns).toBe("she/her");
    expect(submitted.theme).toMatchObject({
      colors: expect.any(Object),
      preset: expect.any(String),
    });
  });

  it("adds a tag and shows it as a chip", async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText("Tag input"), "scoundrel");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("scoundrel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove tag scoundrel" })).toBeInTheDocument();
  });

  it("adds a tag on Enter key", async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText("Tag input"), "scoundrel{Enter}");
    expect(screen.getByText("scoundrel")).toBeInTheDocument();
  });

  it("removes a tag chip with the × button", async () => {
    renderForm({ defaultValues: { tags: ["mage", "wanderer"] } });
    await userEvent.click(screen.getByRole("button", { name: "Remove tag mage" }));
    expect(screen.queryByText("mage")).not.toBeInTheDocument();
    expect(screen.getByText("wanderer")).toBeInTheDocument();
  });

  it("ignores empty tag input", async () => {
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("ignores duplicate tags", async () => {
    renderForm({ defaultValues: { tags: ["mage"] } });
    await userEvent.type(screen.getByLabelText("Tag input"), "mage");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getAllByText("mage")).toHaveLength(1);
  });

  it("shows an error message when error prop is set", () => {
    renderForm({ error: "Failed to save changes." });
    expect(screen.getByText("Failed to save changes.")).toBeInTheDocument();
  });

  it("disables the submit button when isPending", () => {
    renderForm({ isPending: true });
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });
});

describe("CharacterForm tag autocomplete", () => {
  const tagInput = () => screen.getByLabelText("Tag input");

  function stubTagsFetch(tags: { tag: string; count: number }[]) {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tags }),
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  async function typeAndSettle(user: ReturnType<typeof userEvent.setup>, text: string) {
    await user.type(tagInput(), text);
  }

  function fetchTagsCount() {
    return (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows suggestions narrowing to the typed prefix after debounce", async () => {
    const fetchMock = stubTagsFetch([
      { tag: "goblin", count: 3 },
      { tag: "gods", count: 1 },
    ]);
    const user = userEvent.setup();
    renderForm();
    await typeAndSettle(user, "go");
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
    renderForm();
    await user.type(tagInput(), "goblin");
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith("/api/tags?q=goblin");
    await new Promise((r) => setTimeout(r, 350));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not open the dropdown for an empty input", async () => {
    stubTagsFetch([{ tag: "goblin", count: 1 }]);
    const user = userEvent.setup();
    renderForm();
    await user.type(tagInput(), "  ");
    await new Promise((r) => setTimeout(r, 350));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(fetchTagsCount()).toBe(0);
  });

  it("adds a highlighted suggestion with Enter and closes the dropdown", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderForm();
    await typeAndSettle(user, "gob");
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
    renderForm();
    await typeAndSettle(user, "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.click(screen.getByRole("option", { name: /goblin/ }));
    expect(screen.getByRole("button", { name: "Remove tag goblin" })).toBeInTheDocument();
  });

  it("excludes already-added tags from suggestions", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderForm({ defaultValues: { tags: ["goblin"] } });
    await typeAndSettle(user, "gob");
    await new Promise((r) => setTimeout(r, 350));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("falls back to adding the raw input with Enter when no suggestions exist", async () => {
    stubTagsFetch([]);
    const user = userEvent.setup();
    renderForm();
    await typeAndSettle(user, "scoundrel");
    await new Promise((r) => setTimeout(r, 350));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Remove tag scoundrel" })).toBeInTheDocument();
  });

  it("closes the dropdown on Escape without adding a tag", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderForm();
    await typeAndSettle(user, "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove tag goblin" })).not.toBeInTheDocument();
  });

  it("closes the dropdown on blur without adding a tag", async () => {
    stubTagsFetch([{ tag: "goblin", count: 3 }]);
    const user = userEvent.setup();
    renderForm();
    await typeAndSettle(user, "gob");
    await waitFor(() => expect(screen.getByRole("option", { name: /goblin/ })).toBeInTheDocument());
    await user.tab();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove tag goblin" })).not.toBeInTheDocument();
  });
});
