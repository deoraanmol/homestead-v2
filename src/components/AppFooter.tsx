"use client";

import Link from "next/link";
import { Home, Mail, Phone, MapPin, ExternalLink, ArrowRight } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Chandigarh Properties", href: "/buy?city=Chandigarh" },
    { label: "Mohali Listings", href: "/buy?city=Mohali" },
    { label: "Panchkula Spaces", href: "/buy?city=Panchkula" },
    { label: "Zirakpur Hubs", href: "/buy?city=Zirakpur" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "RERA Disclaimer", href: "/rera-info" },
  ];

  return (
    <footer className="w-full select-none border-t border-slate-200">
      
      {/* 10% Emerald Accent Bar: Strategic conversion strip */}
      <div className="w-full bg-emerald-800 text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold">Ready to list your space?</h4>
            <p className="text-xs text-emerald-100/80 mt-0.5">Join the premium verified network in the Tricity region.</p>
          </div>
          <Link 
            href="/dealers" 
            className="text-xs font-bold bg-white text-emerald-950 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition flex items-center gap-1 shrink-0"
          >
            Post Property <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 30% Neutral Core: Using a distinct warm warm-neutral to prevent body blending */}
      <div className="w-full bg-[#fbfbf9] text-slate-600">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-slate-200">
            
            {/* Column 1: Brand Identifier */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md shadow-emerald-700/20">
                  <Home className="h-4 w-4" />
                </div>
                <span className="text-md font-bold tracking-tight text-slate-900">Homestead</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Your premium neighborhood real estate network across the Chandigarh Tricity region. Connecting buyers, sellers, and verified dealers directly.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                Explore Tricity
              </h4>
              <ul className="space-y-2.5 text-xs">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="hover:text-emerald-700 transition-colors duration-150 flex items-center gap-1 group text-slate-600 font-medium"
                    >
                      {link.label}
                      <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Channels */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                Get in Touch
              </h4>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <a href="tel:+911720000000" className="hover:text-slate-900 transition-colors">
                    +91 172 400 0000
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <a href="mailto:hello@homestead.com" className="hover:text-slate-900 transition-colors">
                    hello@homestead.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-500">
                    Sector 17, Chandigarh,<br />UT 160017, India
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust Card Banner (60% White Card pop contrast over the sand base) */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 text-left shadow-sm">
              <span className="inline-block text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mb-2">
                Verified Platform
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Every single plot, flat, and commercial listing on Homestead goes through strict localized backend verification routines to rule out spam brokers.
              </p>
            </div>

          </div>

          {/* Sub-Footer Meta Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p className="text-slate-400 font-medium">
              &copy; {currentYear} Homestead Networks. All rights reserved.
            </p>
            
            <div className="flex gap-x-6 text-slate-400 font-medium">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-slate-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}