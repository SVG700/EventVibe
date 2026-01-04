import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-6 md:px-8 md:py-8 border-t bg-white dark:bg-gray-900">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
