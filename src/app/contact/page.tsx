
import { ContactFormPage } from "@/components/contact-form-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Contact R&R Realty for all your real estate needs in the Twin Cities. Our expert team is ready to help you buy or sell your home.',
};

export default function ContactPage() {
    return <ContactFormPage />;
}
