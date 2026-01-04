export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Event Vibe",
  description: "An intelligent platform to help groups find the perfect events and activities based on shared interests, location, and convenience.",
  mainNav: [
    {
      title: "Explore",
      href: "/events",
      role: "participant",
    },
    {
      title: "Organize",
      href: "/organizer/dashboard",
      role: "organizer",
    },
    {
      title: "Features",
      href: "/features",
    },
    {
      title: "Demo",
      href: "/demo",
    },
    {
      title: "Contact",
      href: "/contact",
    }
  ],
  homeNav: [
    {
      title: "Features",
      href: "#features",
    },
    {
      title: "How It Works",
      href: "#how-it-works",
    },
    {
        title: "Demo",
        href: "#demo",
    },
  ]
};
