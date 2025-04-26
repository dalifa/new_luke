"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

 
export const LogGoogleButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

    return (
        <div className="flex flex-col gap-y-3 items-center w-full gap-x-2 py-5">
            <Button size="lg"
              className="w-full text-indigo-600 h-14 bg-white hover:text-white hover:bg-indigo-400" 
              onClick={() => onClick("google")}
            >
              <FcGoogle className="h-5 w-5 lg:h-7 lg:w-7"/>
               <span className="ml-2 text-xl">Rejoindre</span>
            </Button>
        </div>
    )
}