import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, TrendingUp, Users, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { events } from "@/data/events";
import { blogPosts } from "@/data/blog";

export default function Home() {
  const upcomingEvents = events.filter(e => e.status === "upcoming").slice(0, 3);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent font-medium text-sm mb-6 backdrop-blur-sm">
              Established 2021 • Cotton University
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 font-sans">
              Nurturing Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">Business Leaders</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed font-serif">
              The premier student platform for financial literacy, entrepreneurship, and business acumen. Join a community of ambitious minds shaping tomorrow's economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/join">
                <Button size="lg" className="h-14 px-8 text-base bg-accent hover:bg-accent/90 text-primary font-bold rounded-md">
                  Apply for Membership
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/30 text-primary hover:bg-white/10 hover:text-white rounded-md backdrop-blur-sm">
                  Discover Our Vision
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-white relative z-20 -mt-10 mx-4 md:mx-auto container rounded-xl shadow-xl shadow-primary/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {[
            { label: "Founded", value: "2021" },
            { label: "Events Organized", value: "20+" },
            { label: "Field Visits", value: "8+" },
            { label: "Annual Events", value: "Biz Fair" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-sans">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Who We Are</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-primary mb-6">A Gateway to Something Serious</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-serif">
                The Business & Finance Society is more than a club; it's a launchpad for ambition. We bridge the gap between academic theory and real-world market dynamics.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-serif">
                From intimate discussions with mutual fund managers to massive student marketplaces like Biz Fair, we build environments where ideas are tested and leaders are forged.
              </p>
              <Link href="/about" className="inline-flex items-center text-primary font-bold hover:text-accent transition-colors group">
                Read our full story 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <TrendingUp className="w-8 h-8 text-accent mb-4" />
                  <h4 className="font-bold text-primary mb-2">Financial Literacy</h4>
                  <p className="text-sm text-muted-foreground">Demystifying markets, investments, and personal finance.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <Users className="w-8 h-8 text-accent mb-4" />
                  <h4 className="font-bold text-primary mb-2">Networking</h4>
                  <p className="text-sm text-muted-foreground">Connecting students with industry leaders and mentors.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <Target className="w-8 h-8 text-accent mb-4" />
                  <h4 className="font-bold text-primary mb-2">Entrepreneurship</h4>
                  <p className="text-sm text-muted-foreground">Fostering innovation and supporting student startups.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <BookOpen className="w-8 h-8 text-accent mb-4" />
                  <h4 className="font-bold text-primary mb-2">Research</h4>
                  <p className="text-sm text-muted-foreground">Deep dives into economic trends and market analysis.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Action & Impact</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-primary">Featured Events</h3>
            </div>
            <Link href="/events" className="hidden md:inline-flex items-center text-primary font-bold hover:text-accent transition-colors">
              View all events <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                  {/* Since I can't generate images easily, using nice placeholders with colors */}
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                    <span className="text-primary/20 font-bold text-xl">{event.category}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-primary">
                    {event.date}
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="text-xs font-bold text-accent tracking-widest uppercase mb-2">{event.category}</div>
                  <h4 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{event.title}</h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/events">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-primary to-primary"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to shape the future?</h2>
          <p className="text-xl text-gray-300 mb-10 font-serif">
            Join the Business & Finance Society today and surround yourself with the most driven students at Cotton University.
          </p>
          <Link href="/join">
            <Button size="lg" className="h-16 px-10 text-lg bg-accent hover:bg-accent/90 text-primary font-bold rounded-md shadow-[0_0_40px_-10px_rgba(201,162,39,0.5)]">
              Submit Your Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}