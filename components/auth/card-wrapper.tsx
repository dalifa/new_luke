"use client"

import { 
    Card,
    CardContent,
    CardFooter,
    CardHeader,
 }  
from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
}

export const CardWrapper = ({
    children,
    headerLabel,
}: CardWrapperProps) => { 
    return (
        <Card className="w-[400px] lg:w-[500px] bg-white shadow-md m-4">
            <CardHeader>
                <Header label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            
            <CardFooter>
                <Button 
                   variant={"link"} 
                   className="w-full text-slate-500 font-semibold"
                >
                    <Link href={"/home"}>
                        <span className="flex flex-row items-center gap-x-1 text-lg lg:text-xl">
                            <ArrowLeft/> Retour Accueil 
                        </span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}