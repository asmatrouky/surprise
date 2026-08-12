import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function getSkyStyle(hour) {
  if (hour >= 5 && hour < 8) {
    return { filter: "brightness(0.7) saturate(1.2) sepia(0.3)", overlay: "rgba(255,180,120,0.15)" }
  } else if (hour >= 8 && hour < 12) {
    return { filter: "brightness(1.0) saturate(1.1)", overlay: "rgba(255,255,255,0.03)" }
  } else if (hour >= 12 && hour < 17) {
    return { filter: "brightness(1.1) saturate(1.2)", overlay: "rgba(100,180,255,0.05)" }
  } else if (hour >= 17 && hour < 20) {
    return { filter: "brightness(0.8) saturate(1.4) sepia(0.4) hue-rotate(-10deg)", overlay: "rgba(255,100,50,0.15)" }
  } else if (hour >= 20 && hour < 23) {
    return { filter: "brightness(0.45) saturate(0.9) hue-rotate(20deg)", overlay: "rgba(30,20,80,0.3)" }
  } else {
    return { filter: "brightness(0.2) saturate(0.7) hue-rotate(30deg)", overlay: "rgba(10,10,40,0.5)" }
  }
}

function isAfter2330() {
  const now = new Date()
  return now.getHours() >= 23 && now.getMinutes() >= 30
}

function timeUntil2330() {
  const now = new Date()
  const target = new Date()
  target.setHours(23, 30, 0, 0)
  if (now >= target) return null
  const diff = target - now
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s }
}

// ——— MODAL LETTRE ———
function LetterModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6 overflow-y-auto max-h-[80vh]"
        style={{ background: "#fffdf5", fontFamily: "'Georgia', serif", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)" }}
      >
        <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
        <div className="text-center text-3xl mb-1">💌</div>
        <div className="text-center text-xs text-gray-400 tracking-widest mb-4 uppercase">Une lettre pour toi</div>
        <div className="text-gray-800 text-sm leading-relaxed space-y-3">
          <p>Mon amour,</p>
          <p>Aujourd'hui c'est ton anniversaire, et j'ai tellement de choses à te dire que je ne sais même pas par où commencer.</p>
          <p>Depuis le <strong>17 février</strong>, tu as changé quelque chose dans ma vie. Ce jour-là, sans même que je m'en rende compte, tout a basculé. Tu es entré dans mon quotidien et tu y as apporté une lumière que je ne connaissais pas avant toi. Je suis convaincu d'avoir trouvé mon âme sœur, la personne qui me comprend sans que j'aie besoin de tout expliquer, la personne sur qui je peux compter quoi qu'il arrive, la personne sur qui je peux me reposer en toute confiance, les yeux fermés.</p>
          <p>Tu es tellement doux, gentil, compréhensif, patient avec moi, même dans mes moments les plus difficiles, même quand je ne suis pas facile à vivre. Tu as cette capacité incroyable à me redonner de la force quand rien ne va, à trouver les mots justes quand je doute de tout, y compris de moi-même. Tu me pousses à être la meilleure version de moi-même, pas en me jugeant, mais en croyant en moi, tout simplement, et parfois plus que je ne crois en moi.</p>
          <p>Chaque jour à tes côtés est un cadeau. Tes petites attentions, ta façon de me regarder, tes conseils, tes blagues nulles, tes confidences, tout ça, je le garde précieusement, comme des petits trésors qui font ma vie plus belle.</p>
          <p>Tu m'apprends la patience, la douceur, et surtout, tu m'apprends ce que c'est vraiment que d'aimer et d'être aimé en retour.</p>
          <p>Alors aujourd'hui, en ce jour si spécial qui est le tien, je veux juste te dire merci. Merci d'être toi, merci d'exister, merci de m'avoir choisi et de continuer à me choisir chaque jour. Merci pour tout ce que tu m'apportes, souvent sans même t'en rendre compte.</p>
          <p>Tu mérites tout le bonheur du monde, mon amour, et je te promets de faire de mon mieux, chaque jour, pour te le rendre x1000.</p>
          <p>Joyeux anniversaire, à toi, l'amour de ma vie. Je t'aime, je t'aime, je t'aime, et pour toujours. 💕</p>
          <p className="text-right pt-2">Avec tout mon amour,<br /><strong>Asma</strong> ❤️</p>
        </div>
        <button onClick={onClose} className="mt-5 w-full py-3 rounded-2xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #FF6B6B, #FF922B)" }}>
          Fermer 💌
        </button>
      </motion.div>
    </motion.div>
  )
}

