import {
  Globe,
  Clock,
  Download,
  Search,
  Languages,
  Shield,
} from "lucide-react";
import { UrlInput } from "~/components/url-input";

const features = [
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Extract transcripts in any available language. Switch between languages instantly.",
  },
  {
    icon: Clock,
    title: "Word-Level Timestamps",
    description:
      "Get precise timestamps for every segment. Navigate through the transcript with ease.",
  },
  {
    icon: Download,
    title: "Export Formats",
    description:
      "Export transcripts to TXT, PDF, or JSON. Choose the format that works best for you.",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description:
      "Search through transcripts with highlighted matches and keyboard navigation.",
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
      "Run it on your own infrastructure. Your data stays with you. No third-party tracking.",
  },
];

const steps = [
  {
    step: "1",
    title: "Paste URL",
    description: "Paste any YouTube video URL into the input field above.",
  },
  {
    step: "2",
    title: "Extract",
    description:
      "We fetch the transcript with timestamps and all available languages.",
  },
  {
    step: "3",
    title: "Export",
    description:
      "Copy, search, or export the transcript in TXT, PDF, or JSON format.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 pb-16 pt-20 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          YouTube Transcript Extractor
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Extract transcripts from any YouTube video. Multi-language support,
          timestamps, and export to TXT, PDF, JSON.
        </p>
        <div className="w-full max-w-xl pt-4">
          <UrlInput />
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold">
            Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <feature.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1.5 font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-semibold">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-1.5 font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Callout */}
      <section className="border-t bg-muted/40 px-4 py-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-2 text-xl font-semibold">Open Source</h2>
          <p className="text-sm text-muted-foreground">
            100% open source. Self-host with Docker Compose. No accounts
            required, no data collection, no limits.
          </p>
        </div>
      </section>
    </div>
  );
}
