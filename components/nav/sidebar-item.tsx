"use client"

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  /*
    ## ce qui était avant
    const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);
  */

  // ma modif ça marche
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith(`/dashboard/${href}/`);

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "mb-1 flex items-center gap-x-2 text-slate-600 text-sm font-[500] pl-3 transition-all hover:bg-sky-300/20 rounded-md",
        isActive && "text-blue-500 bg-blue-400/20 hover:bg-sky-200/20 hover:text-blue-500 rounded-md"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-600",
            isActive && "text-blue-500"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-blue-500 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  )
}