// ——— MODAL RESTO ———
function RestoModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6 text-center"
        style={{ background: "#0a0a1a", boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(100,100,255,0.15)" }}
      >
        <div className="w-10 h-1 rounded-full bg-gray-700 mx-auto mb-4" />
        <div className="relative h-20 mb-3 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-white"
              style={{ left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5 + (i % 3) * 0.5, repeat: Infinity, delay: (i % 5) * 0.3 }} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🌌</div>
        </div>
        <div className="text-white text-xs tracking-widest mb-2 opacity-60">CADEAU N°2 — DÉCLASSIFIÉ</div>
        <div className="text-white text-2xl font-black mb-3" style={{ textShadow: "0 0 20px rgba(150,100,255,0.8)" }}>✨ ON CONTINU L'AVENTURE ✨</div>
        <div className="text-gray-300 text-sm leading-relaxed mb-4 space-y-2">
        <p>Ce soir, on observe l'éclipse ensemble.</p>
        <p>Et après... on continue le voyage. 🌌</p>
        <p className="text-white font-bold">Direction le resto, mais lequel ? C'est une surprise. 😉</p>
        <p className="text-gray-500 text-xs">Tu découvriras où ce soir.</p>
      </div>
        <button onClick={onClose} className="w-full py-3 rounded-2xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          J'ai hâte ! 🌠
        </button>
      </motion.div>
    </motion.div>
  )
}

// ——— MODAL AVION ———
function PlaneModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6 text-center"
        style={{ background: "#0d1b2a", boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(50,150,255,0.2)" }}
      >
        <div className="w-10 h-1 rounded-full bg-gray-700 mx-auto mb-4" />
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="text-6xl mb-3"
        >✈️</motion.div>
        <div className="text-white text-xs tracking-widest mb-2 opacity-60">CADEAU N°3 — TOP SECRET</div>
        <div className="text-white text-2xl font-black mb-3" style={{ textShadow: "0 0 20px rgba(50,150,255,0.8)" }}>TU VAS VOLER 🛩️</div>
        <div className="text-gray-300 text-sm leading-relaxed mb-4 space-y-2">
          <p>J'ai réservé pour toi une <strong className="text-white">initiation au pilotage d'avion</strong>.</p>
          <p>Tu vas tenir les commandes, sentir la liberté à des milliers de mètres d'altitude... ☁️</p>
          <p className="text-blue-300 font-bold">Parce que t'es fait pour toucher les étoiles, Mouss.</p>
          <p className="text-gray-500 text-xs">Les détails arrivent très bientôt. 🎁</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-2xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #06b6d4)" }}>
          WOW ! Je suis prêt ✈️
        </button>
      </motion.div>
    </motion.div>
  )
}

