import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* HERO SECTION WITH AI BANNER */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        {/* Background Banner */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('/hero_banner.png')` }}
        />
        {/* Gradient Overlay for blending */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mt-10">
          <div className="inline-block animate-float">
            <span className="px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-500 text-emerald-400 text-sm font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              Next Generation Library
            </span>
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-black tracking-tighter uppercase font-display bg-gradient-to-r from-emerald-300 via-teal-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse">
            SMART LIBRARY <br /> <span className="text-white drop-shadow-none font-sans lowercase text-4xl md:text-6xl font-light">management matrix</span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-emerald-100/80 max-w-2xl mx-auto font-light tracking-wide backdrop-blur-sm bg-slate-900/30 p-4 rounded-xl border border-white/5">
            Step into the future. Digitize your collection, analyze data in real-time, and manage everything through an immersive interface.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-transparent font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 animate-neon-pulse bg-slate-900/80 backdrop-blur-xl"
            >
              <span className="relative z-10 text-emerald-400 group-hover:text-emerald-900 transition-colors duration-300 uppercase tracking-widest font-display">Initialize System</span>
              <div className="absolute inset-0 bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>

            <Link
              to="/books"
              className="px-8 py-4 rounded-xl font-bold text-lg text-white border-2 border-white/20 hover:border-emerald-400 hover:bg-emerald-900/20 hover:text-emerald-300 transition-all duration-300 backdrop-blur-md uppercase tracking-widest font-display shadow-[0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              Browse Data
            </Link>
          </div>
        </div>
      </section>

      {/* CRAZY STATS GRID */}
      <section className="relative z-10 -mt-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            ["500+", "Datacubes"],
            ["300+", "Users"],
            ["50+", "Admins"],
            ["24/7", "Uptime"],
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500 hover:bg-slate-800 transition-all duration-500 group overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-500" />
              <h2 className="text-4xl md:text-5xl font-black text-emerald-400 font-display drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-110 transform transition-transform duration-300 origin-left">
                {item[0]}
              </h2>
              <p className="mt-2 text-slate-400 font-medium tracking-widest uppercase text-sm group-hover:text-emerald-200 transition-colors">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GLOWING FEATURES */}
      <section className="py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-emerald-900/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase font-display tracking-tight">
              System <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">Capabilities</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              [" Quantum Storage", "Holographic indexing of all physical and digital assets."],
              [" Neural Sync", "Track user borrowing patterns with advanced algorithms."],
              [" Overseer Matrix", "God-eye view of all library operations and analytics."],
              [" Biometric Login", "Military-grade role based authentication."],
              [" Hyper Search", "Sub-millisecond data retrieval engine."],
              [" Cloud Nexus", "Decentralized MongoDB powered infrastructure."],
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:-translate-y-3 hover:bg-slate-800/80 hover:border-emerald-500/50 transition-all duration-500 group shadow-lg shadow-black/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] relative overflow-hidden"
              >
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-400/40 transition-all duration-500" />

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors font-display tracking-wide relative z-10">{f[0]}</h3>
                <p className="mt-4 text-slate-400 leading-relaxed font-light relative z-10">{f[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEON CTA */}
      <section className="relative py-32 border-t border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black uppercase font-display mb-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Ready to <span className="text-emerald-400">Upgrade</span>?
          </h2>
          <p className="text-xl text-slate-300 mb-12 font-light">
            Join the matrix. Initialize your digitized library ecosystem today.
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-5 bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl uppercase tracking-widest font-display hover:scale-110 hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.9)]"
          >
            Access Terminal
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
