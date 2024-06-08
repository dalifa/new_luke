import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins ({
    subsets: ["latin"],
    weight: ["600"]
}); 

interface HeaderProps {
    label: string;
}

export const Header = ({
    label
}: HeaderProps) => { 
    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
            <h1 className="text-3xl text-blue-500 font-semibold mb-5 mt-2">Luke 6:38</h1>
            <h1 className={cn(
                "text-xl text-slate-500 font-semibold",
                font.className,
            )}
            >
                Inscription & Connexion
            </h1>
            <p className="text-muted-foreground text-sm md:text-md text-slate-500 mt-2">
                {label}
            </p>
        </div>
    )
}