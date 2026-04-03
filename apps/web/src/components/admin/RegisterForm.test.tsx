import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithQuery } from "@/test/utils";
import { RegisterForm } from "./RegisterForm";

const mockAssign = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
  vi.stubGlobal("location", { assign: mockAssign });
});

describe("RegisterForm", () => {
  it("renders email, password, confirm password fields and submit button", () => {
    renderWithQuery(<RegisterForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  it("redirects to /admin on successful registration", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));
    renderWithQuery(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("Email"), "new@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(mockAssign).toHaveBeenCalledWith("/admin"));
  });

  it("shows error message on duplicate email", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 })
    );
    renderWithQuery(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("Email"), "existing@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(screen.getByText("Email already registered")).toBeInTheDocument());
  });

  it("shows validation error when passwords do not match", async () => {
    renderWithQuery(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("Email"), "new@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm password"), "different456");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
