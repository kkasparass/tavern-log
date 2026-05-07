import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterThemeOverlay } from "./CharacterThemeOverlay";
import { TransitionProvider, useTransition } from "./TransitionProvider";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import { TransitionId } from "@/lib/themes/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Driver component to control TransitionProvider state from tests
function TestDriver({ action }: { action: string }) {
  const { setHoveredCharacter, navigate } = useTransition();
  return (
    <button
      onClick={() => {
        if (action === "hover") setHoveredCharacter(DEFAULT_THEME);
        if (action === "navigate") navigate("/target", TransitionId.FloralBloom);
      }}
    >
      {action}
    </button>
  );
}

function renderOverlay(action: string) {
  return render(
    <TransitionProvider>
      <CharacterThemeOverlay />
      <TestDriver action={action} />
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
});
