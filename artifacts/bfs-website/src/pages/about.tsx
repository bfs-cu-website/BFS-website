import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { founders } from "@/data/team";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 font-sans">Our Story</h1>
            <p className="text-lg text-gray-300 font-serif leading-relaxed">
              From a shared vision in 2021 to Cotton University's premier platform for business acumen.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Mission & Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Our Mission</h2>
              <h3 className="text-3xl font-bold text-primary mb-4">Empowering the Next Generation</h3>
              <p className="text-muted-foreground leading-relaxed font-serif">
                To cultivate a robust ecosystem of financial literacy, entrepreneurial thinking, and business acumen among the student community. We strive to bridge the gap between academic knowledge and real-world market dynamics.
              </p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Why Join Us?</h2>
              <ul className="space-y-4">
                {[
                  "Exclusive access to industry visits and networking events",
                  "Hands-on experience in organizing large-scale business fairs",
                  "Mentorship from alumni and industry professionals",
                  "A community of ambitious, like-minded peers"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-accent mr-3 shrink-0" />
                    <span className="text-primary font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Founders */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">The Visionaries</h2>
            <h3 className="text-3xl font-bold text-primary mb-8">Our Founders</h3>
            
            <div className="space-y-6">
              {founders.map((founder, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-accent/30 shadow-sm">
                    <img
                      src={founder.photo}
                      alt={founder.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-1">{founder.name}</h4>
                    <p className="text-sm text-muted-foreground">{founder.education}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">History</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary">Our Journey So Far</h3>
          </div>

          <div className="relative border-l-2 border-accent/30 pl-8 ml-4 md:ml-0 space-y-12">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-accent shadow-sm"></div>
                <div className="mb-1 text-sm font-bold text-accent tracking-wider">{item.date}</div>
                <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                <p className="text-muted-foreground font-serif leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}