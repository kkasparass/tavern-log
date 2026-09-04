import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransitionLink } from "./TransitionLink";
import { TransitionProvider } from "./TransitionProvider";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import { TransitionId } from "@/lib/themes/types";
import type { ThemeConfig } from "@/lib/themes/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const FLORAL_THEME: ThemeConfig = { ...DEFAULT_THEME, transition: TransitionId.FloralBloom };
const NO_TRANSITION_THEME: ThemeConfig = { ...DEFAULT_THEME, transition: null };

function renderLink(theme: ThemeConfig) {
  return render(
    <TransitionProvider>
      <TransitionLink href="/characters/mira-ashveil" theme={theme}>
        Go to Mira
      </TransitionLink>
    </TransitionProvider>
  );
}

describe("TransitionLink", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders children", () => {
    renderLink(FLORAL_THEME);
    expect(screen.getByText("Go to Mira")).toBeInTheDocument();
  });

  it("renders as an anchor with correct href", () => {
    renderLink(FLORAL_THEME);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/characters/mira-ashveil");
  });

  it("accepts a className prop", () => {
    render(
      <TransitionProvider>
        <TransitionLink href="/target" theme={NO_TRANSITION_THEME} className="my-class">
          Link
        </TransitionLink>
      </TransitionProvider>
    );
    expect(screen.getByRole("link")).toHaveClass("my-class");
  });

  it("with a transition: does not call router.push immediately on click (uses covering phase)", async () => {
    renderLink(FLORAL_THEME);
    await userEvent.click(screen.getByText("Go to Mira"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("with a null-transition theme: calls router.push directly on click", async () => {
    renderLink(NO_TRANSITION_THEME);
    await userEvent.click(screen.getByText("Go to Mira"));
    expect(mockPush).toHaveBeenCalledWith("/characters/mira-ashveil");
  });

  it("delegates navigation to navigate() in all cases", async () => {
    const covering = renderLink(FLORAL_THEME);
    await userEvent.click(screen.getByText("Go to Mira"));
    // covering path defers the push
    expect(mockPush).not.toHaveBeenCalled();
    covering.unmount();

    renderLink(NO_TRANSITION_THEME);
    await userEvent.click(screen.getByText("Go to Mira"));
    // immediate path performs it
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("prevents default browser navigation on click", async () => {
    renderLink(FLORAL_THEME);
    const link = screen.getByRole("link");
    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
