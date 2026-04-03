import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "dnd", label: "D&D 5e" },
  { value: "pf2", label: "Pathfinder 2e" },
  { value: "vtm", label: "Vampire: the Masquerade" },
];

function renderSelect(value = "", onChange = vi.fn()) {
  return { onChange, ...render(<Select value={value} onChange={onChange} options={options} />) };
}

describe("Select", () => {
  describe("closed state", () => {
    it("shows the placeholder when no value is selected", () => {
      renderSelect();
      expect(screen.getByRole("combobox")).toHaveTextContent("Select...");
    });

    it("shows a custom placeholder", () => {
      render(<Select value="" onChange={vi.fn()} options={options} placeholder="All systems" />);
      expect(screen.getByRole("combobox")).toHaveTextContent("All systems");
    });

    it("shows the selected option label", () => {
      renderSelect("pf2");
      expect(screen.getByRole("combobox")).toHaveTextContent("Pathfinder 2e");
    });

    it("does not render the listbox when closed", () => {
      renderSelect();
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("opens the dropdown when the trigger is clicked", () => {
      renderSelect();
      fireEvent.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("closes the dropdown when the trigger is clicked again", () => {
      renderSelect();
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByRole("combobox"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes the dropdown when Escape is pressed", () => {
      renderSelect();
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("sets aria-expanded to false when closed and true when open", () => {
      renderSelect();
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("option list", () => {
    it("renders the placeholder as the first option", () => {
      render(<Select value="" onChange={vi.fn()} options={options} placeholder="All systems" />);
      fireEvent.click(screen.getByRole("combobox"));
      const optionEls = screen.getAllByRole("option");
      expect(optionEls[0]).toHaveTextContent("All systems");
    });

    it("renders all options", () => {
      renderSelect();
      fireEvent.click(screen.getByRole("combobox"));
      const optionEls = screen.getAllByRole("option");
      expect(optionEls).toHaveLength(options.length + 1); // +1 for placeholder
      expect(screen.getByRole("option", { name: "D&D 5e" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Pathfinder 2e" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Vampire: the Masquerade" })).toBeInTheDocument();
    });

    it("marks the selected option as aria-selected", () => {
      renderSelect("pf2");
      fireEvent.click(screen.getByRole("combobox"));
      expect(screen.getByRole("option", { name: "Pathfinder 2e" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByRole("option", { name: "D&D 5e" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });
  });

  describe("selection", () => {
    it("calls onChange with the option value when an option is clicked", () => {
      const { onChange } = renderSelect();
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByRole("option", { name: "D&D 5e" }));
      expect(onChange).toHaveBeenCalledWith("dnd");
    });

    it("calls onChange with empty string when the placeholder option is clicked", () => {
      const { onChange } = renderSelect("dnd");
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByRole("option", { name: "Select..." }));
      expect(onChange).toHaveBeenCalledWith("");
    });

    it("closes the dropdown after selecting an option", () => {
      renderSelect();
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.click(screen.getByRole("option", { name: "D&D 5e" }));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("opens the dropdown on ArrowDown when closed", () => {
      renderSelect();
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("moves selection forward with ArrowDown", () => {
      const { onChange } = renderSelect("dnd");
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
      expect(onChange).toHaveBeenCalledWith("pf2");
    });

    it("moves selection backward with ArrowUp", () => {
      const { onChange } = renderSelect("pf2");
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowUp" });
      expect(onChange).toHaveBeenCalledWith("dnd");
    });

    it("does not move past the last option with ArrowDown", () => {
      const { onChange } = renderSelect("vtm");
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
      expect(onChange).toHaveBeenCalledWith("vtm");
    });

    it("does not move past the placeholder with ArrowUp", () => {
      const { onChange } = renderSelect("");
      fireEvent.click(screen.getByRole("combobox"));
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowUp" });
      expect(onChange).toHaveBeenCalledWith("");
    });
  });
});
