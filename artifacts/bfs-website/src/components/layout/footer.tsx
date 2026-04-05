import { Link } from "wouter";
import { SiInstagram, SiX } from "react-icons/si";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 font-sans text-white">Business & Finance Society</h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Cotton University's premier student platform for financial literacy, entrepreneurship, and business acumen.
            </p>
            <div className="text-accent text-sm font-bold tracking-wider uppercase">
              Established 2021
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-gray-300 hover:text-accent transition-colors">Events & Visits</Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-gray-300 hover:text-accent transition-colors">Our Team</Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-300 hover:text-accent transition-colors">Insights Blog</Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-gray-300 hover:text-accent transition-colors">Resources</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>businessandfinance.society@gmail.com</li>
              <li className="leading-relaxed">
                Cotton University,<br />
                Panbazar, Guwahati,<br />
                Assam – 781001
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all">
                <SiInstagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all">
                <SiX size={18} />
              </a>
            </div>
            <div className="mt-8">
              <p className="text-xs text-gray-400 mb-2">Ready to shape the future?</p>
              <Link href="/join">
                <span className="inline-block border border-accent text-accent hover:bg-accent hover:text-primary px-4 py-2 rounded text-sm font-bold transition-all cursor-pointer">
                  Apply for Membership
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Business & Finance Society, Cotton University. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            NURTURING FUTURE BUSINESS LEADERS
          </p>
        </div>
      </div>
    </footer>
  );
}