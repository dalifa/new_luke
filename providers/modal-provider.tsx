"use client";

import { useEffect, useState } from "react";

import { SoyaUserModal } from "@/components/modals/soya-user-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SoyaUserModal />
    </>
  );
}