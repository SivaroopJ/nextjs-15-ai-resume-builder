import { create } from "zustand"

interface PremiumModelState {
    open : boolean;
    setOpen : (open : boolean) => void;
}

const usePremiumModel = create<PremiumModelState>(set => ({
    open : false,
    setOpen : (open : boolean) => set({open})
}));

export default usePremiumModel;