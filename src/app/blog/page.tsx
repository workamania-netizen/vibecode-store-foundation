import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import storeConfig from "@/config/store";
import { getAllPosts } from "@/lib/blog";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Blog",
  description: `Honey tips, recipes, and beekeeping stories from ${storeConfig.name}.`,
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="From the Hive"
          subtitle="Honey tips, recipes, and stories from our apiary."
        />

        {posts.length === 0 && (
          <p className="mt-12 text-center text-gray-500">
            No blog posts yet. Check back soon!
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {post.image && (
                <div className="relative aspect-[16/9] overflow-hidden bg-light">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <time className="text-sm text-gray-400">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-2 text-xl font-bold text-dark group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
                {post.author && (
                  <p className="mt-4 text-xs text-gray-400">
                    By {post.author}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
