import React from "react";
import Link from "next/link";

interface AuthPageRedirectLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function AuthPageRedirectLink({
  href,
  children,
}: AuthPageRedirectLinkProps) {
  return (
    <Link
      href={href}
      className="mt-3 block text-center text-sm text-gray-600 underline underline-offset-3"
    >
      {children}
    </Link>
  );
}
