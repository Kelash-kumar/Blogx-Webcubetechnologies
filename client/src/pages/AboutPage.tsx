import React from "react";
import { Layout, Shield, Zap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
    return (
        <div className="space-y-24 pb-20 pt-16">
            {/* Mission Section */}
            <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Our Story</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
                    Empowering creators to <br />
                    <span className="text-muted-foreground">share their voice.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                    BlogX was built with a simple mission: to provide a clean, distraction-free environment for writers to publish their best work and for readers to discover stories that matter.
                </p>
            </section>

            {/* Values Grid */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: "Blazing Fast",
                            desc: "Optimized for speed. No bloat, no trackers, just content that loads instantly on any device."
                        },
                        {
                            icon: Shield,
                            title: "Privacy First",
                            desc: "We respect your data. Our platform is built on transparency and security for both authors and readers."
                        },
                        {
                            icon: Users,
                            title: "Community Driven",
                            desc: "Designed for the modern creator. Share your ideas with a growing community of likeminded individuals."
                        }
                    ].map((value, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-4 hover:shadow-xl hover:shadow-gray-100 transition-all">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <value.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">{value.title}</h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                {value.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 text-center border-t border-gray-100 pt-20">
                <h2 className="text-3xl font-black text-foreground mb-6">Ready to start writing?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register">
                        <Button className="h-12 px-8 rounded-xl font-black">Join BlogX Today</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" className="h-12 px-8 rounded-xl font-bold gap-2">
                            Browse Articles <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
