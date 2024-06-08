"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import Link from "next/link";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { SidebarRoutes } from "./sidebar-routes";
import { ScrollArea } from "../ui/scroll-area";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        className="mr-1"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="p-2 pt-10"
        >
          <ScrollArea className="h-[550px]">
          <SidebarRoutes/>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}