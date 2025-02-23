"use client";
/* eslint-disable @next/next/no-img-element */
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  EllipsisIcon,
  LogOut,
  Mail,
  MenuIcon,
  Phone,
  Plus,
  Search,
  Sliders,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR, { mutate } from "swr";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Internship, Student } from "@prisma/client";
import { LogoutAction, RecruitAction, SoftDeletAction } from "@/app/action";
import toast, { Toaster } from "react-hot-toast";
import { revalidateTag } from "next/cache";

export default function Page() {
  const [search, setSearch] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState([]);
  const [selected, setSelected] = useState("");
  const [posts, setPosts] = useState([]);
  const [postsearch, setPostSearch] = useState("");
  const [filter, setFilter] = useState("name");
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const mobileApplicantsRef = useRef<HTMLDivElement>(null);

  const user = useSWR("/api/user", async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  const { data, isLoading } = useSWR(
    "/api/posts",
    async (url: string | URL | Request) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  async function handleApplicantData(id: string) {
    const response = await fetch(`/api/posts/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    setSelectedApplicant(data);
  }
  async function handleAction(action: string, id: string) {
    const res = await RecruitAction(action, id);
    if (res?.success) {
      toast.success(res.message);
      if (res?.id) {
        handleApplicantData(res.id)
        mutate("/api/applications")
      }
    }
  }

  function stripHtml(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  function truncateString(str: string, num: number): string {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-purple-300 px-2";
      case "hired":
        return "bg-green-300 px-4";
      case "rejected":
        return "bg-red-400";
      default:
        return "";
    }
  };
  async function handleSoftDelete(id: string) {
    const res = await SoftDeletAction(id);
    if (res.success) {
      toast.success(res.message);
      mutate("/api/internships");
    } else {
      toast.error(res.message)
    }
  }
  const filteredApplicants = search
    ? selectedApplicant.filter((application: any) => {
      const searchTerm = search.toLowerCase();
      if (filter === "name") {
        return application.applicant.name.toLowerCase().includes(searchTerm);
      } else if (filter === "programme") {
        return application.applicant.programme
          .toLowerCase()
          .includes(searchTerm);
      } else if (filter === "status") {
        return application.applicationStatus
          .toLowerCase()
          .includes(searchTerm);
      }
    })
    : selectedApplicant;

  const filteredPosts: Internship[] = postsearch
    ? data.filter((post: Internship) => {
      return post.title.toLowerCase().includes(postsearch.toLowerCase());
    })
    : data;

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        handleApplicantData(data[0].id);
      }
    }
  }, [data]);

  function scrollToApplicants(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setSheetOpen(false); // close the hamburger
    mobileApplicantsRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="w-full md:w-screen flex flex-col md:flex-row text-sm text-gray-600 md:h-screen md:overflow-hidden">
      {/* Simplified sidebar for mobile */}
      <div className="hidden xl:flex flex-col justify-center bg-white w-14 border-r border-gray-200 flex-shrink-0">
        <div className="h-16 text-blue-500 flex items-center justify-center">
          {/* <img src="/logo.svg" alt="logo" /> */}
        </div>
        <div className="mx-auto flex-grow mt-4 flex flex-col text-gray-400 space-y-4">
          <div className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-neutral-100 duration-700">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs text-neutral-400">Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <button className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-neutral-200 duration-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </button>
          <button className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-neutral-200 duration-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </button>
          <button className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-neutral-200 duration-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Topbar with mobile optimizations */}
        <div className="flex items-center w-full h-12 border-b border-b-neutral-200 px-2 xs:px-4 py-2 sticky top-0 z-[9999] backdrop-blur-sm bg-white transition">
          <Link
            href="#"
            className="hidden md:flex transition-colors hover:text-foreground text-inherit items-center gap-1 mr-5"
          >
            <img src="/logo.svg" alt="logo" />
            Internhub
          </Link>
          <div className="md:hidden flex gap-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <button onClick={() => setSheetOpen(true)}>
                <MenuIcon />
              </button>
              <SheetContent className="w-[250px]" side="left">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href="#"
                      className="transition-colors hover:text-foreground text-inherit flex items-center gap-1 mr-5"
                    >
                      <img src="/logo.svg" alt="logo" />
                      Internhub
                    </Link>
                  </SheetTitle>
                  <SheetDescription>
                    <div className="mt-4 flex flex-col space-y-2">
                      <Link href="/recruit/dashboard/post" className="hover:text-foreground text-inherit transition-colors">
                        Post Opening
                      </Link>
                      <Link href="#"
                        className="hover:text-foreground text-inherit transition-colors text-left"
                        onClick={scrollToApplicants}
                      >
                        Applicants for Selected Opening
                      </Link>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Link
              href="#"
              className="transition-colors hover:text-foreground text-inherit flex items-center gap-1 mr-5"
            >
              <img src="/logo.svg" alt="logo" />
              Internhub
            </Link>
          </div>

          {/* Profile with mobile adjustments */}
          <span className="ml-auto">
            <div className="h-full flex items-center">
              <span className="relative flex-shrink-0">
                <img
                  className="w-6 h-6 rounded-full mr-4"
                  src={user.data?.profile}
                  alt="profile"
                />
                <span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white mr-4"></span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-full text-xs text-neutral-400 flex items-center p-1 xs:p-2"
                  >
                    <span className="hidden xs:inline">
                      {user.data ? user.data?.name : <span className="px-4">Loading...</span>}
                    </span>
                    <ChevronsUpDown size={15} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex justify-between"
                    onClick={async () => {
                      await LogoutAction("recruit");
                    }}
                  >
                    Log out
                    <LogOut size={16} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </span>
        </div>

        {/* Main content sections */}
        <div className="flex flex-col md:flex-row w-full flex-1 h-full">
          {/* Openings Posted - Mobile optimized */}
          <div className="w-full md:w-96 flex flex-col border-b md:border-b-0 md:border-r border-neutral-300 py-2 px-2 md:px-4 
                     md:h-full md:overflow-hidden">
            <div className="text-xs text-gray-400 tracking-wider text-center mb-2 xs:mb-3">
              OPENINGS POSTED
            </div>

            {/* Search bar */}
            <div className="relative pr-2 xs:pr-3">
              <input
                type="text"
                className="pl-8 h-8 xs:h-9 border border-gray-300 w-full rounded-md text-xs xs:text-sm outline-none"
                placeholder="Search"
                onChange={(e) => setPostSearch(e.target.value)}
              />
              <Search className="w-4 h-4 absolute text-gray-400 top-1/2 -translate-y-1/2 left-2" />
            </div>

            {/* Post list - Mobile optimized */}
            <ScrollArea className="flex-1 pt-2">
              <div className="pr-2 xs:pr-3">
                {isLoading &&
                  Array.from({ length: 5 }).map(() => {
                    return (
                      <div
                        key={1}
                        className="flex flex-col space-y-3 mb-4 mx-auto"
                      >
                        <Skeleton className="h-[150px] w-full bg-neutral-200 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    );
                  })}
                {!isLoading && filteredPosts && filteredPosts.map((value: Internship) => (
                  <ContextMenu key={value.id}>
                    <ContextMenuTrigger>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="w-full text-center cursor-pointer -mb-2 mt-4">
                              <EllipsisIcon />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem className="cursor-pointer">
                                <Link
                                  className="cursor-pointer"
                                  href={`/recruit/dashboard/details/${value.id}`}
                                >
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setIsAlertOpen(true)
                                  setDeleteId(value.id);
                                }}
                                className="cursor-pointer"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg cursor-pointer border p-2 mt-3  text-left text-sm transition-all hover:border-neutral-400",
                          `${selected === value.id && "bg-purple-100"
                          } hover:bg-neutral-50 hover:bg-opacity-70  duration-700 relative`
                        )}
                        onClick={() => {
                          setSelected(value.id);
                          handleApplicantData(value.id);
                        }}
                      >
                        <div className="font-semibold flex items-center justify-between w-full">
                          <span>{value.title}</span>
                          {value.soft_delete && (
                            <span className="flex bg-red-600 w-1 h-1 rounded-md text-white text-center items-center justify-center"></span>
                          )}
                        </div>
                        <div className="text-sm flex items-start">
                          <span className="mt-[6px] mr-1">
                            <Circle size={7} />
                          </span>
                          <div className="rendered-content">
                            {truncateString(
                              stripHtml(value.description),
                              210
                            )}
                          </div>
                        </div>
                        <div className="">
                          <span className="text-purple-500">
                            posted{" "}
                            {formatDistanceToNow(
                              new Date(value.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    < ContextMenuContent >
                      <ContextMenuLabel inset>Actions</ContextMenuLabel>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() =>
                          router.push("/recruit/dashboard/details/" + value.id)
                        }
                      >
                        View Details
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => {
                        setIsAlertOpen(true)
                        setDeleteId(value.id)
                      }
                      }>
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                {!isLoading && filteredPosts && filteredPosts.length === 0 && (
                  <div className="w-full text center py-4">No Posts</div>
                )}
              </div>
              <div className="h-24"></div>
              <ScrollBar />
            </ScrollArea>
          </div>

          {/* Applicants Section - Mobile optimized */}
          <div className="flex-1 w-full">
            <ScrollArea className="w-full h-full">
              <div className="px-2 xs:px-4 pt-2 xs:pt-4 bg-white">
                {/* Header section */}
                <div className="flex flex-col xs:flex-row gap-2 items-start xs:items-center">
                  <div className="flex items-center text-lg xs:text-xl md:text-2xl">
                    <img
                      src={user.data && user.data?.company?.profile_url}
                      className="w-8 h-8 xs:w-10 xs:h-10 mr-2 rounded-full"
                      alt=""
                    />
                    <span className="truncate max-w-[150px] xs:max-w-none">
                      {user.data &&
                        user.data?.company?.name.charAt(0).toUpperCase() +
                        user.data?.company?.name.slice(1)}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    className="ml-auto px-2 h-8 text-xs xs:text-sm"
                    onClick={() => router.push("/recruit/dashboard/post")}
                  >
                    <Plus size={14} className="mr-1" />
                    Post Opening
                  </Button>
                </div>

                {/* Search and filter - Mobile optimized */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="relative flex-1 min-w-[120px] h-full">
                    <input
                      type="text"
                      className="pl-8 h-8 border border-gray-300 w-full rounded-md text-xs xs:text-sm outline-none"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="w-4 h-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2" />
                  </div>

                  <div className="flex items-center gap-2 w-full xs:w-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="py-0 px-2">
                          <Sliders className="w-5 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={filter}
                          onValueChange={setFilter}
                        >
                          <DropdownMenuRadioItem value="name">
                            Name
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="programme">
                            Programme
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="status">
                            Status
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center gap-1 ml-auto">
                      <button className="p-1 rounded-md bg-purple-100 hover:bg-purple-300 duration-500">
                        <ChevronLeft />
                      </button>
                      <button className="p-1 rounded-md bg-purple-100 hover:bg-purple-300 duration-500">
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Applicants list - Mobile card view */}
                <div
                  ref={mobileApplicantsRef}
                  className="md:hidden space-y-2 mt-3"
                >
                  {isLoading && (
                    <div className="h-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-2">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoading && filteredApplicants && filteredApplicants.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-xs xs:text-sm">
                            {application.applicant.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {application.applicant.programme}
                          </div>
                        </div>
                        <span className={`text-xs px-2 rounded-full ${getStatusClass(application.applicationStatus)}`}>
                          {application.applicationStatus}
                        </span>
                      </div>

                      <div className="mt-2 text-xs space-y-1">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {application.applicant.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {application.applicant.contact_number}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="w-full text-center cursor-pointer">
                            <EllipsisIcon />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                              <Link
                                className="cursor-pointer"
                                href={`/recruit/dashboard/${application.id}`}
                              >
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction("hire", application.id)
                              }
                              className="cursor-pointer"
                            >
                              Hire
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction("reject", application.id)
                              }
                              className="cursor-pointer"
                            >
                              Decline
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  {!isLoading && filteredApplicants.length === 0 && (
                    <div className="w-full text-center font">
                      No Applicants
                    </div>
                  )}
                  <div className="h-24"></div>
                </div>

                {/* Table view for larger screens */}
                <div className="hidden md:block">
                  <Table className="mt-3">
                    <TableHeader className="text-xs text-center h-6">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Programme</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading && (
                        <TableRow className="h-6">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <TableCell key={i}>
                              <Skeleton className="h-4 mt-2 w-full rounded-xl" />
                            </TableCell>
                          ))}
                        </TableRow>
                      )}

                      {!isLoading && filteredApplicants && filteredApplicants.map((application: any) => (
                        <TableRow key={application.id} className="text-xs h-8">
                          <TableCell className="font-medium">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {application.applicant.name}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{application.message}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>{application.applicant.email}</TableCell>
                          <TableCell className="text-indigo-400 p-2">
                            {application.applicant.contact_number}
                          </TableCell>
                          <TableCell>
                            {application.applicant.programme}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`p-2 px-2 rounded-full ${getStatusClass(
                                application.applicationStatus
                              )}`}
                            >
                              {application.applicationStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="w-full text-center cursor-pointer">
                                  <EllipsisIcon />
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                      className="cursor-pointer"
                                      href={`/recruit/dashboard/${application.id}`}
                                    >
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("hire", application.id)
                                    }
                                    className="cursor-pointer"
                                  >
                                    Hire
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("reject", application.id)
                                    }
                                    className="cursor-pointer"
                                  >
                                    Decline
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {!isLoading && filteredApplicants.length === 0 && (
                    <div className="w-full text-center font pt-12">No Applicants</div>
                  )}
                  <div className="h-24"></div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <Toaster />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  handleSoftDelete(deleteId);
                }
              }}
              className="bg-red-600 hover:bg-red-600"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}
