'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface EditPollFormProps {
  pollId: string
}

export function EditPollForm({ pollId }: EditPollFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // TODO: Implement edit poll form logic
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Poll Title</label>
          <Input placeholder="Enter poll title" />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea placeholder="Enter poll description" />
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  )
}
