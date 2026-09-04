import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterThemeOverlay } from "./CharacterThemeOverlay";
import { TransitionProvider, useTransition } from "./TransitionProvider";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import { TransitionId } from "@/lib/themes/types";
import type { ThemeConfig } from "@/lib/themes/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const FLORAL_THEME: ThemeConfig = { ...DEFAULT_THEME, transition: TransitionId.FloralBloom };

// Driver component to control TransitionProvider state from tests
function TestDriver({ action, theme }: { action: string; theme: ThemeConfig }) {
  const { hoverPreview, navigate } = useTransition();
  return (
    <button
      onClick={() => {
        if (action === "hover") hoverPreview(theme);
        if (action === "navigate") navigate("/target", theme);
      }}
    >
      {action}
    </button>
  );
}

function renderOverlay(action: string, theme: ThemeConfig = FLORAL_THEME) {
  return render(
    <TransitionProvider>
      <CharacterThemeOverlay />
      <TestDriver action={action} theme={theme} />
    </TransitionProvider>
  );
}

describe("CharacterThemeOverlay", () => {
  it("renders nothing when phase is idle", () => {
    const { container } = render(
      <TransitionProvider>
        <CharacterThemeOverlay />
      </TransitionProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders overlay container when a character is hovered", async () => {
    const { container } = renderOverlay("hover");
    await userEvent.click(screen.getByText("hover"));
    expect(container.querySelector(".absolute.inset-0.pointer-events-none")).not.toBeNull();
  });

  it("renders the gradient and solid background divs when non-idle", async () => {
    const { container } = renderOverlay("hover");
    await userEvent.click(screen.getByText("hover"));
    // the outer overlay div + two motion.div children
    const overlayRoot = container.querySelector(".absolute.inset-0.pointer-events-none");
    expect(overlayRoot).not.toBeNull();
    const divs = overlayRoot?.querySelectorAll(".absolute.inset-0");
    expect(divs?.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the overlay container when covering phase is triggered", async () => {
    const { container } = renderOverlay("navigate");
    await userEvent.click(screen.getByText("navigate"));
    const overlayRoot = container.querySelector(".absolute.inset-0.pointer-events-none");
    expect(overlayRoot).not.toBeNull();
  });

  it("sources colours from previewTheme, not DEFAULT_THEME", async () => {
    const customTheme: ThemeConfig = {
      ...FLORAL_THEME,
      colors: { ...DEFAULT_THEME.colors, bg: "#123456" },
    };
    const { container } = renderOverlay("navigate", customTheme);
    await userEvent.click(screen.getByText("navigate"));
    const overlayRoot = container.querySelector(".absolute.inset-0.pointer-events-none")!;
    const backgrounds = Array.from(overlayRoot.children).map(
      (el) => (el as HTMLElement).style.background
    );
    // jsdom normalises hex to rgb()
    const rgb = "rgb(18, 52, 86)";
    expect(backgrounds.some((bg) => bg.includes("#123456") || bg.includes(rgb))).toBe(true);
  });
});
