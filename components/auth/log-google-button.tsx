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
              className="w-full text-white" 
              variant={"blue"}
              onClick={() => onClick("google")}
            >
              <FcGoogle className="h-5 w-5"/> <span className="ml-2 text-lg">GOOGLE</span>
            </Button>
        </div>
    )
}