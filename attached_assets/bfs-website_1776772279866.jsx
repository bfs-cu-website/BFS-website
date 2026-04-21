import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "bfs2021";

const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "BEF Quiz Competition",
    date: "2026-02-24",
    description: "Business Economics and General Quiz in collaboration with Artha-patra.",
    category: "Competition",
    location: "Cotton University Campus",
  },
  {
    id: 2,
    title: "Visit to Legislative Assembly",
    date: "2026-02-18",
    description: "Educational visit to the legislative assembly for the budget session.",
    category: "Field Visit",
    location: "Guwahati, Assam",
  },
  {
    id: 3,
    title: "Educational Film Screening: The Big Short",
    date: "2026-02-13",
    description: "Screening of the acclaimed financial crisis film 'The Big Short' for members.",
    category: "Educational",
    location: "Cotton University",
  },
];

const CATEGORIES = ["Competition", "Field Visit", "Educational", "Seminar", "Workshop", "Networking", "Orientation", "Other"];

const NAV_LINKS = ["Home", "About", "Activities", "Events", "Team", "Contact"];

const TEAM = [
  { role: "President", name: "Izza Saime Sahariah", dept: "Executive Committee" },
  { role: "General Secretary", name: "Gitam Sarma", dept: "Executive Committee" },
  { role: "Treasurer", name: "Ashmita Chowdhury", dept: "Executive Committee" },
  { role: "Co-Treasurer", name: "Arijit Saikia", dept: "Executive Committee" },
  { role: "Human Resource", name: "Sajib Sujan Patgiri", dept: "Department Head" },
  { role: "Content Team", name: "Anjali Mardi", dept: "Department Head" },
  { role: "Social Media", name: "Pahi Borah & Essita Barman", dept: "Department Head" },
  { role: "Marketing Team", name: "Parvez Alam Hoque", dept: "Department Head" },
];

const ACTIVITIES = [
  { year: "2021", items: ["Online webinar on impact of startups (Obhigyota founders)", "Orientation 2021"] },
  { year: "2022", items: ["Visit to Assam Startup: The Nest", "Interactive session with AEC Entrepreneurship Cell", "Banking & Enterprises session (Dr. Samir Baruah)", "Interactive session with Mutual Fund Managers", "Visit to NEDFi", "Hyperlocal business field visits", "Orientation 2022", "Visit to Bajaj Finance", "Visit to Khadi & Village Industries", "Visit to AIDCL"] },
  { year: "2023", items: ["Orientation Session 2023"] },
  { year: "2024", items: ["Biz Fair (inaugural edition)", "BEG Quiz organized", "Visit to NABARD"] },
  { year: "2025", items: ["Biz Fair 2.0 (annual flagship event)", "Orientation session for new students", "Visit to NEDFi"] },
  { year: "2026", items: ["Educational film screening: The Big Short", "Visit to Legislative Assembly (Budget Session)", "BEF Quiz Competition with Artha-patra"] },
];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function isUpcoming(dateStr) {
  return new Date(dateStr + "T00:00:00") >= new Date(new Date().toDateString());
}

