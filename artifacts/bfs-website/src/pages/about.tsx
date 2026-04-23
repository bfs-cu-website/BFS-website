import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { founders } from "@/data/team";
import { CheckCircle2, Target, TrendingUp, Users, Globe, BookOpen, Award, Lightbulb, Handshake } from "lucide-react";

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
            <p className="text-lg text-gray-300 font-serif leading-relaxed mb-6">
              From a shared vision in 2021 to Cotton University's premier platform for business acumen.
            </p>
            <blockquote className="border-l-4 border-accent pl-4 text-left max-w-xl mx-auto italic text-gray-200 font-serif text-base">
              "Bridging the gap between academic learning and real-world financial practices"
            </blockquote>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">

        {/* Who We Are & Our Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 mb-20"
        >
          {/* Who We Are */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">Who We Are</h2>
            <div className="w-10 h-1 bg-accent mb-6 rounded-full"></div>
            <p className="text-muted-foreground leading-relaxed font-serif mb-5">
              The Business &amp; Finance Society is Cotton University's premier student platform for fostering financial literacy, entrepreneurship, and business acumen since 2021.
            </p>
            <p className="text-muted-foreground leading-relaxed font-serif">
              Founded by Faisal Wahid and Bhabarnav Das, we have grown into a thriving community organizing field visits, quizzes, fairs, and industry interactions that give students real-world exposure to finance and business.
            </p>
          </div>

          {/* Our Vision */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">Our Vision</h2>
            <div className="w-10 h-1 bg-accent mb-6 rounded-full"></div>
            <ol className="space-y-5">
              {[
                "Nurture a culture of entrepreneurship, financial literacy, and innovation among students.",
                "Create an inclusive platform that bridges academia with real-world business practices.",
                "Build a dynamic community of future leaders who contribute through ethical business practices.",
                "Foster global exposure by connecting students with business leaders and institutions."
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-accent font-black text-lg leading-tight shrink-0 w-7">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-muted-foreground font-serif leading-relaxed">{point}</p>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* Mission & Founders */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Our Mission</h2>
              <h3 className="text-3xl font-bold text-primary mb-4">Empowering the Next Generation</h3>
              <blockquote className="border-l-4 border-accent pl-5 italic text-muted-foreground font-serif leading-relaxed text-lg">
                "To empower students with practical financial knowledge and entrepreneurial skills, creating a bridge between classroom learning and real-world application."
              </blockquote>
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

        {/* Aims & Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">What We Stand For</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary">Aims &amp; Objectives</h3>
            <p className="text-muted-foreground font-serif mt-3 max-w-2xl mx-auto">
              The Business &amp; Finance Society strives to achieve these key objectives:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                text: "Keep students informed of the latest developments in the world of finance and generate informed interest on finance-related topics."
              },
              {
                icon: Handshake,
                text: "Bridge the gap between pedagogy & practice and cater to a wide variety of finance-related interests, activities, and careers throughout the University community."
              },
              {
                icon: Users,
                text: "Conduct mind-stimulating discussions and forums year-round related to contemporary issues that supplement classroom teaching to widen the horizons of young minds."
              },
              {
                icon: Target,
                text: "Organize competitions related to the domain of finance to foster healthy competition and applied learning."
              },
              {
                icon: TrendingUp,
                text: "Provide a platform for practical financial literacy through field visits, industry interactions, and hands-on market exposure."
              },
              {
                icon: Lightbulb,
                text: "Help students unlock facets of their personalities they were not even aware of, building confidence alongside financial acumen."
              }
            ].map((obj, i) => {
              const Icon = obj.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-accent font-black text-xl">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="text-muted-foreground font-serif leading-relaxed text-sm">{obj.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Future Outlook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">What's Ahead</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary">Future Outlook</h3>
            <p className="text-muted-foreground font-serif mt-3 max-w-2xl mx-auto">
              Building on our strong foundation to expand our impact and reach through strategic initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Globe,
                title: "Expand Partnership Network",
                desc: "Forge stronger relationships with financial institutions, local businesses, and international organizations to provide broader exposure and learning opportunities."
              },
              {
                icon: Award,
                title: "Inter-College Competitions",
                desc: "Organize regional and national-level business competitions to foster healthy rivalry, innovation, and networking opportunities across institutions."
              },
              {
                icon: BookOpen,
                title: "Research & Skill Development",
                desc: "Initiate research projects on financial trends and business practices in Northeast India, complemented by workshops on in-demand skills."
              },
              {
                icon: Lightbulb,
                title: "Student-Led Ventures",
                desc: "Create an incubation program with mentorship and seed funding to help students transform business ideas into viable startups."
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-5"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-2">{item.title}</h4>
                    <p className="text-muted-foreground font-serif leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center mt-10 text-muted-foreground italic font-serif text-lg">
            "Transforming a student society into a breeding ground for future entrepreneurs."
          </p>
        </motion.div>

        {/* Timeline / History */}
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

          <div className="relative border-l-2 border-accent/30 pl-8 ml-4 md:ml-0 space-y-10">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-accent shadow-sm"></div>
                <div className="mb-2 text-sm font-bold text-accent tracking-wider uppercase">{item.date}</div>
                <p className="text-muted-foreground font-serif leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
