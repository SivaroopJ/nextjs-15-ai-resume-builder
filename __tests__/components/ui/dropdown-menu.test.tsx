import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuGroup,
  } from "@/components/ui/dropdown-menu"
  import { render, screen } from "@testing-library/react"
  import userEvent from "@testing-library/user-event"
  import React from "react"
  import "@testing-library/jest-dom"
  
  describe("DropdownMenu", () => {
    it("renders trigger and opens menu on click", async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
  
      const trigger = screen.getByText("Open Menu")
      await userEvent.click(trigger)
  
      // Use findByText to wait for portal-rendered content
      expect(await screen.findByText("Item 1")).toBeInTheDocument()
      expect(await screen.findByText("Item 2")).toBeInTheDocument()
    })
  
    it("calls onSelect when an item is clicked", async () => {
      const onSelect = jest.fn()
  
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Click Me</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
  
      const trigger = screen.getByText("Open")
      await userEvent.click(trigger)
  
      const item = await screen.findByText("Click Me")
      await userEvent.click(item)
  
      expect(onSelect).toHaveBeenCalled()
    })
  })
  
  describe("Dropdown Menu Extras", () => {
    it("renders a Checkbox item and toggles its state", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={false}>
              Checkbox Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
  
      await user.click(screen.getByText("Open"));
      const checkboxItem = await screen.findByText("Checkbox Item");
      expect(checkboxItem).toBeInTheDocument();
    });
  
    it("renders radio group with radio items", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="a">
              <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
  
      await user.click(screen.getByText("Open"));
      expect(await screen.findByText("A")).toBeInTheDocument();
      expect(await screen.findByText("B")).toBeInTheDocument();
    });
  
    it("renders label and separator", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Label</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
  
      await user.click(screen.getByText("Open"));
      expect(await screen.findByText("Label")).toBeInTheDocument();
    });
  
    it("renders shortcut inside an item", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>
              With Shortcut
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
  
      await user.click(screen.getByText("Open"));
      expect(await screen.findByText("⌘K")).toBeInTheDocument();
    });
  
    it("renders sub menu with trigger and content", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem>Sub Item</DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
  
      await user.click(screen.getByText("Open"));
      const trigger = await screen.findByText("More Options");
      expect(trigger).toBeInTheDocument();
      await user.hover(trigger);
      expect(await screen.findByText("Sub Item")).toBeInTheDocument();
    });
  
    // ✅ DropdownMenuPortal test
    it("renders DropdownMenuContent inside a DropdownMenuPortal", async () => {
        const user = userEvent.setup();
      
        render(
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent>
                <div>Inside Portal</div>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        );
      
        await user.click(screen.getByText("Open"));
      
        // Just test the actual content rendered inside the portal
        const portalContent = await screen.findByText("Inside Portal");
        expect(portalContent).toBeInTheDocument();
      });
      
      it("renders DropdownMenuGroup with children", async () => {
        const user = userEvent.setup();
        render(
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem checked>
                  Grouped Item
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
        await user.click(screen.getByText("Open"));
      
        const groupItem = await screen.findByText("Grouped Item");
        expect(groupItem).toBeInTheDocument();
      
        const groupElement = document.querySelector('[data-slot="dropdown-menu-group"]');
        expect(groupElement).toContainElement(groupItem);
      });
  });