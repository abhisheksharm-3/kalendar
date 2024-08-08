"use client"
import React from "react";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
  Link, 
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { RiCalendarLine, RiRocketLine, RiPuzzleLine, RiCustomerServiceLine, RiLoginBoxLine } from "@remixicon/react";

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Features", icon: <RiRocketLine className="mr-2" /> },
    { name: "How It Works", icon: <RiPuzzleLine className="mr-2" /> },
    { name: "Pricing", icon: <RiCalendarLine className="mr-2" /> },
    { name: "Support", icon: <RiCustomerServiceLine className="mr-2" /> },
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen} 
      maxWidth="xl"
      className="bg-black/50 backdrop-blur-md border-b border-white/20"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <RiCalendarLine className="text-purple-500 mr-2 text-2xl" />
          <p className="font-bold text-xl text-white">Kalendar AI</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={item.name}>
            <Link 
              color="foreground" 
              href="#"
              className="text-white/70 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button 
            as={Link} 
            href="/sign-in" 
            className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-black/90 backdrop-blur-md pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color="foreground"
              className="w-full text-white/70 hover:text-white transition-colors"
              href="#"
              size="lg"
            >
              {item.icon}
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link
            color="danger"
            className="w-full"
            href="/sign-in"
            size="lg"
          >
            <RiLoginBoxLine className="mr-2 inline" />
            Login
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}