export default function App() {
  const [activeSection, setActiveSection] = useState("Home");
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", category: "Educational", location: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const storageKey = "bfs_events_v1";

  useEffect(() => {
    try {
      window.storage?.get(storageKey).then(res => {
        if (res?.value) setEvents(JSON.parse(res.value));
      }).catch(() => {});
    } catch {}
  }, []);

  const saveEvents = async (evts) => {
    setEvents(evts);
    try { await window.storage?.set(storageKey, JSON.stringify(evts)); } catch {}
  };

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleAdminLogin = () => {
    if (adminPw === ADMIN_PASSWORD) { setAdminAuthed(true); setPwError(false); }
    else { setPwError(true); }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const evt = { ...newEvent, id: Date.now() };
    saveEvents([...events, evt]);
    setNewEvent({ title: "", date: "", description: "", category: "Educational", location: "" });
    showNotif("Event added successfully!");
  };

  const handleUpdateEvent = () => {
    if (!editingEvent.title || !editingEvent.date) return;
    saveEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
    setEditingEvent(null);
    showNotif("Event updated!");
  };

  const handleDeleteEvent = (id) => {
    saveEvents(events.filter(e => e.id !== id));
    showNotif("Event deleted.");
  };

  const upcoming = events.filter(e => isUpcoming(e.date)).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = events.filter(e => !isUpcoming(e.date)).sort((a, b) => new Date(b.date) - new Date(a.date));

  const categoryColors = {
    Competition: "#c8932a", "Field Visit": "#1a3a6b", Educational: "#2a6b4a",
    Seminar: "#6b2a4a", Workshop: "#2a4a6b", Networking: "#6b4a2a",
    Orientation: "#4a2a6b", Other: "#4a6b2a"
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f8f6f0", minHeight: "100vh", color: "#1a2540" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Sans 3', sans-serif; }
        h1,h2,h3,h4 { font-family: 'Playfair Display', serif; }
        .nav-link { cursor: pointer; padding: 8px 16px; border-radius: 2px; transition: all 0.2s; font-family: 'Source Sans 3', sans-serif; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }
        .nav-link:hover { background: rgba(200,147,42,0.15); color: #c8932a; }
        .nav-link.active { color: #c8932a; border-bottom: 2px solid #c8932a; }
        .btn-primary { background: #c8932a; color: white; border: none; padding: 12px 28px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 13px; transition: all 0.2s; }
        .btn-primary:hover { background: #a87520; transform: translateY(-1px); }
        .btn-secondary { background: transparent; color: #1a2540; border: 2px solid #1a2540; padding: 10px 24px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; transition: all 0.2s; }
        .btn-secondary:hover { background: #1a2540; color: white; }
        .section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
        .section-title { font-size: clamp(32px, 5vw, 52px); color: #1a2540; margin-bottom: 8px; }
        .gold-line { width: 60px; height: 3px; background: #c8932a; margin-bottom: 40px; }
        input, textarea, select { width: 100%; padding: 10px 14px; border: 1px solid #d0c8b8; background: white; font-family: 'Source Sans 3', sans-serif; font-size: 14px; color: #1a2540; outline: none; transition: border 0.2s; }
        input:focus, textarea:focus, select:focus { border-color: #c8932a; }
        .card { background: white; border: 1px solid #e8e0d0; padding: 28px; transition: all 0.2s; }
        .card:hover { box-shadow: 0 8px 32px rgba(26,37,64,0.1); transform: translateY(-2px); }
        .event-badge { display: inline-block; padding: 3px 10px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: white; margin-bottom: 10px; }
        .notif { position: fixed; bottom: 24px; right: 24px; background: #1a2540; color: white; padding: 14px 24px; font-family: 'Source Sans 3', sans-serif; font-size: 14px; z-index: 9999; animation: slideIn 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .hero-stat { text-align: center; padding: 20px; }
        .hero-stat-num { font-family: 'Playfair Display', serif; font-size: 48px; color: #c8932a; font-weight: 900; line-height: 1; }
        .hero-stat-label { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-top: 6px; font-family: 'Source Sans 3', sans-serif; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(26,37,64,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: white; padding: 40px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; }
        @media (max-width: 768px) { .section { padding: 60px 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "#1a2540", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setActiveSection("Home")}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>₹</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>Business & Finance</div>
              <div style={{ color: "#c8932a", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Cotton University</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <span key={l} className={`nav-link ${activeSection === l ? "active" : ""}`} style={{ color: activeSection === l ? "#c8932a" : "#c8d4e8" }} onClick={() => { setActiveSection(l); setMobileMenuOpen(false); }}>{l}</span>
            ))}
            <span style={{ marginLeft: 8, cursor: "pointer", background: "#c8932a", color: "white", padding: "6px 14px", fontSize: 12, letterSpacing: 1, fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700 }} onClick={() => setAdminOpen(true)}>ADMIN</span>
          </div>
        </div>
      </nav>

      {/* NOTIFICATION */}
      {notification && <div className="notif">{notification}</div>}

      {/* HOME */}
      {activeSection === "Home" && (
        <div>
          {/* HERO */}
          <div style={{ background: "linear-gradient(135deg, #1a2540 0%, #0f1829 60%, #1a2540 100%)", color: "white", padding: "100px 40px 80px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(200,147,42,0.03) 0px, rgba(200,147,42,0.03) 1px, transparent 1px, transparent 40px)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-block", background: "rgba(200,147,42,0.2)", border: "1px solid rgba(200,147,42,0.4)", padding: "6px 16px", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#c8932a", marginBottom: 24, fontFamily: "'Source Sans 3', sans-serif" }}>Established 2021 · Cotton University, Guwahati</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 20, maxWidth: 800 }}>
                Business &<br /><span style={{ color: "#c8932a" }}>Finance Society</span>
              </h1>
              <p style={{ fontSize: 18, color: "#a0b4cc", maxWidth: 560, lineHeight: 1.7, marginBottom: 40, fontFamily: "'Source Sans 3', sans-serif", fontWeight: 300 }}>
                Bridging the gap between academic learning and real-world financial practices. Cotton University's premier student platform for financial literacy and entrepreneurship.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => setActiveSection("Events")}>Upcoming Events</button>
                <button className="btn-secondary" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }} onClick={() => setActiveSection("About")}>Our Story</button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ background: "white", borderBottom: "3px solid #c8932a" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="stats-grid">
              {[["4+", "Years Active"], ["20+", "Events Held"], ["2", "Biz Fair Editions"], ["5+", "Institutional Partners"]].map(([n, l]) => (
                <div key={l} className="hero-stat" style={{ borderRight: "1px solid #e8e0d0", padding: "28px 20px" }}>
                  <div className="hero-stat-num">{n}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING EVENTS PREVIEW */}
          <div className="section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h2 className="section-title">Upcoming Events</h2>
              <span style={{ cursor: "pointer", color: "#c8932a", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginTop: 12 }} onClick={() => setActiveSection("Events")}>View All →</span>
            </div>
            <div className="gold-line" />
            {upcoming.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#888", fontFamily: "'Source Sans 3', sans-serif" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                <p>No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                {upcoming.slice(0, 3).map(evt => (
                  <div key={evt.id} className="card" style={{ borderTop: `3px solid ${categoryColors[evt.category] || "#c8932a"}` }}>
                    <span className="event-badge" style={{ background: categoryColors[evt.category] || "#c8932a" }}>{evt.category}</span>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{formatDate(evt.date)}</div>
                    <h3 style={{ fontSize: 20, marginBottom: 8, lineHeight: 1.3 }}>{evt.title}</h3>
                    <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6, fontFamily: "'Source Sans 3', sans-serif" }}>{evt.description}</p>
                    {evt.location && <div style={{ marginTop: 12, fontSize: 12, color: "#888", fontFamily: "'Source Sans 3', sans-serif" }}>📍 {evt.location}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MISSION BANNER */}
          <div style={{ background: "#1a2540", color: "white", padding: "60px 40px", textAlign: "center" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, letterSpacing: 3, color: "#c8932a", textTransform: "uppercase", marginBottom: 16 }}>Our Mission</div>
              <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontStyle: "italic", lineHeight: 1.6, color: "#dce8f4" }}>
                "To empower students with practical financial knowledge and entrepreneurial skills, creating a bridge between classroom learning and real-world application."
              </blockquote>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {activeSection === "About" && (
        <div>
          <div style={{ background: "#1a2540", padding: "60px 40px", color: "white" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: 3, color: "#c8932a", textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900 }}>Our Story & Vision</h1>
            </div>
          </div>
          <div className="section">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 80 }}>
              <div>
                <h2 className="section-title">Who We Are</h2>
                <div className="gold-line" />
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, lineHeight: 1.9, color: "#444", marginBottom: 20 }}>
                  The Business & Finance Society is Cotton University's premier student platform for fostering financial literacy, entrepreneurship, and business acumen since 2021.
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, lineHeight: 1.9, color: "#444" }}>
                  Founded by Faisal Wahid and Bhabarnav Das, we have grown into a thriving community organizing field visits, quizzes, fairs, and industry interactions that give students real-world exposure to finance and business.
                </p>
              </div>
              <div>
                <h2 className="section-title">Our Vision</h2>
                <div className="gold-line" />
                {["Nurture a culture of entrepreneurship, financial literacy, and innovation among students.", "Create an inclusive platform that bridges academia with real-world business practices.", "Build a dynamic community of future leaders who contribute through ethical business practices.", "Foster global exposure by connecting students with business leaders and institutions."].map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <span style={{ color: "#c8932a", fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, lineHeight: 1 }}>0{i + 1}</span>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: "#444", lineHeight: 1.7 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <h2 className="section-title">History Timeline</h2>
            <div className="gold-line" />
            <div style={{ borderLeft: "3px solid #c8932a", paddingLeft: 32, marginBottom: 60 }}>
              {[["January 25, 2021", "The vision was born — the idea to establish a society for students interested in business and finance."], ["August 26, 2021", "Officially registered at Cotton University with approval from the Registrar & Dean."], ["September 1, 2021", "The society officially came into effect, marking the beginning of our journey."], ["October 9, 2021", "Grand inauguration ceremony of the Business & Finance Society."], ["2025–Present", "Now in our 4th successful year, continuing to build our legacy and impact."]].map(([d, t], i) => (
                <div key={i} style={{ marginBottom: 32, position: "relative" }}>
                  <div style={{ position: "absolute", left: -40, width: 14, height: 14, borderRadius: "50%", background: "#c8932a", border: "3px solid white", boxShadow: "0 0 0 2px #c8932a", top: 4 }} />
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#c8932a", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{d}</div>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: "#444", lineHeight: 1.7 }}>{t}</p>
                </div>
              ))}
            </div>

            {/* Founders */}
            <h2 className="section-title">Founders</h2>
            <div className="gold-line" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {[{ name: "Faisal Wahid", edu: ["B.A. (Hons) Economics, Cotton University", "M.A. Economics, University of Hyderabad"] }, { name: "Bhabarnav Das", edu: ["B.A. (Hons) Economics, Cotton University", "MBA, IMT Hyderabad"] }].map(f => (
                <div key={f.name} className="card" style={{ borderLeft: "4px solid #c8932a" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#1a2540", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "white", fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>{f.name[0]}</div>
                  <h3 style={{ fontSize: 22, marginBottom: 8 }}>{f.name}</h3>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: "#c8932a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Co-Founder</div>
                  {f.edu.map((e, i) => <div key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#666", marginBottom: 4 }}>• {e}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITIES */}
      {activeSection === "Activities" && (
        <div>
          <div style={{ background: "#1a2540", padding: "60px 40px", color: "white" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: 3, color: "#c8932a", textTransform: "uppercase", marginBottom: 12 }}>Activities</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900 }}>What We've Done</h1>
            </div>
          </div>
          <div className="section">
            <h2 className="section-title">Year-by-Year Activities</h2>
            <div className="gold-line" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 28 }}>
              {ACTIVITIES.map(({ year, items }) => (
                <div key={year} className="card">
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "#e8e0d0", lineHeight: 1, marginBottom: 4 }}>{year}</div>
                  <div style={{ height: 2, background: "#c8932a", width: 40, marginBottom: 16 }} />
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: "#c8932a", marginTop: 3, flexShrink: 0 }}>▸</span>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#444", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Key Partnerships */}
            <h2 className="section-title" style={{ marginTop: 80 }}>Institutional Partners</h2>
            <div className="gold-line" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {["Assam Startup: The Nest", "NEDFi", "Bajaj Finance", "NABARD", "Khadi & Village Industries", "AIDCL", "Eco Forum", "Red Bull (Sponsor)"].map(p => (
                <div key={p} style={{ background: "white", border: "1px solid #e8e0d0", padding: "20px 24px", textAlign: "center", fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#1a2540", fontWeight: 600 }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EVENTS */}
      {activeSection === "Events" && (
        <div>
          <div style={{ background: "#1a2540", padding: "60px 40px", color: "white" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: 3, color: "#c8932a", textTransform: "uppercase", marginBottom: 12 }}>Events</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900 }}>Events & Programs</h1>
            </div>
          </div>
          <div className="section">
            {upcoming.length > 0 && (
              <>
                <h2 className="section-title">Upcoming Events</h2>
                <div className="gold-line" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, marginBottom: 70 }}>
                  {upcoming.map(evt => (
                    <div key={evt.id} className="card" style={{ borderTop: `4px solid ${categoryColors[evt.category] || "#c8932a"}` }}>
                      <span className="event-badge" style={{ background: categoryColors[evt.category] || "#c8932a" }}>{evt.category}</span>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{formatDate(evt.date)}</div>
                      <h3 style={{ fontSize: 20, marginBottom: 8, lineHeight: 1.3 }}>{evt.title}</h3>
                      <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, fontFamily: "'Source Sans 3', sans-serif" }}>{evt.description}</p>
                      {evt.location && <div style={{ marginTop: 14, fontSize: 12, color: "#888", fontFamily: "'Source Sans 3', sans-serif" }}>📍 {evt.location}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            {past.length > 0 && (
              <>
                <h2 className="section-title">Past Events</h2>
                <div className="gold-line" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                  {past.map(evt => (
                    <div key={evt.id} className="card" style={{ opacity: 0.8 }}>
                      <span className="event-badge" style={{ background: "#888" }}>{evt.category}</span>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{formatDate(evt.date)}</div>
                      <h3 style={{ fontSize: 18, marginBottom: 6, color: "#555", lineHeight: 1.3 }}>{evt.title}</h3>
                      <p style={{ color: "#777", fontSize: 13, lineHeight: 1.6, fontFamily: "'Source Sans 3', sans-serif" }}>{evt.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {events.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "#888", fontFamily: "'Source Sans 3', sans-serif" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
                <p style={{ fontSize: 18 }}>No events yet. Use the Admin panel to add events.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEAM */}
      {activeSection === "Team" && (
        <div>
          <div style={{ background: "#1a2540", padding: "60px 40px", color: "white" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: 3, color: "#c8932a", textTransform: "uppercase", marginBottom: 12 }}>Team</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900 }}>Our Leadership</h1>
            </div>
          </div>
          <div className="section">
            <h2 className="section-title">Executive Committee</h2>
            <div className="gold-line" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24, marginBottom: 60 }}>
              {TEAM.filter(t => t.dept === "Executive Committee").map(m => (
                <div key={m.name} className="card" style={{ textAlign: "center", borderTop: "3px solid #c8932a" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#1a2540", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>{m.name[0]}</div>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{m.name}</h3>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#c8932a", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{m.role}</div>
                </div>
              ))}
            </div>
            <h2 className="section-title">Department Heads</h2>
            <div className="gold-line" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {TEAM.filter(t => t.dept === "Department Head").map(m => (
                <div key={m.name} className="card" style={{ borderLeft: "3px solid #c8932a" }}>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: "#c8932a", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{m.role}</div>
                  <h3 style={{ fontSize: 16 }}>{m.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT */}
      {activeSection === "Contact" && (
        <div>
          <div style={{ background: "#1a2540", padding: "60px 40px", color: "white" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: 3, color: "#c8932a", textTransform: "uppercase", marginBottom: 12 }}>Contact</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900 }}>Get in Touch</h1>
            </div>
          </div>
          <div className="section">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
              <div>
                <h2 className="section-title">Contact Us</h2>
                <div className="gold-line" />
                {[{ icon: "✉", label: "Email", value: "businessandfinance.society@gmail.com" }, { icon: "📍", label: "Address", value: "Cotton University, Panbazar, Guwahati, Assam – 781001" }, { icon: "📸", label: "Instagram", value: "@businessandfinance.society" }, { icon: "💼", label: "LinkedIn", value: "Business & Finance Society, Cotton University" }].map(c => (
                  <div key={c.label} style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                    <span style={{ fontSize: 24, width: 32, textAlign: "center", marginTop: 2 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: "#c8932a", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: "#333" }}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ borderTop: "3px solid #c8932a" }}>
                <h3 style={{ fontSize: 24, marginBottom: 20 }}>Join Our Society</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 24 }}>
                  Are you a Cotton University student passionate about business and finance? Join us to attend events, build your network, and develop real-world skills.
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#777", lineHeight: 1.7 }}>
                  Reach out to us at our email or follow us on Instagram for announcements on orientation sessions and membership drives.
                </p>
                <div style={{ marginTop: 28 }}>
                  <a href="mailto:businessandfinance.society@gmail.com" style={{ display: "inline-block", textDecoration: "none" }}>
                    <button className="btn-primary">✉ Email Us</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#0f1829", color: "#8a9ab8", padding: "40px 40px 24px", borderTop: "3px solid #c8932a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 20, marginBottom: 8 }}>Business & Finance Society</div>
              <div style={{ fontSize: 12, letterSpacing: 2, color: "#c8932a", marginBottom: 16, textTransform: "uppercase" }}>Cotton University · Est. 2021</div>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}>Nurturing future business leaders through knowledge, networking, and real-world opportunities.</p>
            </div>
            <div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: "#c8932a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Navigate</div>
              {NAV_LINKS.map(l => <div key={l} style={{ cursor: "pointer", marginBottom: 8, fontSize: 14 }} onClick={() => setActiveSection(l)}>{l}</div>)}
            </div>
            <div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: "#c8932a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Contact</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>businessandfinance.society@gmail.com</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>@businessandfinance.society</div>
              <div style={{ fontSize: 14 }}>Panbazar, Guwahati, Assam 781001</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, fontSize: 13, textAlign: "center" }}>
            © 2026 Business & Finance Society, Cotton University. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ADMIN MODAL */}
      {adminOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setAdminOpen(false); setAdminAuthed(false); setAdminPw(""); } }}>
          <div className="modal">
            {!adminAuthed ? (
              <div style={{ textAlign: "center", maxWidth: 360, margin: "0 auto" }}>
                <h2 style={{ fontSize: 28, marginBottom: 8 }}>Admin Access</h2>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#666", fontSize: 14, marginBottom: 28 }}>Enter the admin password to manage events.</p>
                <input type="password" placeholder="Enter admin password" value={adminPw} onChange={e => setAdminPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} style={{ marginBottom: 8 }} />
                {pwError && <div style={{ color: "red", fontSize: 13, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 8 }}>Incorrect password. Try again.</div>}
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
                  <button className="btn-primary" onClick={handleAdminLogin}>Login</button>
                  <button className="btn-secondary" onClick={() => { setAdminOpen(false); setAdminPw(""); setPwError(false); }}>Cancel</button>
                </div>
                <p style={{ marginTop: 24, fontSize: 12, color: "#aaa", fontFamily: "'Source Sans 3', sans-serif" }}>Default password: bfs2021</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h2 style={{ fontSize: 28 }}>Event Manager</h2>
                  <span style={{ cursor: "pointer", fontSize: 22, color: "#999" }} onClick={() => { setAdminOpen(false); setAdminAuthed(false); setAdminPw(""); setEditingEvent(null); }}>✕</span>
                </div>
                <div className="gold-line" />

                {/* ADD EVENT FORM */}
                <div style={{ background: "#f8f6f0", padding: 24, marginBottom: 32, border: "1px solid #e8e0d0" }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16 }}>{editingEvent ? "✏️ Edit Event" : "➕ Add New Event"}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Event Title *</label>
                      <input value={editingEvent ? editingEvent.title : newEvent.title} onChange={e => editingEvent ? setEditingEvent({ ...editingEvent, title: e.target.value }) : setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g. Biz Fair 3.0" />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Date *</label>
                      <input type="date" value={editingEvent ? editingEvent.date : newEvent.date} onChange={e => editingEvent ? setEditingEvent({ ...editingEvent, date: e.target.value }) : setNewEvent({ ...newEvent, date: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Category</label>
                      <select value={editingEvent ? editingEvent.category : newEvent.category} onChange={e => editingEvent ? setEditingEvent({ ...editingEvent, category: e.target.value }) : setNewEvent({ ...newEvent, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Location</label>
                      <input value={editingEvent ? editingEvent.location : newEvent.location} onChange={e => editingEvent ? setEditingEvent({ ...editingEvent, location: e.target.value }) : setNewEvent({ ...newEvent, location: e.target.value })} placeholder="e.g. Cotton University" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Description</label>
                      <textarea rows={3} value={editingEvent ? editingEvent.description : newEvent.description} onChange={e => editingEvent ? setEditingEvent({ ...editingEvent, description: e.target.value }) : setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Brief description of the event..." style={{ resize: "vertical" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    {editingEvent ? (
                      <>
                        <button className="btn-primary" onClick={handleUpdateEvent}>Save Changes</button>
                        <button className="btn-secondary" onClick={() => setEditingEvent(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn-primary" onClick={handleAddEvent}>Add Event</button>
                    )}
                  </div>
                </div>

                {/* EVENT LIST */}
                <h3 style={{ fontSize: 20, marginBottom: 16 }}>All Events ({events.length})</h3>
                {events.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontFamily: "'Source Sans 3', sans-serif" }}>No events yet. Add one above!</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[...events].sort((a, b) => new Date(b.date) - new Date(a.date)).map(evt => (
                      <div key={evt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: isUpcoming(evt.date) ? "#f0f8f0" : "#f8f6f0", border: `1px solid ${isUpcoming(evt.date) ? "#a8d8a8" : "#e8e0d0"}`, borderLeft: `4px solid ${categoryColors[evt.category] || "#c8932a"}` }}>
                        <div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888", marginBottom: 2 }}>{formatDate(evt.date)} · {evt.category} {isUpcoming(evt.date) ? "✅ Upcoming" : "📁 Past"}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>{evt.title}</div>
                          {evt.location && <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#888" }}>📍 {evt.location}</div>}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => setEditingEvent({ ...evt })} style={{ background: "#1a2540", color: "white", border: "none", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'Source Sans 3', sans-serif" }}>Edit</button>
                          <button onClick={() => handleDeleteEvent(evt.id)} style={{ background: "#c0392b", color: "white", border: "none", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'Source Sans 3', sans-serif" }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
