import { render, screen } from "@testing-library/react";
import Home from "@/app/page"; // Adjust the import based on your file structure

describe("Home Page", () => {
    it("renders the main heading", () => {
      render(<Home />);
      expect(
        screen.getByRole("heading", {
          name: /create the perfect resume in minutes/i,
        })
      ).toBeInTheDocument();
    });
  
    it("renders the description text", () => {
      render(<Home />);
      expect(
        screen.getByText(/our ai resume builder is here/i)
      ).toBeInTheDocument();
    });
  
    it("renders the Get Started button with correct link", () => {
      render(<Home />);
      const link = screen.getByRole("link", { name: /get started/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/resumes");
    });
  });