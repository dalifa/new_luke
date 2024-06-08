"use client";

import { HandPlatter, LayoutDashboard, UserRound, Waypoints } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

const dashboardRoutes = [
    
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard", // principal stats of my church
    }, 
    {
        icon: UserRound,
        label: "Profil",
        href: "/dashboard/profil", // principal stats of my church
    }, 
    {
      icon: LayoutDashboard,
      label: "Transfert",
      href: "/dashboard/transfert", // principal stats of my church
    }, 
    {
      icon: Waypoints,
      label: "Historique",
      href: "/dashboard/historique", // create and update profil - only the connected
    },
    {
      icon: HandPlatter,
      label: "Stats",
      href: "/dashboard/stats", // 
    },
    //
  ];

  let routes = dashboardRoutes

export const PrivateSidebarRoutes = () => {

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}