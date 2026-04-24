import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents } from "@/lib/useEvents";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function EventSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-3 w-full bg-gray-200 rounded-full" />
        <div className="h-3 w-5/6 bg-gray-200 rounded-full" />
        <div className="h-9 w-full bg-gray-100 rounded-lg mt-4" />
      </div>
    </div>
  );
}

export default function Events() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { events, loading } = useEvents();

  const filteredEvents = events.filter((e) => e.status === activeTab);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <section className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">Events & Initiatives</h1>
            <p className="text-lg text-gray-300 font-serif">
              From high-stakes quizzes to massive business fairs, discover where the action happens.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-200/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-8 py-3 rounded-md text-sm font-bold transition-all ${
                activeTab === "upcoming"
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-8 py-3 rounded-md text-sm font-bold transition-all ${
                activeTab === "past"
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                  >
                    <div className="aspect-video overflow-hidden relative bg-gray-100">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0A2540] to-[#1a3a60] flex items-center justify-center">
                          <span className="text-white/30 text-4xl font-black">{event.category[0]}</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-primary">
                        {event.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center text-sm text-muted-foreground mb-3 font-medium">
                        <Calendar className="w-4 h-4 mr-2 text-accent" />
                        {event.date}
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 flex-1 font-serif leading-relaxed">
                        {event.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full justify-between group-hover:border-accent group-hover:text-accent transition-colors"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No events found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
