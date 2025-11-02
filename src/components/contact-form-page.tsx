
'use client';

import { useState } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactFormPage({ isSellPage = false }: { isSellPage?: boolean }) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const [formState, setFormState] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: isSellPage ? "I'm interested in selling my home. Please provide me with a market analysis." : ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firestore && formState.name && formState.email && formState.message) {
      const inquiriesCollection = collection(firestore, 'inquiries');
      addDocumentNonBlocking(inquiriesCollection, {
        ...formState,
        propertyId: isSellPage ? "selling_inquiry" : "general_inquiry",
        inquiryDate: serverTimestamp()
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for your message! We will contact you soon.",
      });
      setFormState({ name: '', email: '', phone: '', message: '' });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "Please fill in all required fields.",
      });
    }
  };
  
  const pageTitle = isSellPage ? "Sell Your Home with Confidence" : "Get In Touch";
  const pageDescription = isSellPage 
    ? "Let our experts provide you with a free home valuation and a strategic plan to sell your property for the best price."
    : "Have questions or ready to start your real estate journey? Contact our team today for a free, no-obligation consultation.";


  return (
    <div className="bg-gray-50">
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">{pageTitle}</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{pageDescription}</p>
                </div>
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h2>
                        <form className="space-y-6" onSubmit={handleContactSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" value={formState.name} onChange={handleInputChange} placeholder="Enter your full name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number (Optional)</Label>
                                <Input id="phone" name="phone" type="tel" value={formState.phone} onChange={handleInputChange} placeholder="(123) 456-7890" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" name="message" value={formState.message} onChange={handleInputChange} rows={6} placeholder="Tell us about your real estate needs..." required />
                            </div>
                            <Button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto text-base">
                                {isSellPage ? "Request Valuation" : "Send Message"}
                            </Button>
                        </form>
                    </div>
                    {/* Contact Info Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-primary text-white p-8 rounded-lg shadow-lg h-full">
                            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                            <p className="text-gray-300 mb-8">
                                We're here to help! Reach out to us through any of the following methods.
                            </p>
                            <div className="space-y-6 text-lg">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 mt-1 text-secondary" />
                                    <div>
                                        <h3 className="font-semibold">Our Office</h3>
                                        <p className="text-gray-300">123 Main Street<br />Minneapolis, MN 55401</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 mt-1 text-secondary" />
                                    <div>
                                        <h3 className="font-semibold">Email Us</h3>
                                        <a href="mailto:info@rrrealty.com" className="text-gray-300 hover:text-white">info@rrrealty.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 mt-1 text-secondary" />
                                    <div>
                                        <h3 className="font-semibold">Call Us</h3>
                                        <a href="tel:612-555-0123" className="text-gray-300 hover:text-white">(612) 555-0123</a>
                                    </div>
                                </div>
                            </div>
                             <div className="mt-8 border-t border-white/20 pt-6">
                                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                                <p className="text-gray-300">Monday - Friday: 9am - 6pm</p>
                                <p className="text-gray-300">Saturday: 10am - 4pm</p>
                                <p className="text-gray-300">Sunday: By Appointment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
