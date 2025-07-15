
"use client";

import { Button } from "./ui/button";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.75 13.96c.25.13.41.34.41.58v1.1c0 .21-.07.4-.19.56a.93.93 0 0 1-.58.26c-.22.03-.46.03-.7.03-.82 0-1.6-.16-2.32-.47-1.42-.6-2.6-1.53-3.56-2.73-1.12-1.37-1.63-2.93-1.63-4.59 0-2.34 1.12-4.28 2.94-5.26a.54.54 0 0 1 .48-.02c.21.07.36.23.44.44l.62 1.83c.08.24.03.5-.13.68L12 7.5a.69.69 0 0 0-.15.78c.15.33.41.67.74 1.02s.67.57 1 .7c.21.08.47.03.65-.13l1.4-1.28c.18-.16.44-.21.68-.13l1.83.62c.2.08.37.23.44.44a.54.54 0 0 1-.02.48l-.42.96c-.1.25-.26.43-.48.54Z M12 2a10 10 0 0 0-8.6 14.94l-1.32 4.88a.5.5 0 0 0 .63.63l4.88-1.32A10 10 0 1 0 12 2Z"/>
    </svg>
);


export function WhatsAppFAB() {
    const phoneNumber = "212628889950";
    const url = `https://wa.me/${phoneNumber}`;

    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fixed bottom-6 right-6 z-50"
            aria-label="Contact us on WhatsApp"
        >
            <Button size="icon" className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg">
                <WhatsAppIcon className="w-8 h-8" />
            </Button>
        </a>
    )
}
