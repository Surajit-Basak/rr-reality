
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Home, Trophy, Users } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about R&R Realty, our mission, our values, and the dedicated team of real estate experts ready to help you find your dream home.',
};


const agents = [
    { name: "Jane Doe", title: "Lead Agent", avatarId: "agent-1" },
    { name: "John Smith", title: "Senior Agent", avatarId: "agent-2" },
    { name: "Samantha Bee", title: "Buyer's Agent", avatarId: "agent-3" },
];

const values = [
    {
        icon: Trophy,
        title: "Excellence",
        description: "We strive for excellence in everything we do, from market analysis to client service, ensuring you get the best possible outcome."
    },
    {
        icon: Heart,
        title: "Integrity",
        description: "Honesty and transparency are the cornerstones of our business. We build trust by providing clear, straightforward advice."
    },
    {
        icon: Users,
        title: "Client-Centric",
        description: "Your goals are our priority. We listen to your needs and tailor our strategies to ensure a personalized and successful experience."
    },
    {
        icon: Briefcase,
        title: "Professionalism",
        description: "Our experienced agents are dedicated to providing the highest level of professional service and expert guidance."
    }
];

export default function AboutPage() {
    const aboutHeroImage = PlaceHolderImages.find(p => p.id === 'agent-team');
    
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center bg-primary text-white">
                {aboutHeroImage && (
                    <Image
                        src={aboutHeroImage.imageUrl}
                        alt="R&R Realty Team"
                        fill
                        className="object-cover"
                        data-ai-hint={aboutHeroImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-bold">About R&R Realty Hub</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                        Your trusted partner in navigating the Twin Cities real estate market.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Story: A Tradition of Trust</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Founded in 2008, R&R Realty has been a pillar in the Twin Cities real estate community for over 15 years. Our journey began with a simple mission: to provide expert, client-focused service exclusively for single-family homes. This specialization allows us to offer unparalleled knowledge and guidance in a market we know and love.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                We believe that buying or selling a home is more than a transaction—it's a life-changing experience. That's why our team of seasoned professionals is dedicated to providing personalized service, strategic advice, and unwavering support from start to finish.
                            </p>
                            <Button asChild className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
                                <Link href="/properties">View Our Properties</Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-center">
                            <Card className="bg-muted/50 border-none">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-secondary mb-2">500+</div>
                                    <div className="text-primary font-semibold">Homes Sold</div>
                                </CardContent>
                            </Card>
                             <Card className="bg-muted/50 border-none">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-secondary mb-2">15+</div>
                                    <div className="text-primary font-semibold">Years of Experience</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/50 border-none col-span-2">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-secondary mb-2">98%</div>
                                    <div className="text-primary font-semibold">Client Satisfaction Rate</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

             {/* Our Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Values</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">The principles that guide every decision we make.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10">
                                    <value.icon className="w-8 h-8 text-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-2">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Meet Our Team Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Dedicated Team</h2>
                        <p className="mt-4 text-lg text-muted-foreground">The experts who will guide you home.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {agents.map((agent) => {
                            const agentImage = PlaceHolderImages.find(p => p.id === agent.avatarId);
                            const agentInitials = agent.name.split(' ').map(n => n[0]).join('');
                            return (
                                <Card key={agent.name} className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    {agentImage && (
                                        <div className="h-64 relative">
                                            <Image 
                                                src={agentImage.imageUrl} 
                                                alt={`Portrait of ${agent.name}`} 
                                                fill 
                                                className="object-cover" 
                                                data-ai-hint={agentImage.imageHint} 
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold text-primary">{agent.name}</h3>
                                        <p className="text-secondary font-medium">{agent.title}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Let's Start Your Journey</h2>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-200">
                        Whether you're buying your first home or selling a cherished property, our team is ready to provide the expert guidance you deserve.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button asChild size="lg" className="bg-secondary text-white hover:bg-secondary/90">
                            <Link href="/contact">Get In Touch</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                            <Link href="/sell">Sell Your Home</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
