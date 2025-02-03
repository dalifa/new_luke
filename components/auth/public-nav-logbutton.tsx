"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LogIn } from "lucide-react";

 
export const NavLogButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

    return (
      <div className="flex flex-col gap-y-1 items-center">
        <Button size="sm" className=" text-white bg-blue-500 hover:bg-blue-400" 
          onClick={() => onClick("google")}
        >
          <LogIn className="h-5 w-5"/>
        </Button>
      </div>
    )
}