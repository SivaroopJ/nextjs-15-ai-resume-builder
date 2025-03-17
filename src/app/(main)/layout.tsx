import React from "react";
import Navbar from "./Navbar";
import PremiumModel from "@/components/premium/PremiumModel";

export default function Layout({children}: {children: React.ReactNode}){
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
            <PremiumModel />
        </div>
    );
}