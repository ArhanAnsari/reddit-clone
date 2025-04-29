"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from '@/components/header/Header';
import Image from 'next/image';
import ReddishLogo from '@/images/Reddish Full.png';

export default function GlobalError({ error }: Readonly<{ error: Error & { digest?: string } }>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image
              src={ReddishLogo}
              alt="Reddish Logo"
              width={200}
              height={50}
              className="mb-4"
            />
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-reddit-orange">Oops!</h1>
              <h2 className="text-2xl font-semibold text-gray-900">Something went wrong</h2>
              <p className="text-gray-500 max-w-md">
                We've encountered an unexpected error. Our team has been notified and we're working to fix it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">Browse Communities</Link>
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md text-left w-full max-w-md">
                <p className="text-sm font-mono text-gray-600">
                  Error: {error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}