import {
    canCreateResume,
    canUseAITools,
    canUseCustomizations,
  } from "@/lib/permissions";
  
  describe("permission utils", () => {
    describe("canCreateResume", () => {
      it("allows only 1 resume for free plan", () => {
        expect(canCreateResume("free", 0)).toBe(true);
        expect(canCreateResume("free", 1)).toBe(false);
        expect(canCreateResume("free", 2)).toBe(false);
      });
  
      it("allows up to 3 resumes for pro plan", () => {
        expect(canCreateResume("pro", 0)).toBe(true);
        expect(canCreateResume("pro", 2)).toBe(true);
        expect(canCreateResume("pro", 3)).toBe(false);
      });
  
      it("allows unlimited resumes for pro_plus plan", () => {
        expect(canCreateResume("pro_plus", 0)).toBe(true);
        expect(canCreateResume("pro_plus", 10)).toBe(true);
        expect(canCreateResume("pro_plus", 1000)).toBe(true);
      });
    });
  
    describe("canUseAITools", () => {
      it("disallows AI tools for free plan", () => {
        expect(canUseAITools("free")).toBe(false);
      });
  
      it("allows AI tools for pro and pro_plus plans", () => {
        expect(canUseAITools("pro")).toBe(true);
        expect(canUseAITools("pro_plus")).toBe(true);
      });
    });
  
    describe("canUseCustomizations", () => {
      it("allows customizations only for pro_plus plan", () => {
        expect(canUseCustomizations("free")).toBe(false);
        expect(canUseCustomizations("pro")).toBe(false);
        expect(canUseCustomizations("pro_plus")).toBe(true);
      });
    });
  });
  