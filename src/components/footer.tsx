import Link from "next/link";
import { Building, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building className="h-8 w-8" />
              <span className="text-2xl font-bold">RR Realty Hub</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Your trusted partner in finding the perfect property. We simplify the real estate process with expertise and dedication.
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline text-primary-foreground/80">Home</Link></li>
              <li><Link href="/properties" className="hover:underline text-primary-foreground/80">Properties</Link></li>
              <li><Link href="/admin" className="hover:underline text-primary-foreground/80">About Us</Link></li>
              <li><Link href="/admin" className="hover:underline text-primary-foreground/80">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4 text-primary-foreground/80">Stay updated with our latest properties and news.</p>
            <form className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60" 
              />
              <Button type="submit" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Subscribe
              </Button>
            </form>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 hover:opacity-80 transition-opacity" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 hover:opacity-80 transition-opacity" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 hover:opacity-80 transition-opacity" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} RR Realty Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
