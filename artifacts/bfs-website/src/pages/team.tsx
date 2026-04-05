import { motion } from "framer-motion";
import { executiveCommittee, departmentHeads } from "@/data/team";

export default function Team() {
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
            <h1 className="text-4xl md:text-5xl font-black mb-4">Meet the Team</h1>
            <p className="text-lg text-gray-300 font-serif">
              The driving force behind Cotton University's premier business society.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Executive Committee */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-2">Leadership</h2>
            <h3 className="text-3xl font-bold text-primary">Executive Committee</h3>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {executiveCommittee.map((member, i) => (
              <motion.div key={i} variants={item} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group text-center p-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-white shadow-inner group-hover:scale-105 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-primary mb-1">{member.name}</h4>
                <p className="text-sm font-medium text-accent">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Department Heads */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-2">Departments</h2>
            <h3 className="text-3xl font-bold text-primary">Department Heads</h3>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {departmentHeads.map((member, i) => (
              <motion.div key={i} variants={item} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-primary mb-1 leading-tight">{member.name}</h4>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}