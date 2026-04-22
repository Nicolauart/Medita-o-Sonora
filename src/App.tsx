import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Moon, 
  Wind, 
  Zap, 
  Smartphone,
  Music,
  Youtube as LucideYoutube,
  Clock,
  LucideIcon
} from "lucide-react";
import { FaSpotify, FaYoutube, FaApple } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";

// --- Types ---
interface Playlist {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  tracks: number;
  cover: string;
  featured: boolean;
}

// --- Components ---

const PhoneMockup = () => {
  return (
    <div className="relative mx-auto w-64 h-[500px] bg-[#0c0d12] rounded-[40px] border-8 border-[#1a1c24] shadow-2xl overflow-hidden flex flex-col">
      <div className="h-6 w-24 bg-[#1a1c24] mx-auto rounded-b-2xl mb-4" />
      <div className="px-6 flex flex-col gap-4">
        <div className="text-sm font-serif font-bold text-white/90">Meditação Sonora</div>
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 relative">
          <img 
            src="/hero-meditation.png" 
            alt="Now Playing" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to a themed image if the file hasn't been uploaded yet or naming is causing issues
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/gold_meditation/300/300";
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">Tocando Agora</div>
            <div className="text-sm font-bold text-white">Chama da Conquista 888 Hz</div>
          </div>
        </div>
        <div className="space-y-3 px-1 mt-[5px] ml-0">
          {[
            { title: "Sueño Profundo y Purificador 528 Hz", time: "8:00:00", img: "/track-cortisol.png" },
            { title: "Sono Restaurador 432 Hz", time: "10:00:00", img: "/track-meditation-1.png" },
            { title: "Suenõ Curativo 528 Hz", time: "12:00:00", img: "/track-meditation-2.png" }
          ].map((track, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03]">
              <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden">
                <img 
                  src={track.img} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/sleep${i}/80`;
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold line-clamp-1">{track.title}</div>
                <div className="text-[8px] text-white/30">{track.time}</div>
              </div>
              <div className="flex gap-0.5 items-end h-2">
                <motion.div animate={{ height: [2, 6, 2] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} className="w-0.5 bg-white/40" />
                <motion.div animate={{ height: [4, 8, 4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} className="w-0.5 bg-white/40" />
                <motion.div animate={{ height: [3, 7, 3] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.3 }} className="w-0.5 bg-white/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 bg-white/[0.05] border-t border-white/5 flex items-center justify-between px-6">
        <Music size={14} className="opacity-40" />
        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
          <Play size={12} fill="currentColor" />
        </div>
        <Smartphone size={14} className="opacity-40" />
      </div>
    </div>
  );
};

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white/[0.02] rounded-[40px] overflow-hidden hover:bg-white/[0.04] transition-all duration-700 border border-white/5"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <img
          src={playlist.cover}
          alt={playlist.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#03040a] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play size={20} className="text-white/80 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-10 text-center">
        <h3 className="font-serif text-2xl font-bold text-white mb-3">{playlist.title}</h3>
        <p className="text-white/30 text-sm italic font-medium leading-relaxed">{playlist.description}</p>
      </div>
    </motion.div>
  );
};

const StatCounter = ({ target, label, icon: Icon }: { target: number; label: string; icon: LucideIcon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const end = target;
          const duration = 2000;
          const startTime = performance.now();

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="p-8 rounded-[40px] bg-linear-to-br from-[#104d47] to-[#020308] border border-white/5 group hover:border-white/20 transition-all duration-1000 relative overflow-hidden flex flex-col justify-between aspect-[2.2/1] shadow-[0_0_40px_rgba(16,77,71,0.15)] hover:shadow-[0_0_60px_rgba(16,77,71,0.3)]">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/90 group-hover:scale-110 transition-transform duration-700 backdrop-blur-sm shadow-inner">
        <Icon size={20} />
      </div>
      
      <div className="relative z-10 w-full text-left">
        <div className="font-serif text-5xl font-bold text-white mb-2 tracking-tighter">
          {count}%
        </div>
        <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-[0.25em] max-w-[220px]">
          {label}
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  const carouselItems = [
    { src: "reparador-528.png", label: "Reparador 528Hz" },
    { src: "restaurador-432.png", label: "Restaurador 432Hz" },
    { src: "curativo-528.png", label: "Curativo 528Hz" },
    { src: "cortisol-detox.png", label: "Cortisol Detox" },
    { src: "sono-profundo.png", label: "Sono Profundo" },
    { src: "reduzir-cortisol.png", label: "Reduzir Cortisol" }
  ];
  const [centerIndex, setCenterIndex] = useState(2);

  useEffect(() => {
    fetch(`/api/playlists?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => setPlaylists(data.data))
      .catch(err => console.error("Error fetching playlists:", err));
  }, [activeCategory]);

  const categories = [
    { id: "all", label: "All Rest" },
    { id: "sono", label: "Sleep" },
    { id: "meditacao", label: "Guided" },
    { id: "natureza", label: "Nature" },
    { id: "sonoro", label: "Atmospheres" },
  ];

  return (
    <div className="min-h-screen bg-[#03040a] text-white font-sans selection:bg-white/10 selection:text-white">
      {/* --- Ambient background --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[1000px] h-[1000px] bg-radial from-[#1e1a3a] to-transparent opacity-10 blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[800px] h-[800px] bg-radial from-[#121b2d] to-transparent opacity-20 blur-[120px]" />
      </div>

      <nav className="fixed top-0 inset-x-0 z-50 h-24 flex items-center px-12 justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white/5">
             <img 
               src="/logo.png" 
               alt="Logo" 
               className="w-full h-full object-cover" 
               referrerPolicy="no-referrer" 
               onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/sound_zen/100/100"; }}
             />
           </div>
           <span className="font-serif text-xl font-bold tracking-tight">Meditação Sonora</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40">
          <a href="#plataformas" className="hover:text-white transition-colors">Plataformas</a>
          <a href="#playlists" className="hover:text-white transition-colors">Playlists</a>
          <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
        </div>
        <motion.a 
          href="https://open.spotify.com/intl-pt/artist/5NJXbvpRnlTAqZ5neNTWGT"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 rounded-full border border-white/10 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all"
        >
          Ouvir Agora
        </motion.a>
      </nav>

      <main className="relative z-10 pt-24">
        {/* --- Hero Section --- */}
        <section className="relative px-6 py-40 text-center">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <h1 className="font-serif text-7xl md:text-[110px] font-bold tracking-tight mb-10 leading-[0.88]">
                O som certo pode<br />
                mudar suas noites
              </h1>
              <p className="text-xl md:text-2xl text-white/40 mb-14 font-medium tracking-wide">
                Experiências sonoras guiadas pela ciência para um sono profundo e restaurador.
              </p>

              <div className="flex flex-wrap justify-center gap-5 mb-20">
                <motion.a 
                  href="https://open.spotify.com/playlist/0GVRSIFGDPZmgxStQtESV3"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-black rounded-full font-bold flex items-center gap-3 transition-shadow hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                  <FaSpotify size={20} /> Ouvir agora no Spotify
                </motion.a>
                <motion.a 
                   href="https://music.apple.com/br/artist/medita%C3%A7%C3%A3o-sonora/1833933357"
                   target="_blank"
                   rel="noopener noreferrer"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-10 py-5 bg-white text-black rounded-full font-bold flex items-center gap-3 transition-shadow hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                  <SiApplemusic size={20} /> Ouvir no Apple Music
                </motion.a>
              </div>

              <div className="mb-20 flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">
                <div className="flex -space-x-3 mr-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#03040a] bg-white/10 overflow-hidden">
                      <img src={`https://picsum.photos/seed/sleep_user${i}/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                1M+ Ouvintes Mensais
              </div>

              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10" />
                <PhoneMockup />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- Tagline Section --- */}
        <section className="py-32 px-6 bg-white/[0.01]">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
              className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight"
            >
              <span className="text-white/20">No Meditação Sonora criamos</span> <strong>experiências sonoras</strong><br />
              <span className="text-white/20 font-light">que guiam sua mente ao silêncio</span><br />
              <span className="text-white/20">e seu corpo ao</span> <strong>descanso profundo — de forma natural.</strong>
            </motion.h2>
          </div>
        </section>

        {/* --- Listen Anywhere Section --- */}
        <section id="plataformas" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-24">
              <h3 className="font-serif text-6xl font-bold mb-6 tracking-tight">Ouça em qualquer lugar</h3>
              <p className="text-white/20 tracking-[0.3em] uppercase text-[10px] font-bold">O descanso perfeito sempre ao seu alcance.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Ouvir agora no Spotify", icon: FaSpotify, url: "https://open.spotify.com/playlist/0GVRSIFGDPZmgxStQtESV3" },
                { name: "Ouvir no Apple Music", icon: SiApplemusic, url: "https://music.apple.com/br/artist/medita%C3%A7%C3%A3o-sonora/1833933357" },
                { name: "Assistir no YouTube", icon: FaYoutube, url: "#" }
              ].map((plat, i) => (
                <motion.a 
                  key={i} 
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="p-8 rounded-[40px] bg-linear-to-br from-[#104d47] to-[#020308] border border-white/5 border-solid group hover:border-white/20 transition-all duration-1000 cursor-pointer h-[130px] w-[301px] flex flex-col justify-between shadow-[0_0_40px_rgba(16,77,71,0.15)] hover:shadow-[0_0_60px_rgba(16,77,71,0.3)] text-left pl-[32px] m-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/90 group-hover:scale-110 transition-transform duration-700 backdrop-blur-sm shadow-inner">
                    <plat.icon size={20} />
                  </div>
                  <div className="text-sm font-bold text-white/90 group-hover:translate-x-2 transition-transform duration-700 font-sans tracking-tight">{plat.name}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* --- Playlists Gallery --- */}
        <section id="playlists" className="py-40 px-6 bg-black">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="font-serif text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tighter">Mais de 50 experiências sonoras para transformar suas noites</h2>
              <p className="text-white/30 text-xl font-medium leading-relaxed max-w-2xl mx-auto">De melodias suaves a paisagens naturais, cada playlist foi pensada para guiar você ao descanso profundo.</p>
            </div>

            <div className="relative h-[550px] md:h-[700px] flex items-center justify-center">
              <div className="relative w-full max-w-6xl h-full flex items-center justify-center px-4 overflow-visible">
                <AnimatePresence mode="popLayout" initial={false}>
                  {[-2, -1, 0, 1, 2].map((offset) => {
                    const itemIndex = ((centerIndex + offset) % carouselItems.length + carouselItems.length) % carouselItems.length;
                    const item = carouselItems[itemIndex];
                    const isActive = offset === 0;
                    const isLeft = offset < 0;
                    const isRight = offset > 0;
                    const dist = Math.abs(offset);

                    let xPos = "0%";
                    let scale = 1;
                    let rotate = 0;
                    let opacity = 1;
                    let zIndex = 30 - dist * 10;
                    let blur = "0px";
                    let size = "320px"; // Center size

                    if (dist === 1) {
                      xPos = isLeft ? "-65%" : "65%";
                      scale = 0.85;
                      rotate = isLeft ? -5 : 5;
                      opacity = 0.8;
                      blur = "0px";
                      size = "280px";
                    } else if (dist === 2) {
                      xPos = isLeft ? "-120%" : "120%";
                      scale = 0.7;
                      rotate = isLeft ? -10 : 10;
                      opacity = 0.4;
                      blur = "2px";
                      size = "240px";
                    }

                    return (
                      <motion.div
                        key={centerIndex + offset}
                        initial={{ opacity: 0, x: isLeft ? "-150%" : "150%", scale: 0.5 }}
                        animate={{
                          x: xPos,
                          scale: scale,
                          rotate: rotate,
                          opacity: opacity,
                          zIndex: zIndex,
                        }}
                        exit={{ opacity: 0, x: isLeft ? "150%" : "-150%", scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={() => setCenterIndex(prev => prev + offset)}
                        className={`absolute aspect-square rounded-[40px] overflow-hidden cursor-pointer transition-all duration-500 group shadow-2xl`}
                        style={{ 
                          width: size,
                          filter: `blur(${blur})`,
                          border: isActive ? "1px solid rgba(255,255,255,0.2)" : "none"
                        }}
                      >
                          <img 
                            src={item.src} 
                            className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-100 group-hover:scale-110' : 'scale-110'}`} 
                            referrerPolicy="no-referrer" 
                            onError={(e) => { 
                                const target = e.target as HTMLImageElement;
                                target.src = `https://picsum.photos/seed/${item.label.replace(/\s+/g, '_')}/800/800`;
                                target.onerror = null; 
                            }}
                          />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-40">
                <motion.a 
                  href="https://open.spotify.com/user/31tterapsjm63mvigvuncxufi5me"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-black rounded-full font-bold inline-flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-white/20 transition-all border border-white/10 text-lg"
                >
                  <FaSpotify size={24} /> Explore nossas Playlists
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section id="sobre" className="py-40 px-6 bg-white/[0.01]">
          <div className="container mx-auto">
            <div className="text-center mb-28">
              <h2 className="font-serif text-6xl font-bold mb-6 tracking-tight">Por que ouvir Meditação Sonora?</h2>
              <p className="text-white/20 uppercase tracking-[0.3em] text-[10px] font-bold tracking-widest">Desperte renovado. Todos os dias.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <StatCounter 
                target={92} 
                label="adormeceram mais rápido e tiveram um sono mais profundo" 
                icon={Moon} 
              />
              <StatCounter 
                target={89} 
                label="sentiram mais calma e menos ansiedade ao longo do dia" 
                icon={Wind} 
              />
              <StatCounter 
                target={83} 
                label="acordaram com mais energia e sensação real de descanso" 
                icon={Zap} 
              />
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-48 px-6 text-center">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-serif text-6xl md:text-8xl font-bold mb-20 leading-tight tracking-tight">
              Escolha <span className="text-white/10">uma</span> playlist. <span className="text-white/30">Coloque seus fones.</span><br />
              Feche os olhos… <span className="text-white/20">e deixe o som cuidar do resto.</span>
            </h2>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-24 px-12 border-t border-white/5 bg-[#010206]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white/5">
                <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/sound_zen/100/100"; }}
                />
             </div>
             <span className="font-serif text-2xl font-bold tracking-tight">Meditação Sonora</span>
          </div>
          
          <div className="flex gap-14 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
            <a href="https://open.spotify.com/intl-pt/artist/5NJXbvpRnlTAqZ5neNTWGT" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><FaSpotify /> Spotify</a>
            <a href="https://music.apple.com/br/artist/medita%C3%A7%C3%A3o-sonora/1833933357" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><SiApplemusic /> Apple Music</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><FaYoutube /> YouTube</a>
          </div>

          <p className="text-[10px] tracking-[0.2em] font-bold text-white/10 uppercase">© 2026 Meditação Sonora • All Science</p>
        </div>
      </footer>
    </div>
  );
}
