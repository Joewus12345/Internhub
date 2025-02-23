"use client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import { capitalizeFirstLetter } from "@/utils/util";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: { slug: string } }) {
  const {
    data: internshipData,
    isLoading,
    error,
  } = useSWR(`/api/internships`, async (url) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: `${params.slug}` }),
    });
    return response.json();
  });

  if (error) {
    return toast.error("Error: Unable to load internship details")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        {/* top nav */}
        <Link
          href={"/recruit/dashboard"}
          className="w-full h-14 bg-purple-500 sticky top-0 flex items-center text-white px-12 cursor-pointer"
        >
          <img src="/logo.svg" alt="logo" />
          Internhub
        </Link>

        {/* Skeleton for the main content */}
        <div className="md:w-1/2 px-4 md:px-0 mt-4">
          <div className="bg-white rounded-lg py-6 px-4">
            {/* Title */}
            <Skeleton className="h-6 w-3/4 mb-4" />
            {/* Company Name + rating */}
            <Skeleton className="h-5 w-1/2 mb-4" />

            {/* Duration */}
            <Skeleton className="h-4 w-[60%] mb-2" />
            <Skeleton className="h-4 w-[50%] mb-4" />

            {/* Programmes */}
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />

            {/* Requirements */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-[80%] mb-2" />

            {/* Description */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-[80%] mb-2" />
          </div>
        </div>
      </div>
    );
  }

  // Parse and format the dates
  const formattedStartDate = internshipData?.start_date
    ? format(parseISO(internshipData.start_date), "MMM d, yyyy")
    : "Not specified";
  const formattedEndDate = internshipData?.end_date
    ? format(parseISO(internshipData.end_date), "MMM d, yyyy")
    : "Not specified";

  const parsedProgramme = internshipData?.programme
    ? JSON.parse(internshipData.programme)
    : [];

  return (
    <div className="flex justify-center items-center flex-col">
      <Link
        href={"/recruit/dashboard"}
        className="w-full h-14 bg-purple-500 sticky top-0 flex items-center text-white px-12 cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="logo" />
        Internhub
      </Link>
      <div className="md:w-1/2 px-4 md:px-0">
        {internshipData && (
          <>
            <div className="bg-white rounded-lg py-10">
              <div className="flex items-baseline">
                <div className="text-gray-600 text-lg font-semibold mr-auto">
                  {internshipData.title}
                </div>
                <div className="text-gray-500 text-xs font-medium tracking-wide">
                  {internshipData.representative?.company?.name}
                </div>
                <div className="ml-2 text-yellow-400 text-xs font-semibold">
                  ★
                </div>
              </div>
              <div className="text-gray-600 text-lg font-semibold mr-auto">
                Duration: {internshipData.duration}
              </div>
              <div className="text-gray-600 text-lg font-semibold mr-auto">
                <span>from: {formattedStartDate}</span>{" "}
                <span>to: {formattedEndDate}</span>
              </div>
              <h3 className="py-2 text-neutral-500 font-semibold text-xl">
                Preferred programmes
              </h3>
              <div className="text-sm text-gray-700 flex gap-3 flex-wrap">
                {parsedProgramme &&
                  parsedProgramme.map(
                    (
                      programme: { label: string; value: string },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border rounded-full px-2 bg-purple-200 py-1 text-xs text-center"
                      >
                        {programme.value}
                      </div>
                    )
                  )}
              </div>
              <h3 className="py-2 text-neutral-500 text-xl font-semibold ">
                Requirements
              </h3>
              <div
                className="rendered-content text-neutral-500"
                dangerouslySetInnerHTML={{
                  __html: `${internshipData.requirements}`,
                }}
              />
              <h3 className="py-2 text-neutral-500 text-xl font-semibold">
                Full Description
              </h3>
              <div
                className="rendered-content text-sm text-neutral-500"
                dangerouslySetInnerHTML={{
                  __html: `${internshipData.description}`,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
