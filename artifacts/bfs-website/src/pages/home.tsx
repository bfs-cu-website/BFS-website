import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, TrendingUp, Users, Target, BookOpen, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/lib/useEvents";
import { blogPosts } from "@/data/blog";

export default function Home() {
  const { events: allEvents } = useEvents();

  const upcomingEvents = allEvents.filter(e => e.status === "upcoming").slice(0, 3);
  const pastEvents = allEvents.filter(e => e.status === "past").slice(0, 3);
  const recentPosts = blogPosts.slice(0, 3);

  const categoryColors: Record<string, string> = {
    Finance: "bg-blue-100 text-blue-800",
    Startups: "bg-green-100 text-green-800",
    Markets: "bg-purple-100 text-purple-800",
    Economics: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-24 overflow-hidden bg-primary">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        
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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 font-sans">
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
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:text-white rounded-md backdrop-blur-sm">
                  Discover Our Vision
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* STATS SECTION */}
      <section className="py-16 relative z-20 mx-4 md:mx-auto container rounded-xl shadow-xl shadow-primary/5 -mt-10 bg-[#cdd9fa]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {[
            { label: "Founded", value: "2021" },
            { label: "Events Organized", value: "20+" },
            { label: "Field Visits", value: "8+" },
            { label: "Annual Event", value: "Biz Fair" },
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
              <h3 className="text-3xl md:text-5xl font-bold text-primary mb-6">Bridging Academia and Real-World Finance</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-serif">
                The Business & Finance Society is Cotton University's premier student platform for fostering financial literacy, entrepreneurship, and business acumen since 2021.
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
                  <p className="text-sm text-muted-foreground">Fostering innovation through Biz Fair and field visits.</p>
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
      {/* UPCOMING EVENTS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">What's Next</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-primary">Upcoming Events</h3>
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
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-white/30 font-bold text-xl">{event.category}</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-primary flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
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
        </div>
      </section>
      {/* PAST EVENTS HIGHLIGHTS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Our Legacy</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-primary">Recent Activities</h3>
            </div>
            <Link href="/events" className="hidden md:inline-flex items-center text-primary font-bold hover:text-accent transition-colors">
              Full history <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {event.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-accent tracking-widest uppercase">{event.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {event.date}
                    </span>
                  </div>
                  <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* FEATURED BLOG POSTS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">From Our Members</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-primary">Insights & Analysis</h3>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center text-primary font-bold hover:text-accent transition-colors">
              Read all articles <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${categoryColors[post.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h4 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <Link href="/blog" className="inline-flex items-center text-sm text-primary font-semibold hover:text-accent transition-colors">
                  Read Article <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/blog">
              <Button variant="outline" className="w-full">Read All Articles</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* BIZ FAIR HIGHLIGHT */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop')" }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-bold mb-6 tracking-widest uppercase">
              Annual Flagship Event
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Biz Fair</h2>
            <p className="text-accent font-medium text-lg mb-6">A Busi Affair</p>
            <p className="text-gray-300 text-lg mb-8 font-serif leading-relaxed">
              Cotton University's biggest student marketplace — where micro-ventures grow, connect, and reach new customers. 
              20+ stalls, Red Bull partnership, and cross-college engagement.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                { label: "2024", desc: "Inaugural Edition" },
                { label: "2025", desc: "Biz Fair 2.0 — 20+ Stalls" },
                { label: "Red Bull", desc: "Brand Partner" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-accent">{item.label}</div>
                  <div className="text-gray-400 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
            <Link href="/events">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-bold px-8">
                Learn More About Biz Fair
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* CALL TO ACTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Ready to Shape the Future?</h2>
            <p className="text-xl text-muted-foreground mb-10 font-serif">
              Join the Business & Finance Society and surround yourself with the most driven students at Cotton University.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="h-16 px-10 text-lg bg-primary hover:bg-primary/90 text-white font-bold rounded-md">
                  Submit Your Application
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-primary text-primary font-bold rounded-md">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
