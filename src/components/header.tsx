import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">R&R Realty</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
           <Button asChild className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
              <span className="font-bold text-primary text-xl">R&R Realty</span>
            </Link>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
                  <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
