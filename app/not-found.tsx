import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ReddishLogo from '@/images/Reddish Full.png';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-6xl font-bold text-reddit-orange">404</h1>
              <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
              <p className="text-gray-500 max-w-md">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
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
          </div>
        </div>
      </div>
    </div>
  );
} 