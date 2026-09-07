import { render, screen, within } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CardTemplateSection } from "./CardTemplateSection";
import { TransitionProvider, useTransition } from "@/components/transitions/TransitionProvider";
import { CardTemplateId, TransitionId } from "@/lib/themes/types";
import type { ResolvedCard, ThemeConfig } from "@/lib/themes/types";
import type { CharacterPreview } from "@/lib/types";

vi.mock("next/image");
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const preview: CharacterPreview = {
  id: "preview",
  slug: "mira-ashveil",
  name: "Mira Ashveil",
  tagline: "Ex-court mage turned wandering debt collector.",
  pronouns: "she/her",
  thumbnailUrl: null,
  theme: { bgColor: "#1a1a2e", textColor: "#e0e0e0", accentColor: "#7c3aed" },
  tags: ["mage", "D&D 5e", "The Shattered Crown"],
};

function HoverDisplay() {
  const { previewTheme, phase } = useTransition();
  return (
    <>
      <div data-testid="hover-theme">{previewTheme ? "set" : "null"}</div>
      <div data-testid="phase">{phase}</div>
    </>
  );
}

const transitionTheme: ThemeConfig = {
  preset: "custom",
  colors: { bg: "#1a1a2e", text: "#e0e0e0", accent: "#7c3aed" },
  bgPattern: "none",
  transition: TransitionId.FloralBloom,
  decorations: null,
};

function renderSection(
  value: ResolvedCard = { template: CardTemplateId.Portrait, settings: {} },
  theme: ThemeConfig = transitionTheme
) {
  const onChange = vi.fn();
  render(
    <TransitionProvider>
      <CardTemplateSection value={value} onChange={onChange} theme={theme} preview={preview} />
      <HoverDisplay />
    </TransitionProvider>
  );
  return { onChange };
}

async function selectOption(label: string) {
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(screen.getByRole("option", { name: label }));
}

describe("CardTemplateSection", () => {
  it("renders the template dropdown and live preview", () => {
    renderSection();
    expect(screen.getByLabelText("Card template")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Portrait");
    expect(screen.getByTestId("card-template-preview")).toBeInTheDocument();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.getByText("Ex-court mage turned wandering debt collector.")).toBeInTheDocument();
  });

  it("renders the selected template's settings controls", () => {
    renderSection({ template: CardTemplateId.Compact, settings: { showTags: true } });
    expect(screen.getByLabelText("Show tags")).toBeInTheDocument();
  });

  it("renders no settings controls for the portrait template", () => {
    renderSection();
    expect(screen.queryByLabelText("Show tags")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Image alignment")).not.toBeInTheDocument();
  });

  it("switches template and resets settings to the new template's defaults", async () => {
    const { onChange } = renderSection({
      template: CardTemplateId.Compact,
      settings: { showTags: false },
    });
    await selectOption("Polaroid");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        template: CardTemplateId.Polaroid,
        settings: { rotation: -3, frameColor: "#f5f0e6" },
      })
    );
  });

  it("keeps the same selection when picking the active template", async () => {
    const { onChange } = renderSection();
    await selectOption("Portrait");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("propagates settings changes for the selected template", async () => {
    const { onChange } = renderSection({
      template: CardTemplateId.Compact,
      settings: { showTags: true },
    });
    await userEvent.click(screen.getByLabelText("Show tags"));
    expect(onChange).toHaveBeenCalledWith({
      template: CardTemplateId.Compact,
      settings: { showTags: false },
    });
  });

  it("preview hover triggers the theme hover-preview", async () => {
    renderSection();
    await userEvent.hover(screen.getByRole("link"));
    expect(screen.getByTestId("hover-theme")).toHaveTextContent("set");
    await userEvent.unhover(screen.getByRole("link"));
    expect(screen.getByTestId("hover-theme")).toHaveTextContent("null");
  });

  it("preview click plays the full transition animation without navigating", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("link"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    expect(screen.getByTestId("hover-theme")).toHaveTextContent("set");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("preview click does nothing when the theme has no transition", async () => {
    renderSection(undefined, { ...transitionTheme, transition: null });
    await userEvent.click(screen.getByRole("link"));
    // hover preview fires, but no covering animation and no navigation
    expect(screen.getByTestId("phase")).toHaveTextContent("hover-preview");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("changing the template dropdown updates the preview card", async () => {
    // stateful parent like CharacterForm, so the controlled value actually updates
    function Harness() {
      const [card, setCard] = useState<ResolvedCard>({
        template: CardTemplateId.Portrait,
        settings: {},
      });
      return <CardTemplateSection value={card} onChange={setCard} theme={transitionTheme} preview={preview} />;
    }
    render(
      <TransitionProvider>
        <Harness />
        <HoverDisplay />
      </TransitionProvider>
    );
    const previewEl = screen.getByTestId("card-template-preview");
    // portrait heading
    expect(within(previewEl).getByText("Mira Ashveil").className).toContain("text-2xl");
    await selectOption("Compact");
    // re-renders with the compact template's heading and visible tag pills
    expect(within(previewEl).getByText("Mira Ashveil").className).toContain("text-lg");
    expect(within(previewEl).getByText("mage")).toBeInTheDocument();
  });
});
