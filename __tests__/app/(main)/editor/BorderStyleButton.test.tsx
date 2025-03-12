import { render, screen, fireEvent } from "@testing-library/react";
import BorderStyleButton, { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider";
import usePremiumModel from "@/hooks/usePremiumModel";
import { canUseCustomizations } from "@/lib/permissions";

jest.mock("@/app/(main)/SubscriptionLevelProvider", () => ({
  useSubscriptionLevel: jest.fn(),
}));

jest.mock("@/hooks/usePremiumModel", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/permissions", () => ({
  canUseCustomizations: jest.fn(),
}));

describe("BorderStyleButton", () => {
  const mockSetOpen = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (usePremiumModel as jest.Mock).mockReturnValue({
      setOpen: mockSetOpen,
    });
  });

  it("renders correct icon for square", () => {
    render(<BorderStyleButton borderStyle="square" onChange={mockOnChange} />);
    const icon = screen.getByTestId("border-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("lucide-square");
  });
  
  it("renders correct icon for circle", () => {
    render(<BorderStyleButton borderStyle="circle" onChange={mockOnChange} />);
    const icon = screen.getByTestId("border-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("lucide-circle");
  });
  
  it("renders correct icon for squircle (default)", () => {
    render(<BorderStyleButton borderStyle="squircle" onChange={mockOnChange} />);
    const icon = screen.getByTestId("border-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("lucide-squircle");
  });
  

  it("cycles to next border style when clicked", () => {
    (useSubscriptionLevel as jest.Mock).mockReturnValue("pro");
    (canUseCustomizations as jest.Mock).mockReturnValue(true);

    render(<BorderStyleButton borderStyle="square" onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnChange).toHaveBeenCalledWith(BorderStyles.CIRCLE);
  });

  it("opens premium modal when user has no access", () => {
    (useSubscriptionLevel as jest.Mock).mockReturnValue("free");
    (canUseCustomizations as jest.Mock).mockReturnValue(false);

    render(<BorderStyleButton borderStyle="square" onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetOpen).toHaveBeenCalledWith(true);
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
