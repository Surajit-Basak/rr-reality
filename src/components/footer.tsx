import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">R&R Realty</div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for single-family home buying and selling in the Twin Cities area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="ri-facebook-fill text-lg"></i></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="ri-instagram-line text-lg"></i></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="ri-linkedin-fill text-lg"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">Buy Properties</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Sell Your Home</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">Featured Properties</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4 text-sm">Stay updated with market trends and new listings</p>
            <form className="space-y-3">
              <Input type="email" placeholder="Enter your email" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
              <Button type="submit" className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap text-sm h-auto">
                Subscribe
              </Button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <i className="ri-map-pin-line mr-3"></i>
                <span>123 Main Street<br />Minneapolis, MN 55401</span>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line mr-3"></i>
                <span>(612) 555-0123</span>
              </div>
              <div className="flex items-center">
                <i className="ri-mail-line mr-3"></i>
                <span>info@rrrealty.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} R&R Realty. All rights reserved. Licensed Real Estate Broker.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
