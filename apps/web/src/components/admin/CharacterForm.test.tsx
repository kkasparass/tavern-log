import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
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
