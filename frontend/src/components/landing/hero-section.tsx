"use client";

import { Globe, Clock, FileText } from "lucide-react";
import { UrlInput } from "~/components/url-input";

const trustIndicators = [
  { icon: Globe, text: "100+ Languages" },
  { icon: Clock, text: "Timestamps Included" },
  { icon: FileText, text: "TXT, PDF, JSON Export" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh] overflow-hidden bg-white pt-24 dark:bg-black"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-white to-white dark:from-red-950/20 dark:via-black dark:to-black" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Free & Open Source
          </div>

          {/* Main Heading */}
          <h1
            className="animate-fade-up mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl"
            style={{ "--stagger": "0.1s" } as React.CSSProperties}
          >
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
              YouTube Transcript
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Extractor
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-up mb-10 text-lg text-gray-600 md:text-xl dark:text-gray-300"
            style={{ "--stagger": "0.2s" } as React.CSSProperties}
          >
            Extract transcripts from any YouTube video. Multi-language support,
            word-level timestamps, and export to TXT, PDF, or JSON.
          </p>

          {/* URL Input */}
          <div
            className="animate-fade-up mx-auto mb-8 max-w-2xl"
            style={{ "--stagger": "0.3s" } as React.CSSProperties}
          >
            <UrlInput />
          </div>

          {/* Trust Indicators */}
          <div
            className="animate-fade-up flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
            style={{ "--stagger": "0.4s" } as React.CSSProperties}
          >
            {trustIndicators.map((indicator, i) => (
              <div key={i} className="flex items-center gap-2">
                <indicator.icon className="h-4 w-4 text-red-500" />
                <span>{indicator.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in mt-14 grid grid-cols-3 gap-8 border-t border-gray-200 pt-10 dark:border-gray-800"
            style={{ "--stagger": "0.6s" } as React.CSSProperties}
          >
            {[
              { value: "100+", label: "Languages Supported" },
              { value: "3", label: "Export Formats" },
              { value: "0", label: "Cost - Always Free" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-red-500 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900" />
    </section>
  );
}
