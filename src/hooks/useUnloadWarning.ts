import { useEffect } from "react";

export default function useUnloadWarning(condition = true) {
    useEffect(() => {
        // Only in useEffect, we can access window object (maybe)
        // Only in useEffect, we can do these side effects
        if (!condition) return;

        // Making the listener a const, so that it can be passed to both the functions below
        const listener = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        }

        window.addEventListener("beforeunload", listener);

        return () => window.removeEventListener("beforeunload", listener);
    }, [condition]) // i.e. whenever condition changes, this effect will run again
}