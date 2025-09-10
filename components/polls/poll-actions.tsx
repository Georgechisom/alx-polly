"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Share2, BarChart3, QrCode } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import QRCode from "qrcode";

interface PollActionsProps {
  pollId: string;
}

export function PollActions({ pollId }: PollActionsProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShare = async () => {
    const pollUrl = `${window.location.origin}/vote/${pollId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Poll", url: pollUrl });
        toast.success("Poll shared successfully!");
      } catch (error) {
        // Treat user cancellation as a no-op
        if ((error as DOMException)?.name === "AbortError") return;
        toast.error("Failed to share poll");
      }
    } else {
      try {
        await navigator.clipboard.writeText(pollUrl);
        toast.success("Poll link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleQRCode = () => {
    const pollUrl = `${window.location.origin}/vote/${pollId}`;
    QRCode.toDataURL(pollUrl)
      .then((url) => {
        setQrCodeUrl(url);
        setIsDialogOpen(true);
      })
      .catch(() => {
        toast.error("Failed to generate QR code");
      });
  };

  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link href={`/polls/${pollId}/edit`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </Button>

      <Button asChild variant="outline">
        <Link href={`/polls/${pollId}/results`}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Results
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleQRCode}>
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
