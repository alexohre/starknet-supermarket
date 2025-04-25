import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="relative w-64 h-64 mb-6">
          <Image 
            src="/404.jpg" 
            alt="404 Error" 
            fill 
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
         This page must have been moved or the page doesn&apos;t exist.
        </p>
        <Link href="/" passHref>
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}