// ——— MODAL VERROUILLÉ ———
function LockedModal({ onClose, countdown }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6 text-center"
        style={{ background: "#111", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}
      >
        <div className="w-10 h-1 rounded-full bg-gray-700 mx-auto mb-4" />
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-5xl mb-3"
        >🔒</motion.div>
        <div className="text-white text-xl font-black mb-1">Ce cadeau est verrouillé</div>
        <div className="text-gray-400 text-sm mb-4">Il s'ouvre à <strong className="text-white">23h30</strong> ce soir...</div>
        {countdown && (
          <div className="flex justify-center gap-3 mb-4">
            {[{ v: countdown.h, l: "h" }, { v: countdown.m, l: "min" }, { v: countdown.s, l: "sec" }].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center">
                <div className="text-white text-2xl font-black w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: "#1a1a2e", border: "1px solid #333" }}>
                  {String(v).padStart(2, "0")}
                </div>
                <div className="text-gray-600 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        )}
        <div className="text-gray-600 text-xs mb-4">Reviens ce soir pour découvrir ta surprise... 🌙</div>
        <button onClick={onClose} className="w-full py-3 rounded-2xl text-white font-bold text-sm"
          style={{ background: "#222", border: "1px solid #333" }}>
          OK, j'attendrai 😤
        </button>
      </motion.div>
    </motion.div>
  )
}

// ——— BOÎTE CADEAU IMAGE ———
function GiftBox({ n, opened, locked, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + n * 0.15, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center gap-2"
    >
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.88 }}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative" }}
      >
        {/* Ombre */}
        <div style={{
          position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
          width: "70%", height: 12, borderRadius: "50%",
          background: "rgba(0,0,0,0.25)", filter: "blur(6px)"
        }} />

        {/* Image cadeau */}
        <motion.div
          animate={
            opened
              ? { scale: [1, 1.15, 0.95, 1], rotate: [0, -8, 8, 0] }
              : locked
              ? {}
              : {
                  y: [0, -6, 0],
                  rotate: [0, -2, 2, -2, 0],
                }
          }
          transition={
            opened
              ? { duration: 0.5 }
              : locked
              ? {}
              : { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: n * 0.4 }
          }
          style={{ position: "relative" }}
        >
          <img
            src="/gift.png"
            alt="cadeau"
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              filter: locked
                ? "grayscale(0.6) brightness(0.7)"
                : opened
                ? "brightness(1.1) drop-shadow(0 0 16px rgba(255,200,50,0.7))"
                : "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
              transition: "filter 0.4s ease",
            }}
          />

          {/* Badge cadenas si verrouillé */}
          {locked && (
            <div style={{
              position: "absolute", top: -6, right: -6,
              width: 28, height: 28, borderRadius: "50%",
              background: "#111", border: "2px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14
            }}>🔒</div>
          )}

          {/* Emoji contenu qui sort au tap */}
          <AnimatePresence>
            {opened && !locked && (
              <>
                <motion.div
                  initial={{ scale: 0, y: 0, opacity: 1 }}
                  animate={{ scale: 1.4, y: -50, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                  style={{
                    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                    fontSize: 30, zIndex: 10,
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
                  }}
                >
                  {n === 1 ? "💌" : n === 2 ? "🌌" : "✈️"}
                </motion.div>

                {/* Particules */}
                {["✨","🎊","⭐","🎉","💫"].map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0,
                      scale: 1.2,
                      x: (i % 2 === 0 ? 1 : -1) * (25 + i * 12),
                      y: -(20 + i * 18)
                    }}
                    transition={{ duration: 0.9, delay: i * 0.06 }}
                    style={{
                      position: "absolute", top: "20%", left: "50%",
                      fontSize: 16, zIndex: 20, pointerEvents: "none"
                    }}
                  >
                    {p}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>

      {/* Sous-label uniquement si verrouillé */}
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + n * 0.15 }}
          className="text-xs text-gray-300 text-center"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          disponible à 23h30
        </motion.div>
      )}
    </motion.div>
  )
}

// ——— ÉCRAN PRINCIPAL ———
export default function GiftsScreen() {
  const [openModal, setOpenModal] = useState(null)
  const [opened, setOpened] = useState([false, false, false])
  const [countdown, setCountdown] = useState(timeUntil2330())
  const [hour, setHour] = useState(new Date().getHours())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(timeUntil2330())
      setHour(new Date().getHours())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleGift = (n) => {
    if (n === 3 && !isAfter2330()) {
      setOpenModal("locked")
      return
    }
    setOpened(prev => { const next = [...prev]; next[n - 1] = true; return next })
    setTimeout(() => setOpenModal(n), 600)
  }

  const boxes = [1, 2, 3]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        fontFamily: "'Arial Rounded MT Bold', 'Nunito', sans-serif",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Fond ciel dynamique */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "url('sky.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: getSkyStyle(hour).filter,
        transition: "filter 2s ease",
      }} />
      {/* Overlay selon l'heure */}
      <div className="absolute inset-0 z-0" style={{
        background: getSkyStyle(hour).overlay,
        transition: "background 2s ease",
      }} />

      <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center w-full">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-white text-3xl font-black mb-1" style={{ textShadow: "0 2px 20px rgba(100,150,255,0.5)" }}>
            Tes cadeaux 🎁
          </div>
          <div className="text-gray-400 text-sm">Appuie sur une boîte pour l'ouvrir</div>
        </motion.div>

        {/* 3 boîtes cadeaux */}
        <div className="flex items-end justify-center gap-6 w-full">
          {boxes.map((n) => (
            <GiftBox
              key={n}
              n={n}
              opened={opened[n - 1]}
              locked={n === 3 && !isAfter2330()}
              onClick={() => handleGift(n)}
            />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-gray-500 text-xs">
          Avec tout mon amour ❤️ — Asma
        </motion.div>
      </div>

      <AnimatePresence>
        {openModal === 1 && <LetterModal onClose={() => setOpenModal(null)} />}
        {openModal === 2 && <RestoModal onClose={() => setOpenModal(null)} />}
        {openModal === 3 && <PlaneModal onClose={() => setOpenModal(null)} />}
        {openModal === "locked" && <LockedModal onClose={() => setOpenModal(null)} countdown={countdown} />}
      </AnimatePresence>
    </div>
  )
}
