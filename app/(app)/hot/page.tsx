import { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PostsList from "@/components/post/PostsList";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const metadata: Metadata = {
  title: "Hot Posts - Reddish",
  description: "Trending posts on Reddish",
};

function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white roundmkljknjked-lg shadow-sm border border-gray-200 p-4">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HotPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <main className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Hot Posts</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                New
              </Button>
              <Button variant="outline" size="sm">
                Top
              </Button>
              <Button variant="outline" size="sm">
                Rising
              </Button>
            </div>
          </div>
          
          <Suspense fallback={<PostListSkeleton />}>
            <PostsList sort="hot" />
          </Suspense>
        </main>
        
        <aside className="hidden md:block">
          <AppSidebar />
        </aside>
      </div>
    </div>
  );
} 