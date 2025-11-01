import { properties } from "@/lib/mock-data";
import { PropertiesClientPage } from "./properties-client-page";

// SEO metadata for the properties page
export const metadata = {
  title: 'All Properties',
  description: 'Search and browse all available properties for sale and for rent.',
};

export default async function PropertiesPage() {
  // In a real app, you would fetch properties from a database.
  // We are using mock data here.
  const allProperties = properties;

  return <PropertiesClientPage allProperties={allProperties} />;
}
