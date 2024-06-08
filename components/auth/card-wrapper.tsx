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
import { ArrowLeft, ChevronLeft } from "lucide-react";

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
        <CardHeader className="flex">
          <div className="flex flex-row items-center justify-between">
            <Link href={"/home"}>
              <ChevronLeft className="text-blue-500 hover:text-white hover:bg-blue-500 rounded-sm"/>
            </Link>
            <span>🤝</span>
          </div>
          <Header label={headerLabel}/>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    )
}