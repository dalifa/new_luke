"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"

import { signIn } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

 
export const LogGoogleButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

    return (  
        <div className="flex flex-col gap-y-3 items-center w-full gap-x-2 py-5">
          { pathname !== "/" ? (
            <Button size="lg"
              className="w-full bg-red-800 h-14 text-white hover:bg-red-900 hover:border-white hover:border-2" 
              onClick={() => onClick("google")}
            >
              <FcGoogle className="h-5 w-5"/>
               <span className="ml-2 text-lg">Rejoindre</span>
            </Button>
          ):(
            <Button size="lg"
              className="w-full bg-red-900 h-14 text-white hover:bg-white hover:text-red-800" 
              onClick={() => onClick("google")}
            >
              <FcGoogle className="h-5 w-5"/>
               <span className="ml-2 text-lg">Rejoindre</span>
            </Button>
          )
        }
        </div>
    )
}