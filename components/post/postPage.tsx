"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostDetail from "@/components/post/postDetail";
import PostCard from "../cards/jobcard";
import { Internship } from "@prisma/client";
import { usePost } from "@/utils/state";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
interface PostProps {
  data: Internship[];
  isloading: boolean;
}

export function PostList({ data, isloading }: PostProps) {
  const [post, setPost] = usePost();

  useEffect(() => {
    console.log(post, data);
    if (!isloading && (!post.selected || post.selected === "") && Array.isArray(data) && data.length > 0) {
      setPost({ selected: data && data[0]?.id });
    }
  }, [data, isloading, post, setPost]);

  const selectedPost =
    !isloading && Array.isArray(data) && data.length > 0
      ? data.find((item) => item.id === post.selected)
      : null;

  return (
    <>
      <div className="flex mt-5 justify-center min-h-screen">
        <ScrollArea className="h-full max-w-96 mx-7 sm:max-md:min-w-96">
          <div className="flex flex-col gap-4 p-0 xs:px-4 pt-0">
            {isloading ? (
              // While loading, display skeleton placeholders
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex flex-col w-80 space-y-3 mb-4 mx-auto border-neutral-300 bg-white">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                </div>
              ))
            ) : (
              // When not loading, if data exists, map over it; otherwise display a message
              Array.isArray(data) && data.length > 0 ? (
                data.map((item) => <PostCard key={item.id} item={item} />)
              ) : (
                <div className="flex flex-col gap-4 p-0 xs:p-2 pt-0 xs:flex-start">No Openings Posted</div>
              )
            )}
          </div>
        </ScrollArea>
        <div className="flex-1">
          {isloading ? (
            // While loading, show a skeleton for the post details area
            <div className="border-neutral-300 w-[50vw] rounded-sm h-[85vh] hidden border md:flex flex-col sticky top-0">
              <div className=" p-4 w-full bg-white sticky">
                <div className="h-36">
                  <Skeleton className="h-[80%] w-full rounded-xl" />
                  <Skeleton className="h-[10%] mt-2 w-full rounded-xl" />
                  <Skeleton className="h-[10%] mt-2 w-[80%] rounded-xl" />
                </div>
              </div>
              <div className="h-96 p-3">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            </div>
          ) : selectedPost ? (
            // When a post is selected, show its details
            <PostDetail post={selectedPost} />
          ) : (
            // Fallback if no post details available
            <div className="hidden sm:flex items-center justify-center px-4 mt-2">
              <span className="text-muted-foreground">No details available for this post.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
