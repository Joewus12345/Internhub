/* eslint-disable @next/next/no-img-element */
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Menu, Package2, Search } from "lucide-react";
import { Button } from "../ui/button";
import Profile from "./profile";
import { useCommand } from "@/utils/state";
import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";
import { generatePdfAction } from "@/app/action";
import useSWR from "swr";

export default function Navbar() {
  const [command, setCommand] = useCommand();
  const user = useSWR("/api/user", async (url) => {
    const response = await fetch(url);
    return response.json();
  });
  console.log(user.data)
  const handleDownload = async () => {
    const res = await generatePdfAction();

    if (res?.sucess) {
      // Convert buffer to ArrayBuffer
      const arrayBuffer = new Uint8Array(res?.pdf).buffer;

      // Create a blob from the ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });

      // Create a link element, use it to trigger the download, and remove it
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Internship Letter.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Failed to generate PDF");
    }
  };

  return (
    <header className="top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-purple-700 bg-opacity-65  text-violet-50 sticky z-10 backdrop-blur-sm">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <img src="/logo.svg" alt="logo" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="#"
          className="transition-colors hover:text-foreground text-inherit flex items-center gap-1 mr-5"
        >
          <img src="/logo.svg" alt="logo" />
          Internhub
        </Link>
        {<NavigationMenuDemo handledownload={handleDownload} />}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5 text-zinc-600" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex transition-colors hover:text-foreground text-inherit items-center gap-2 mr-5 text-lg font-semibold"
            >
              <img src="/logo.svg" alt="logo" />
              Internhub
            </Link>
            {<NavigationMenuDemo handledownload={handleDownload} />}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <div
              onClick={() => setCommand(true)}
              className="w-full text-muted-foreground cursor-pointer bg-white p-1.5 px-4  rounded-md flex gap-2 items-center hover:bg-purple-300 duration-300 "
            >
              <span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </span>
              <span>Search...</span>{" "}
            </div>
          </div>
        </form>
        {user.data && <Profile name={user.data.name} id={user.data.id} />}
      </div>
    </header>
  );
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function NavigationMenuDemo({ handledownload }: any) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col gap-8 sm:flex-row sm:gap-2">
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-transparent border-none">
            Progress
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] ">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <img src="/logo.svg" alt="logo" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Internhub
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent border-none">
            Downloads
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[350px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem onClick={handledownload} className="cursor-pointer">
                Download Internship Letter
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/student/dashboard/applications" legacyBehavior passHref>
            <NavigationMenuLink className="transition-colors text-foreground md:text-white hover:text-muted-foreground md:hover:text-foreground text-[16px] md:text-sm">Applications</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
