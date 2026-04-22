import React from "react";
import { Loader2 } from "lucide-react";

const PageLoader: React.FC = () => (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white font-sans">
        <Loader2 className="w-8 h-8 text-primary/30 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Initializing App</p>
    </div>
);

export default PageLoader;
