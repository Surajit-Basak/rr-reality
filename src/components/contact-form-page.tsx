

'use client';

import { useState } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allAmenities } from '@/lib/mock-data';
import { Checkbox } from './ui/checkbox';


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Message is required." }),
});

const sellFormSchema = z.object({
  submitterName: z.string().min(2, { message: "Your name is required." }),
  submitterEmail: z.string().email({ message: "A valid email is required." }),
  submitterPhone: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  type: z.enum(["House", "Apartment", "Condo", "Land"]),
  price: z.coerce.number().min(1, { message: "Price must be a positive number." }),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(1),
  size: z.coerce.number().int().min(100, { message: "Size must be at least 100 sqft." }),
  location: z.string().min(5, { message: "Location is required." }),
  amenities: z.array(z.string()).optional(),
  images: z.any().optional(),
});


export function ContactFormPage({ isSellPage = false }: { isSellPage?: boolean }) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" }
  });
  
  const sellForm = useForm<z.infer<typeof sellFormSchema>>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      submitterName: "",
      submitterEmail: "",
      submitterPhone: "",
      title: "",
      description: "",
      type: "House",
      price: 0,
      bedrooms: 3,
      bathrooms: 2,
      size: 1500,
      location: "",
      amenities: [],
      images: undefined,
    }
  });


  async function onContactSubmit(values: z.infer<typeof contactFormSchema>) {
    if (!firestore) {
        toast({ variant: "destructive", title: "Database Error" });
        return;
    }
    addDocumentNonBlocking(collection(firestore, 'inquiries'), {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        propertyId: "general_inquiry",
        inquiryDate: serverTimestamp()
    });
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });
    contactForm.reset();
  };

  async function onSellSubmit(values: z.infer<typeof sellFormSchema>) {
    if (!firestore) {
        toast({ variant: "destructive", title: "Database Error" });
        return;
    }
    
    // Note: The 'images' field contains a FileList.
    // We are not uploading files here, just passing the form data.
    // The approval process would need to handle the actual upload.
    const { images, ...submissionData } = values;

    await addDocumentNonBlocking(collection(firestore, 'property_submissions'), {
        ...submissionData,
        // In a real scenario, you'd upload images and store URLs.
        // For now, we'll store an empty array as a placeholder.
        images: [], 
        submittedAt: serverTimestamp()
    });
    toast({ title: "Property Submitted!", description: "Thank you! We will review your submission shortly." });
    sellForm.reset();
  }
  
  const pageTitle = isSellPage ? "Sell Your Home with Confidence" : "Get In Touch";
  const pageDescription = isSellPage 
    ? "Provide details about your property, and our team will conduct a free valuation and create a strategic selling plan for you."
    : "Have questions or ready to start your real estate journey? Contact our team today for a free, no-obligation consultation.";

  const heroImage = PlaceHolderImages.find(p => p.id === (isSellPage ? 'property-2-ext' : 'agent-team'));


  const renderContactForm = () => (
     <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h2>
        <Form {...contactForm}>
          <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <FormField control={contactForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Enter your full name" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={contactForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" placeholder="you@example.com" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={contactForm.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input {...field} type="tel" placeholder="(123) 456-7890" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={contactForm.control} name="message" render={({ field }) => (
              <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea {...field} rows={6} placeholder="How can we help?" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto text-base">
                Send Message
            </Button>
          </form>
        </Form>
    </div>
  );

  const renderSellForm = () => (
    <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-primary mb-6">Submit Your Property Details</h2>
        <Form {...sellForm}>
            <form onSubmit={sellForm.handleSubmit(onSellSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField control={sellForm.control} name="submitterName" render={({ field }) => (
                        <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={sellForm.control} name="submitterEmail" render={({ field }) => (
                          <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={sellForm.control} name="submitterPhone" render={({ field }) => (
                          <FormItem><FormLabel>Your Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                </div>
                <FormField control={sellForm.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Property Title</FormLabel><FormControl><Input placeholder="e.g., Charming Downtown Apartment" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={sellForm.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Property Description</FormLabel><FormControl><Textarea placeholder="Describe the property's key features..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FormField control={sellForm.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="House">House</SelectItem>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Condo">Condo</SelectItem>
                                    <SelectItem value="Land">Land</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={sellForm.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel>Asking Price</FormLabel><FormControl><Input type="number" placeholder="e.g., 450000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={sellForm.control} name="size" render={({ field }) => (
                        <FormItem><FormLabel>Size (sqft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 2200" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={sellForm.control} name="bedrooms" render={({ field }) => (
                        <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={sellForm.control} name="bathrooms" render={({ field }) => (
                        <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={sellForm.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location / Address</FormLabel><FormControl><Input placeholder="e.g., 123 Main St, Minneapolis, MN" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={sellForm.control} name="amenities" render={() => (
                    <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        {allAmenities.map((item) => (
                            <FormField key={item.id} control={sellForm.control} name="amenities" render={({ field }) => (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(field.value?.filter((value) => value !== item.id))
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                            )} />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField
                  control={sellForm.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Images</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                                <Input 
                                  id="dropzone-file" 
                                  type="file" 
                                  className="hidden" 
                                  multiple
                                  onChange={(e) => field.onChange(e.target.files)}
                                />
                            </label>
                        </div> 
                      </FormControl>
                      <FormDescription>
                        Upload images of your property. The first image will be the featured image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={sellForm.formState.isSubmitting} className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto text-base">
                    {sellForm.formState.isSubmitting ? "Submitting..." : "Submit for Approval"}
                </Button>
            </form>
        </Form>
    </div>
  );

  return (
    <div>
        <section className="relative h-[50vh] flex items-center justify-center bg-primary text-white">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={pageTitle}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center px-6">
                <h1 className="text-4xl md:text-5xl font-bold">{pageTitle}</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                    {pageDescription}
                </p>
            </div>
        </section>

        <div className="bg-gray-50">
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {isSellPage ? renderSellForm() : renderContactForm()}
                        
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
    </div>
  );
}
