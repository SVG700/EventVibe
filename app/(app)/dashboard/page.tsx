'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
    const router = useRouter();
    const [role, setRole] = useState<string|null>(null);

    useEffect(() => {
        const userRole = sessionStorage.getItem('userRole');
        setRole(userRole);
    }, []);

    useEffect(() => {
        if(role) {
            if (role === 'organizer') {
                router.replace('/organizer/dashboard');
            } else {
                router.replace('/events');
            }
        }
    }, [role, router])

    return (
         <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
}
