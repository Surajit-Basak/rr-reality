

import { ContactFormPage } from "@/components/contact-form-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sell Your Home',
    description: 'Let our experts provide you with a free home valuation and a strategic plan to sell your property for the best price.',
};

export default function SellPage() {
    return <ContactFormPage isSellPage={true} />;
}
