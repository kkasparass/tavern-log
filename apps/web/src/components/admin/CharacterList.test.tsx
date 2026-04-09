import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithQuery } from "@/test/utils";
import { mockCharacterListItem, naraCharacterListItem } from "@/test/fixtures";
import { CharacterList } from "./CharacterList";

vi.mock("next/link");

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

describe("CharacterList", () => {
  it("renders a row for each character with name and system", () => {
    renderWithQuery(<CharacterList />, [
      [["admin-characters"], [mockCharacterListItem, naraCharacterListItem]],
    ]);
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.getByText("Nara Solis")).toBeInTheDocument();
  });

  it("renders content section links per character", () => {
    renderWithQuery(<CharacterList />, [[["admin-characters"], [mockCharacterListItem]]]);
    const id = mockCharacterListItem.id;
    expect(screen.getByRole("link", { name: "Stories" })).toHaveAttribute(
      "href",
      `/admin/characters/${id}/stories`
    );
    expect(screen.getByRole("link", { name: "Voice Lines" })).toHaveAttribute(
      "href",
      `/admin/characters/${id}/voice-lines`
    );
    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute(
      "href",
      `/admin/characters/${id}/gallery`
    );
    expect(screen.getByRole("link", { name: "Timeline" })).toHaveAttribute(
      "href",
      `/admin/characters/${id}/timeline`
    );
  });

  it("renders an Edit link per character pointing to the edit page", () => {
    renderWithQuery(<CharacterList />, [
      [["admin-characters"], [mockCharacterListItem, naraCharacterListItem]],
    ]);
    const editLinks = screen.getAllByRole("link", { name: "Edit" });
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute(
      "href",
      `/admin/characters/${mockCharacterListItem.id}/edit`
    );
    expect(editLinks[1]).toHaveAttribute(
      "href",
      `/admin/characters/${naraCharacterListItem.id}/edit`
    );
  });

  it("renders an empty state with a create link when there are no characters", () => {
    renderWithQuery(<CharacterList />, [[["admin-characters"], []]]);
    expect(screen.getByText(/no characters yet/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create your first one/i })).toHaveAttribute(
      "href",
      "/admin/characters/new"
    );
  });

  it("shows an error message when the fetch fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("", { status: 500 }));
    renderWithQuery(<CharacterList />, []);
    await waitFor(() => expect(screen.getByText("Failed to load characters.")).toBeInTheDocument());
  });

  it("renders a thumbnail img when thumbnailUrl is set", () => {
    const withThumb = { ...mockCharacterListItem, thumbnailUrl: "https://example.com/mira.jpg" };
    renderWithQuery(<CharacterList />, [[["admin-characters"], [withThumb]]]);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/mira.jpg");
  });

  it("renders a placeholder div instead of an img when thumbnailUrl is null", () => {
    renderWithQuery(<CharacterList />, [[["admin-characters"], [mockCharacterListItem]]]);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a Delete button per character", () => {
    renderWithQuery(<CharacterList />, [
      [["admin-characters"], [mockCharacterListItem, naraCharacterListItem]],
    ]);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2);
  });

  it("opens the confirm dialog when Delete is clicked", async () => {
    renderWithQuery(<CharacterList />, [[["admin-characters"], [mockCharacterListItem]]]);
    expect(screen.queryByText("Delete character?")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Delete character?")).toBeInTheDocument();
    expect(screen.getByText(/permanently delete/i)).toBeInTheDocument();
  });

  it("closes the dialog without calling DELETE when Cancel is clicked", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    renderWithQuery(<CharacterList />, [[["admin-characters"], [mockCharacterListItem]]]);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Delete character?")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining(mockCharacterListItem.id),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("calls DELETE /api/admin/characters/:id when Confirm is clicked", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    renderWithQuery(<CharacterList />, [[["admin-characters"], [mockCharacterListItem]]]);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    // Dialog is open — two Delete buttons exist (list row + dialog confirm); click the dialog's
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    await userEvent.click(deleteButtons[deleteButtons.length - 1]);
    expect(fetch).toHaveBeenCalledWith(
      `/api/admin/characters/${mockCharacterListItem.id}`,
      { method: "DELETE" }
    );
  });
});
