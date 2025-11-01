import Link from "next/link";
import { Building, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">R&R Realty</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Your trusted partner in finding the perfect property.
            </p>
             <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline text-muted-foreground">Home</Link></li>
              <li><Link href="/properties" className="hover:underline text-muted-foreground">Properties</Link></li>
              <li><Link href="/about" className="hover:underline text-muted-foreground">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline text-muted-foreground">Contact</Link></li>
              <li><Link href="/sell" className="hover:underline text-muted-foreground">Sell</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3 lg:col-span-3">
             <h3 className="font-semibold mb-4 text-primary">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>123 Main Street, Anytown, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <a href="tel:1234567890" className="hover:underline">(123) 456-7890</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <a href="mailto:contact@r-realty.com" className="hover:underline">contact@r-realty.com</a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <h3 className="font-semibold mb-4 text-primary">Newsletter</h3>
            <p className="text-sm mb-4 text-muted-foreground">Stay updated with our latest properties and news.</p>
            <form className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
              />
              <Button type="submit" variant="default">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} R&R Realty. All rights reserved. | <Link href="#" className="hover:underline">Privacy Policy</Link> | <Link href="#" className="hover:underline">Terms of Service</Link></p>
        </div>
      </div>
    </footer>
  );
}
