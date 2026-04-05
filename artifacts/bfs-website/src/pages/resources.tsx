import { motion } from "framer-motion";
import { resources, ResourceItem } from "@/data/resources";
import { Book, Link as LinkIcon, FileText, Wrench, ArrowUpRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  "Books": Book,
  "Courses": LinkIcon,
  "Reports": FileText,
  "Tools": Wrench
};

function getResourceUrl(resource: ResourceItem): string | undefined {
  if (resource.kind === "course") return resource.url;
  if (resource.kind === "report") return resource.url;
  if (resource.kind === "tool") return resource.url;
  return undefined;
}

function getResourceByline(resource: ResourceItem): string | undefined {
  if (resource.kind === "book") return resource.author;
  if (resource.kind === "course") return resource.provider;
  if (resource.kind === "report") return resource.provider;
  return undefined;
}

export default function Resources() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <section className="bg-primary text-white py-16 mb-16 relative">
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">Learning Hub</h1>
            <p className="text-lg text-gray-300 font-serif">
              Curated books, courses, reports, and tools to accelerate your financial literacy journey.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {resources.map((section, idx) => {
            const Icon = categoryIcons[section.category] ?? Book;

            return (
              <motion.div key={idx} variants={item}>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">{section.category}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((resource, itemIdx) => {
                    const url = getResourceUrl(resource);
                    const byline = getResourceByline(resource);

                    return (
                      <a 
                        key={itemIdx}
                        href={url ?? "#"}
                        target={url ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all flex flex-col h-full"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-primary group-hover:text-accent transition-colors text-lg leading-tight pr-4">
                            {resource.title}
                          </h3>
                          {url && (
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0" />
                          )}
                        </div>

                        {byline && (
                          <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                            {byline}
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground font-serif leading-relaxed mt-auto">
                          {resource.description}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
