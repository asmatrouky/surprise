import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const COLORS = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6BD6","#FF922B","#CC5DE8","#20C997"]

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function useConfetti(active) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const spawn = () => {
      for (let i = 0; i < 120; i++) {
        particles.current.push({
          x: randomBetween(0, canvas.width),
          y: randomBetween(-20, -200),
          w: randomBetween(8, 16),
          h: randomBetween(4, 8),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: randomBetween(-3, 3),
          vy: randomBetween(2, 6),
          rot: randomBetween(0, 360),
          rotSpeed: randomBetween(-4, 4),
          opacity: 1,
        })
      }
    }

    spawn()
    const spawnInterval = setInterval(spawn, 1800)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter(p => p.opacity > 0.05)
      for (const p of particles.current) {
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotSpeed
        p.vy += 0.08
        if (p.y > canvas.height - 60) p.opacity -= 0.02
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      clearInterval(spawnInterval)
      cancelAnimationFrame(animRef.current)
    }
  }, [active])

  return canvasRef
}

export default function BirthdayScreen({ onNext }) {
  const [phase, setPhase] = useState(0)
  const canvasRef = useConfetti(phase >= 1)

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 400)
    return () => clearTimeout(t)
  }, [])


  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ fontFamily: "'Arial Rounded MT Bold', 'Nunito', sans-serif" }}
    >
      {/* Fond — collage photo sans filtre */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/collage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay très léger pour que le texte reste lisible */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "rgba(0,0,0,0.25)" }}
      />

      {/* Confettis */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" />

      {/* Flash blanc */}
      {phase === 0 && (
        <motion.div
          className="absolute inset-0 bg-white z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Contenu */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-6 text-center">

        {phase >= 1 && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="text-6xl"
          >
            🎂🎉🎈
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 10, delay: 0.1 }}
            className="text-6xl font-black tracking-tight leading-none"
            style={{ color: "#FF6B6B", textShadow: "3px 3px 0px #FFD93D, 6px 6px 0px rgba(0,0,0,0.3)" }}
          >
            JOYEUX
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 10, delay: 0.35 }}
            className="text-5xl font-black tracking-tight leading-none"
            style={{ color: "#ffffff", textShadow: "3px 3px 0px #4D96FF, 6px 6px 0px rgba(0,0,0,0.3)" }}
          >
            ANNIVERSAIRE
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
            className="text-4xl font-black"
            style={{ color: "#FFD93D", textShadow: "2px 2px 0px #FF922B, 4px 4px 0px rgba(0,0,0,0.3)" }}
          >
            Mon amouuuur ! 🥳
          </motion.div>
        )}

   

        {phase >= 1 && ["🎁","🎊","🎈","✨","🎀","💫"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl pointer-events-none select-none"
            style={{ left: `${10 + i * 15}%`, top: `${5 + (i % 3) * 25}%` }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-10, -30, -10, -30] }}
            transition={{ delay: 0.5 + i * 0.15, duration: 3, repeat: Infinity, repeatDelay: i * 0.3 }}
          >
            {emoji}
          </motion.span>
        ))}

        {phase >= 1 && (
          <motion.button
            onClick={onNext}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="mt-4 px-8 py-4 rounded-full text-white font-black text-lg"
            style={{ background: "linear-gradient(135deg, #FF6B6B, #FF922B)", boxShadow: "0 8px 24px rgba(255,107,107,0.5)" }}
          >
            Ouvrir mes cadeaux 🎁
          </motion.button>
        )}
      </div>
    </div>
  )
}
