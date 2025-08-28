'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit, Share2, BarChart3, QrCode } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PollActionsProps {
  pollId: string
}

export function PollActions({ pollId }: PollActionsProps) {
  const handleShare = () => {
    // TODO: Implement share functionality
    const pollUrl = `${window.location.origin}/vote/${pollId}`
    navigator.clipboard.writeText(pollUrl)
    // Show toast notification
  }

  const handleQRCode = () => {
    // TODO: Implement QR code generation
    console.log('Generate QR code for poll:', pollId)
  }

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
    </div>
  )
}
