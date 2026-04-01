"use client";

import Link from "next/link";
import storeConfig from "@/config/store";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-100 bg-white md:hidden">
      <nav className="space-y-1 px-4 py-4">
        {storeConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 transition-colors hover:bg-light hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
