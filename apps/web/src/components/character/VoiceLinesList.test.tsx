import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VoiceLinesList } from "./VoiceLinesList";
import { renderWithQuery } from "@/test/utils";
import { mockCharacter } from "@/test/fixtures";

vi.mock("./AudioPlayer", () => ({
  AudioPlayer: ({ audioUrl }: { audioUrl: string }) => (
    <div data-testid="audio-player" data-url={audioUrl} />
  ),
}));

const slug = "mira-ashveil";

describe("VoiceLinesList", () => {
  it("renders transcripts and context labels from cache", () => {
    renderWithQuery(<VoiceLinesList slug={slug} />, [[["character", slug], mockCharacter]]);
    expect(screen.getByText(/I don't do quests/)).toBeInTheDocument();
    expect(screen.getByText(/When first approached by the party/)).toBeInTheDocument();
    expect(screen.getByText(/The thing about fire spells/)).toBeInTheDocument();
    expect(screen.getByText(/After the ambush at the Crossing/)).toBeInTheDocument();
  });

  it("renders an AudioPlayer for each voice line", () => {
    renderWithQuery(<VoiceLinesList slug={slug} />, [[["character", slug], mockCharacter]]);
    expect(screen.getAllByTestId("audio-player")).toHaveLength(mockCharacter.voiceLines.length);
  });

  it("shows empty state when character has no voice lines", () => {
    const data = { ...mockCharacter, voiceLines: [] };
    renderWithQuery(<VoiceLinesList slug={slug} />, [[["character", slug], data]]);
    expect(screen.getByText("No voice lines yet.")).toBeInTheDocument();
  });

  it("renders nothing when data is not in cache", () => {
    const { container } = renderWithQuery(<VoiceLinesList slug={slug} />, []);
    expect(container).toBeEmptyDOMElement();
  });
});
