/* eslint-disable react/no-unescaped-entities */

import { Label } from "@/siws-app/components/ui/label"
import { Input } from "@/siws-app/components/ui/input"
import { Button } from "@/siws-app/components/ui/button"
import { Textarea } from "@/siws-app/components/ui/text-area"

export default function ContactView() {
  return (
    <div className="w-full py-12">
      <div className="container grid max-w-2xl px-4 gap-10 sm:gap-20">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/none">Contact Us</h1>
            <p className="text-gray-500 dark:text-gray-400">We'll get back to you as soon as possible.</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Enter your last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea className="min-h-[100px]" id="message" placeholder="Enter your message" />
            </div>
            <Button>Send message</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

