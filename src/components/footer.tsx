import Link from "next/link";
import { Building, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building className="h-8 w-8" />
              <span className="text-2xl font-bold">R&R Realty</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 mb-6">
              Your trusted partner in finding the perfect property. We simplify the real estate process with expertise and dedication.
            </p>
             <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 hover:opacity-80 transition-opacity" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 hover:opacity-80 transition-opacity" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 hover:opacity-80 transition-opacity" /></Link>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline text-primary-foreground/80">Home</Link></li>
              <li><Link href="/properties" className="hover:underline text-primary-foreground/80">Properties</Link></li>
              <li><Link href="/about" className="hover:underline text-primary-foreground/80">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline text-primary-foreground/80">Contact</Link></li>
              <li><Link href="/sell" className="hover:underline text-primary-foreground/80">Sell</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3 lg:col-span-3">
             <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>123 Main Street, Anytown, USA 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <a href="tel:1234567890" className="hover:underline">(123) 456-7890</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <a href="mailto:contact@r-realty.com" className="hover:underline">contact@r-realty.com</a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3 lg:col-span-4">
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
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} R&R Realty. All rights reserved. | <Link href="#" className="hover:underline">Privacy Policy</Link> | <Link href="#" className="hover:underline">Terms of Service</Link></p>
        </div>
      </div>
    </footer>
  );
}
