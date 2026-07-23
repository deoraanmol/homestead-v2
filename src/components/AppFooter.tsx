"use client";

import Link from "next/link";
import { Home, Mail, Phone } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Chandigarh Properties", href: "/buy?listingCity=Chandigarh" },
    { label: "Mohali Listings", href: "/buy?listingCity=Mohali" },
    { label: "Panchkula Spaces", href: "/buy?listingCity=Panchkula" },
    { label: "Zirakpur Hubs", href: "/buy?listingCity=Zirakpur" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "RERA Punjab", href: "http://rera.punjab.gov.in/" },
    { label: "RERA Haryana", href: "https://haryanarera.gov.in/" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
                <Home className="h-4 w-4" />
              </div>

              <span className="text-base font-bold text-slate-900">
                Homestead
              </span>
            </div>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Discover verified residential and commercial properties across
              Chandigarh Tricity.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              Explore
            </h4>

            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              Contact
            </h4>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-4 w-4 text-emerald-700" />
                <a
                  href="tel:+91 98788 64275"
                  className="transition-colors hover:text-slate-900"
                >
                  +91 98788 64275
                </a>
              </li>

              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4 text-emerald-700" />
                <a
                  href="mailto:hello@homestead.com"
                  className="transition-colors hover:text-slate-900"
                >
                  hello@homestead.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-sm text-slate-400">
            © {currentYear} Homestead. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-slate-600"
                target={link.href.startsWith("http") ? "_blank" : "_self"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}