import { ChevronRight, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

// Shared Layout Component
export const LegalLayout = ({ children, title, lastUpdated }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="mx-auto max-w-4xl">
      <nav className="flex items-center p-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-gray-900">{title}</span>
      </nav>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mb-8 text-sm text-gray-500">
          Last updated: {lastUpdated}
        </p>
        {children}
      </div>

      <footer className="mt-8 p-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Rudy. All rights reserved.
      </footer>
    </div>
  </div>
);

// Section Component
export const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
    {children}
  </section>
);

// List Component
export const List = ({ children }) => (
  <ul className="ml-6 space-y-3 text-gray-600">{children}</ul>
);

// Privacy Policy Page
export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={new Date().toLocaleDateString()}
    >
      <Section title="Introduction">
        <p className="text-gray-600">
          Welcome to Rudy. We respect your privacy and are committed to
          protecting your personal data.
        </p>
      </Section>

      <Section title="Information We Collect">
        <List>
          <li className="flex gap-2">
            <span className="font-medium">Account Information:</span>
            <span>
              When you sign up using Google authentication, we receive your
              email address and name.
            </span>
          </li>
          <li className="flex gap-16">
            <span className="font-medium">Usage Data:</span>
            <span>We collect data about your habits you track in the app.</span>
          </li>
          <li className="flex gap-20">
            <span className="font-medium">Feedback:</span>
            <span>Any feedback or ratings you provide about the app.</span>
          </li>
        </List>
      </Section>

      {/* Additional sections... */}

      <Section title="Contact">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-5 w-5" />
          <span>For privacy-related questions, please contact us at </span>
          <Link
            href="mailto:tranquilblue91@gmail.com"
            className="text-blue-600 hover:text-blue-700"
          >
            tranquilblue91@gmail.com
          </Link>
        </div>
      </Section>
    </LegalLayout>
  );
}
