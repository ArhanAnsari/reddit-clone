"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import ReddishLogo from "@/images/Reddish Full.png";
import ReddishLogoOnly from "@/images/Reddish Logo Only.png";
import CreatePost from "./CreatePostButton";

function Header() {
  const { toggleSidebar, open, isMobile } = useSidebar();
  const { user } = useUser();

  const isBanned = user?.unsafeMetadata["IS_BANNED"] as boolean;

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Left side */}
      <div className="h-10 flex items-center">
        {open && !isMobile ? (
          <ChevronLeftIcon className="w-6 h-6" onClick={toggleSidebar} />
        ) : (
          <div className="flex items-center space-x-2">
            <MenuIcon className="w-6 h-6" onClick={toggleSidebar} />
            <Image
              src={ReddishLogo}
              alt="logo"
              width={150}
              height={150}
              className="hidden md:block"
            />
            <Image
              src={ReddishLogoOnly}
              alt="logo"
              width={40}
              height={40}
              className="block md:hidden"
            />
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        <CreatePost />

        {isBanned && (
          <div className="flex items-center space-x-2">
            <p className="text-red-500">You are banned from posting.</p>
          </div>
        )}

        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button asChild variant="outline">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
