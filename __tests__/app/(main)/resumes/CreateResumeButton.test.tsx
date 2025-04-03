import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateResumeButton from "@/app/(main)/resumes/CreateResumeButton";
import usePremiumModel from "@/hooks/usePremiumModel";

// Mock hooks
jest.mock("@/hooks/usePremiumModel", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("CreateResumeButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a link when canCreate is true", () => {
    (usePremiumModel as jest.Mock).mockReturnValue({ setOpen: jest.fn() });
    render(<CreateResumeButton canCreate={true} />);
    expect(screen.getByRole("link", { name: /new resume/i })).toBeInTheDocument();
  });

  it("renders a button and calls setOpen when canCreate is false", () => {
    const setOpenMock = jest.fn();
    (usePremiumModel as jest.Mock).mockReturnValue({ setOpen: setOpenMock });

    render(<CreateResumeButton canCreate={false} />);
    const button = screen.getByRole("button", { name: /new resume/i });
    fireEvent.click(button);

    expect(setOpenMock).toHaveBeenCalledWith(true);
  });
});
