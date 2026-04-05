import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "@/data/blog";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  const filteredPosts = activeFilter === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <section className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">Insights & Analysis</h1>
            <p className="text-lg text-gray-300 font-serif">
              Perspectives on markets, startups, and the economy by B&FS members.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-muted-foreground border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-gray-50 text-accent border-accent/20 font-bold uppercase tracking-wider text-[10px]">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1 font-serif leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-bold text-sm group-hover:text-accent transition-colors">
                    Read Article <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}