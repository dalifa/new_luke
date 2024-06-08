"use client";

import { BarChart, Handshake, Home, Info, LayoutDashboard, ScrollText, Settings } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

const dashboardRoutes = [
    {
      icon: LayoutDashboard,
      label: "showcase",
      href: "/", // principal stats of my church
    }, 
    {
      icon: Home,
      label: "home",
      href: "/home", // principal stats of my church
    }, 
    {
      icon: Settings,
      label: "Ccm",
      href: "/ccm", // principal stats of my church
    }, 
    {
      icon: ScrollText,
      label: "Cgu",
      href: "/cgu", // create and update profil - only the connected
    },
    { 
      icon: Info,
      label: "Infos",
      href: "/infos-legales", // my church and my ministries
    },
    {
      icon: Handshake,
      label: "Partenariat",
      href: "/partenariat", // list of all church members
    },
    { 
      icon: BarChart,
      label: "Stats",
      href: "/statistiques", // list of members to call in the week
    },
    //
  ];

  let routes = dashboardRoutes

export const SidebarRoutes = () => {

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