"use client"

import { Button } from "@/components/ui/button"

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

 
export const JoinButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

    return (
      <Button size="sm" className="text-white text-lg py-5 bg-green-600 hover:bg-blue-400" 
          onClick={() => onClick("google")}
        >
          Rejoindre la communauté
        </Button>
    )
}