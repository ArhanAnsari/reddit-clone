import { searchSubreddits } from "@/sanity/lib/subreddit/searchSubreddits";
import { urlFor } from "@/sanity/lib/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const subreddits = await searchSubreddits(query);

  return (
    <>
      {/* Banner */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-sm text-gray-600">
                Communities matching &quot;{query}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex flex-col gap-4">
            {subreddits.map((subreddit) => (
              <li
                key={subreddit._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
              >
                <Link
                  href={`/community/${subreddit.slug}`}
                  className="flex items-center cursor-pointer gap-4 py-5 px-4 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                >
                  <Avatar className="h-12 w-12 border-2 border-red-200 dark:border-red-800 shadow-sm">
                    {subreddit.image && (
                      <AvatarImage src={urlFor(subreddit.image).url()} />
                    )}
                    <AvatarFallback className="text-lg font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                      {subreddit.title?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{subreddit.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {subreddit.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            {subreddits.length === 0 && (
              <li className="py-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg">
                No communities found matching your search.
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}

export default SearchResults;
