import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransitionProvider, useTransition } from "./TransitionProvider";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import { TransitionId } from "@/lib/themes/types";
import type { ThemeConfig } from "@/lib/themes/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const FLORAL_THEME: ThemeConfig = { ...DEFAULT_THEME, transition: TransitionId.FloralBloom };
const NO_TRANSITION_THEME: ThemeConfig = { ...DEFAULT_THEME, transition: null };
const CUSTOM_BG_THEME: ThemeConfig = {
  ...DEFAULT_THEME,
  transition: TransitionId.FloralBloom,
  colors: { ...DEFAULT_THEME.colors, bg: "#123456" },
};

function PhaseDisplay() {
  const { phase, previewTheme, activeTransition } = useTransition();
  return (
    <>
      <div data-testid="phase">{phase}</div>
      <div data-testid="theme">{previewTheme ? "set" : "null"}</div>
      <div data-testid="bg">{previewTheme?.colors.bg ?? "null"}</div>
      <div data-testid="transition">{activeTransition ?? "null"}</div>
    </>
  );
}

function Controls() {
  const { hoverPreview, clearHoverPreview, navigate, preview, onCoverComplete, onUncoverComplete } =
    useTransition();
  return (
    <>
      <button onClick={() => hoverPreview(FLORAL_THEME)}>hover-preview</button>
      <button onClick={clearHoverPreview}>clear-hover-preview</button>
      <button onClick={() => navigate("/target", FLORAL_THEME)}>navigate-transition</button>
      <button onClick={() => navigate("/target", NO_TRANSITION_THEME)}>
        navigate-immediate
      </button>
      <button onClick={() => navigate("/target", CUSTOM_BG_THEME)}>navigate-custom</button>
      <button onClick={() => preview(FLORAL_THEME)}>preview</button>
      <button onClick={() => preview(CUSTOM_BG_THEME)}>preview-custom</button>
      <button onClick={onCoverComplete}>cover-complete</button>
      <button onClick={onUncoverComplete}>uncover-complete</button>
    </>
  );
}

function TestTree() {
  return (
    <TransitionProvider>
      <PhaseDisplay />
      <Controls />
    </TransitionProvider>
  );
}

describe("TransitionProvider", () => {
  beforeEach(() => vi.clearAllMocks());

  it("starts in idle phase with null theme and transition", () => {
    render(<TestTree />);
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("theme")).toHaveTextContent("null");
    expect(screen.getByTestId("transition")).toHaveTextContent("null");
  });

  it("hoverPreview sets previewTheme and transitions idle → hover-preview", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("hover-preview"));
    expect(screen.getByTestId("phase")).toHaveTextContent("hover-preview");
    expect(screen.getByTestId("theme")).toHaveTextContent("set");
    expect(screen.getByTestId("transition")).toHaveTextContent(TransitionId.FloralBloom);
  });

  it("hoverPreview during covering does not change phase", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("hover-preview"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
  });

  it("clearHoverPreview in hover-preview → idle and clears theme", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("hover-preview"));
    await userEvent.click(screen.getByText("clear-hover-preview"));
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("theme")).toHaveTextContent("null");
    expect(screen.getByTestId("transition")).toHaveTextContent("null");
  });

  it("clearHoverPreview during covering is ignored", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("clear-hover-preview"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
  });

  it("navigate with null-transition theme calls router.push immediately and stays idle", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-immediate"));
    expect(mockPush).toHaveBeenCalledWith("/target");
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("theme")).toHaveTextContent("null");
  });

  it("navigate with a transition sets previewTheme and enters covering", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    expect(screen.getByTestId("theme")).toHaveTextContent("set");
    expect(screen.getByTestId("transition")).toHaveTextContent(TransitionId.FloralBloom);
  });

  it("navigate sets colours without a prior hover (touch-device path)", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-custom"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    expect(screen.getByTestId("bg")).toHaveTextContent("#123456");
  });

  it("preview sets previewTheme and enters covering", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("preview-custom"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    expect(screen.getByTestId("bg")).toHaveTextContent("#123456");
    expect(screen.getByTestId("transition")).toHaveTextContent(TransitionId.FloralBloom);
  });

  it("onCoverComplete in navigate mode calls router.push and transitions to uncovering", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("cover-complete"));
    expect(mockPush).toHaveBeenCalledWith("/target");
    expect(screen.getByTestId("phase")).toHaveTextContent("uncovering");
  });

  it("onCoverComplete in preview mode does not call router.push and transitions to uncovering", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("preview"));
    await userEvent.click(screen.getByText("cover-complete"));
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByTestId("phase")).toHaveTextContent("uncovering");
  });

  it("onUncoverComplete transitions to idle and clears theme", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("cover-complete"));
    await userEvent.click(screen.getByText("uncover-complete"));
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("theme")).toHaveTextContent("null");
    expect(screen.getByTestId("transition")).toHaveTextContent("null");
  });

  it("onCoverComplete and onUncoverComplete are stable across re-renders", async () => {
    const captured: { cover: unknown; uncover: unknown }[] = [];

    function CaptureFns() {
      const { onCoverComplete, onUncoverComplete, hoverPreview } = useTransition();
      captured.push({ cover: onCoverComplete, uncover: onUncoverComplete });
      return <button onClick={() => hoverPreview(DEFAULT_THEME)}>rerender</button>;
    }

    render(
      <TransitionProvider>
        <CaptureFns />
      </TransitionProvider>
    );

    await userEvent.click(screen.getByText("rerender"));

    expect(captured.length).toBeGreaterThanOrEqual(2);
    expect(captured[0]!.cover).toBe(captured[captured.length - 1]!.cover);
    expect(captured[0]!.uncover).toBe(captured[captured.length - 1]!.uncover);
  });

  it("useTransition throws outside provider", () => {
    function BadConsumer() {
      useTransition();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow(
      "useTransition must be used inside TransitionProvider"
    );
  });
});
