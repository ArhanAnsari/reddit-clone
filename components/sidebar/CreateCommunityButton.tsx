"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { createCommunity } from "@/actions/createCommunity";
import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";

function CreateCommunityButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    // Auto-generate slug from name
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 21);
  };

  const handleCreateCommunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Community name is required");
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("Community slug is required");
      return;
    }

    setErrorMessage("");

    startTransition(async () => {
      try {
        let imageBase64: string | null = null;
        let fileName: string | null = null;
        let fileType: string | null = null;

        if (imageFile) {
          const reader = new FileReader();
          imageBase64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(imageFile);
          });
          fileName = imageFile.name;
          fileType = imageFile.type;
        }

        const result = await createCommunity(
          name.trim(),
          imageBase64,
          fileName,
          fileType,
          slug.trim(),
          description.trim() || undefined
        );

        if ("error" in result && result.error) {
          setErrorMessage(result.error);
        } else if ("subreddit" in result && result.subreddit) {
          setOpen(false);
          resetForm();
          router.refresh();
        }
      } catch (err) {
        console.error("Failed to create community", err);
        setErrorMessage("Failed to create community");
      }
    });
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setErrorMessage("");
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        className="w-full p-2 pl-5 flex items-center rounded-md cursor-pointer bg-black text-white hover:bg-black transition-all duration-200 disabled:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!user}
      >
        <Plus className="w-4 h-4 mr-2" />
        {user ? "Create a Community" : "Sign in to create community"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
          <DialogDescription>
            Create a community/subreddit to share ideas and get feedback.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateCommunity} className="space-y-4 mt-2">
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Community Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="My Community"
              className="w-full focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={handleNameChange}
              required
              minLength={3}
              maxLength={21}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Community Slug (URL)
            </label>
            <Input
              id="slug"
              name="slug"
              placeholder="my-community"
              className="w-full focus:ring-2 focus:ring-blue-500"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              minLength={3}
              maxLength={21}
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
            <p className="text-xs text-gray-500">
              This will be used in the URL: reddish.com/community/
              {slug || "community-slug"}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="What is this community about?"
              className="w-full focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Community Image (optional)
            </label>

            {imagePreview ? (
              <div className="relative w-24 h-24 mx-auto">
                <Image
                  src={imagePreview}
                  alt="Community preview"
                  fill
                  className="object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="community-image"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      Click to upload an image
                    </p>
                  </div>
                  <input
                    id="community-image"
                    name="community-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending || !user}
          >
            {isPending
              ? "Creating..."
              : user
                ? "Create Community"
                : "Sign in to create community"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommunityButton;
