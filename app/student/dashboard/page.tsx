"use client"
import Navbar from "@/components/header/navbar"
import { PostList } from "@/components/post/postPage"
import ScrollToTop from "@/components/ScrollToTop";
import { CommandModal } from "@/components/modals/commandmodal";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";


export default function Page() {
  const { data, error, isLoading } = useSWR("/api/internships", async (url) => {
    const response = await fetch(url);
    return response.json();
  })

  if (error) {
    return toast.error("Error loading page. Refresh page to try again.")
  }

  return (
    <div>
      <Navbar />
      <div className="md:w-[90%] md:mx-auto">
        <PostList data={data} isloading={isLoading} />

        <ScrollToTop />
      </div>
      <footer className="container">
        <div className="max-w-screen-xl px-4 pt-4 sm:pt-16 pb-16 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <Link href="/" className="mb-0 inline-block">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  className="w-full dark:hidden"
                  width={30}
                  height={30}
                />
                <Image
                  src="/logo.svg"
                  alt="logo"
                  className="hidden w-full dark:block"
                  width={30}
                  height={30}
                />
              </Link>
              <p className="max-w-xs mt-4 text-sm text-gray-600">
                Internhub connects students with curated internship opportunities for real-world experience.
                Seamlessly explore, apply, and launch your career—all in one place
              </p>
              <div className="flex mt-8 space-x-6 text-gray-600">
                <a className="hover:opacity-75" href="#" target="_blank" rel="noreferrer">
                  <span className="sr-only"> Facebook </span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                {/* Include other social media links */}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-medium">
                  Company
                </p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <a className="hover:opacity-75" href="#"> About </a>
                  <a className="hover:opacity-75" href="#"> Meet the Team </a>
                  <a className="hover:opacity-75" href="#"> History </a>
                  <a className="hover:opacity-75" href="#"> Careers </a>
                </nav>
              </div>
              <div>
                <p className="font-medium">
                  Services
                </p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <a className="hover:opacity-75" href="#"> 1on1 Coaching </a>
                  <a className="hover:opacity-75" href="#"> Company Review </a>
                  <a className="hover:opacity-75" href="#"> Accounts Review </a>
                  <a className="hover:opacity-75" href="#"> HR Consulting </a>
                  <a className="hover:opacity-75" href="#"> SEO Optimisation </a>
                </nav>
              </div>
              <div>
                <p className="font-medium">
                  Helpful Links
                </p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <a className="hover:opacity-75" href="#"> Contact </a>
                  <a className="hover:opacity-75" href="#"> FAQs </a>
                  <a className="hover:opacity-75" href="#"> Live Chat </a>
                </nav>
              </div>
              <div>
                <p className="font-medium">
                  Legal
                </p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <a className="hover:opacity-75" href="#"> Privacy Policy </a>
                  <a className="hover:opacity-75" href="#"> Terms &amp; Conditions </a>
                  <a className="hover:opacity-75" href="#"> Returns Policy </a>
                  <a className="hover:opacity-75" href="#"> Accessibility </a>
                </nav>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-800">
            © 2024 Company Name
          </p>
        </div>
      </footer>
      <CommandModal data={data} />
      <Toaster />
    </div>
  )
}


