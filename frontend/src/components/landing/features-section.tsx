"use client";

import {
  Download,
  Globe,
  Languages,
  Clock,
  Search,
  Shield,
} from "lucide-react";
import { useIntersectionObserver } from "~/hooks/use-intersection-observer";

const features = [
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Automatically detects and extracts transcripts in 100+ languages. Manual and auto-generated captions supported.",
  },
  {
    icon: Clock,
    title: "Word-Level Timestamps",
    description:
      "Get precise timestamps for every segment. Navigate through the transcript synced to video playback.",
  },
  {
    icon: Download,
    title: "Export Formats",
    description:
      "Download transcripts as TXT, PDF, or JSON. Choose the format that fits your workflow.",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description:
      "Search through transcripts with highlighted matches and keyboard navigation (Ctrl+F).",
  },
  {
    icon: Languages,
    title: "Instant Language Switching",
    description:
      "Switch transcript language on the fly without re-fetching. All languages cached locally.",
  },
  {
    icon: Shield,
    title: "Self-Hosted & Private",
    description:
      "Run on your own infrastructure with Docker. No accounts, no tracking, no data collection.",
  },
];

export function FeaturesSection() {
  const { ref, isInView } = useIntersectionObserver({ margin: "-100px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative bg-gray-50 py-20 dark:bg-gray-900"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="container mx-auto px-6">
        <div className={`reveal ${isInView ? "in-view" : ""}`}>
          <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            Everything You{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Need
            </span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-400">
            A complete toolkit for extracting, searching, and exporting YouTube
            transcripts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`reveal group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-gray-800 ${isInView ? "in-view" : ""}`}
              style={
                { "--stagger": `${index * 0.1}s` } as React.CSSProperties
              }
            >
              <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white dark:bg-red-950/50">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </section>
  );
}
