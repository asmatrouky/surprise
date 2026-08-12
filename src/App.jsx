import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BirthdayScreen from "./screens/BirthdayScreen"
import GiftsScreen from "./screens/GiftsScreen"

const PASSWORD = "170226"

const Wrapper = ({ children, keyName }) => (
  <motion.div
    key={keyName}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center gap-6 px-6 w-full max-w-sm"
  >
    {children}
  </motion.div>
)

const QuestionHeader = ({ num, total, title }) => (
  <div className="text-center">
    <div className="text-white text-xs tracking-widest mb-1 opacity-70">VÉRIFICATION — ÉTAPE {num}/{total}</div>
    <div className="text-white text-xl font-bold tracking-wider">{title}</div>
  </div>
)

const Terminal = ({ children }) => (
  <div className="w-full bg-black border border-gray-700 rounded p-4 space-y-2">
    <div className="text-gray-400 text-xs">{'>'} INTERROGATOIRE EN COURS...</div>
    <div className="text-white text-sm leading-relaxed mt-2 tracking-wide">{children}</div>
    <div className="text-gray-700 text-xs mt-1">— Répondre avec précision. Toute approximation sera détectée.</div>
  </div>
)

const SubmitBtn = ({ onClick, label = "SOUMETTRE LA RÉPONSE" }) => (
  <button
    onClick={onClick}
    className="w-full h-12 border border-gray-700 text-white tracking-widest text-sm rounded hover:bg-gray-900 hover:border-white active:scale-95 transition-all"
  >
    {label}
  </button>
)

const MuteBtn = ({ muted, onToggle }) => (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    onClick={onToggle}
    className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xl"
    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
  >
    {muted ? "🔇" : "🔊"}
  </motion.button>
)

export default function App() {
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [step, setStep] = useState(0)
  const [scanLine, setScanLine] = useState(0)
  const [blink, setBlink] = useState(true)
  const [bootText, setBootText] = useState([])
  const [sliderValue, setSliderValue] = useState(0)
  const [sliderError, setSliderError] = useState(false)
  const [prenomInput, setPrenomInput] = useState("")
  const [prenomError, setPrenomError] = useState(false)
  const [prenomErrorMsg, setPrenomErrorMsg] = useState("")
  const [fesseChoice, setFesseChoice] = useState(null)
  const [fesseRevealed, setFesseRevealed] = useState(false)
  const [muted, setMuted] = useState(false)

  const audioRef = useRef(null)

  const bootLines = [
    "> SYSTÈME CLASSIFIÉ — NIVEAU ALPHA",
    "> Initialisation du protocole sécurisé...",
    "> Chiffrement AES-256 activé",
    "> Connexion au serveur central...",
    "> En attente d'authentification.",
  ]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setBootText(prev => [...prev, bootLines[i]])
        i++
      } else clearInterval(interval)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setScanLine(v => (v + 1) % 100), 20)
    return () => clearInterval(interval)
  }, [])

  // Démarre la musique dès l'écran anniversaire et continue sur les suivants
  useEffect(() => {
    if (step >= 4) {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = 0.7
      audio.loop = true
      audio.play().catch(() => {})
    }
  }, [step])

  const handleKey = (digit) => {
    if (input.length >= 6) return
    const next = input + digit
    setInput(next)
    if (next.length === 6) {
      setTimeout(() => {
        if (next === PASSWORD) {
          setStep(1)
        } else {
          setError(true)
          setTimeout(() => { setInput(""); setError(false) }, 800)
        }
      }, 200)
    }
  }

  const handleDelete = () => { setInput(input.slice(0, -1)); setError(false) }

  const handleSliderConfirm = () => {
    if (sliderValue < 99) {
      setSliderError(true)
      setTimeout(() => setSliderError(false), 1500)
    } else {
      setStep(2)
    }
  }

  const handlePrenomConfirm = () => {
    const val = prenomInput.trim().toLowerCase()
    if (val === "mustapha" || val === "mouss") {
      setStep(3)
    } else if (val === "") {
      setPrenomErrorMsg("⚠ Aucune réponse détectée. Identifiez-vous, Agent.")
      setPrenomError(true)
      setTimeout(() => setPrenomError(false), 2000)
    } else {
      setPrenomErrorMsg("⛔ RÉPONSE INCORRECTE — Indice : c'est toi, Agent.")
      setPrenomError(true)
      setTimeout(() => setPrenomError(false), 2000)
    }
  }

  const handleFesseChoice = (choice) => {
    setFesseChoice(choice)
    setTimeout(() => setFesseRevealed(true), 600)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.volume = 0.7
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
    setMuted(m => !m)
  }

  const sliderColor = sliderValue === 0 ? "#374151"
    : sliderValue < 50 ? "#6b7280"
    : sliderValue < 99 ? "#d1d5db"
    : "#ffffff"

  if (step === 4) return (
    <>
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      <MuteBtn muted={muted} onToggle={toggleMute} />
      <BirthdayScreen onNext={() => setStep(5)} />
    </>
  )

  if (step === 5) return (
    <>
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      <MuteBtn muted={muted} onToggle={toggleMute} />
      <GiftsScreen />
    </>
  )

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      <div
        className="relative min-h-dvh bg-black overflow-hidden flex flex-col items-center justify-center py-12"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {/* Scan line */}
        <div
          className="pointer-events-none absolute left-0 w-full h-1 opacity-10 z-50"
          style={{ top: `${scanLine}%`, background: "linear-gradient(to bottom, transparent, #ffffff, transparent)", boxShadow: "0 0 8px #ffffff" }}
        />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        {/* Corners */}
        {["top-4 left-4 border-t-2 border-l-2", "top-4 right-4 border-t-2 border-r-2", "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"]
          .map((cls, i) => <div key={i} className={`absolute w-8 h-8 border-white opacity-60 ${cls}`} />)}

        <AnimatePresence mode="wait">

          {/* ÉCRAN 0 — PIN */}
          {step === 0 && (
            <Wrapper keyName="pin">
              <div className="text-center">
                <div className="text-white text-xs tracking-widest mb-1 opacity-70">AGENT SECRET</div>
                <div className="text-white text-2xl font-bold tracking-wider">⬡ ACCÈS RESTREINT ⬡</div>
                <div className="text-gray-400 text-xs tracking-widest mt-1">DOSSIER CLASSIFIÉ — CODE REQUIS</div>
              </div>

              <div className="w-full bg-black border border-gray-700 rounded p-3 text-gray-400 text-xs space-y-1 min-h-[100px]">
                {bootText.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{line}</motion.div>
                ))}
                {bootText.length === bootLines.length && <span className="text-white">{blink ? "█" : " "}</span>}
              </div>

              <motion.div animate={error ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }} className="flex gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`w-10 h-12 border flex items-center justify-center text-xl font-bold transition-all duration-150 ${
                    error ? "border-red-500 text-red-500 bg-red-950"
                    : input[i] ? "border-white text-white bg-gray-900"
                    : "border-gray-700 text-gray-700"}`}>
                    {input[i] ? "•" : "—"}
                  </div>
                ))}
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs tracking-widest">
                  ⚠ CODE INCORRECT — ACCÈS REFUSÉ
                </motion.div>
              )}

              <div className="grid grid-cols-3 gap-3 w-full">
                {[1,2,3,4,5,6,7,8,9].map(d => (
                  <button key={d} onClick={() => handleKey(String(d))}
                    className="h-14 border border-gray-700 text-white text-xl font-bold rounded active:bg-gray-800 active:scale-95 transition-all hover:border-white hover:bg-gray-900">
                    {d}
                  </button>
                ))}
                <button onClick={handleDelete} className="h-14 border border-gray-700 text-gray-400 text-sm rounded active:bg-gray-900 transition-all hover:border-gray-400">⌫</button>
                <button onClick={() => handleKey("0")} className="h-14 border border-gray-700 text-white text-xl font-bold rounded active:bg-gray-800 active:scale-95 transition-all hover:border-white hover:bg-gray-900">0</button>
                <div />
              </div>
              <div className="text-gray-800 text-xs tracking-widest">PROTOCOLE V2.6 — CHIFFRÉ</div>
            </Wrapper>
          )}

          {/* ÉCRAN 1 — SLIDER */}
          {step === 1 && (
            <Wrapper keyName="slider">
              <QuestionHeader num={1} total={3} title="QUESTION DE SÉCURITÉ" />
              <Terminal>" À quel point tu aimes ta femme ?"</Terminal>

              <div className="w-full space-y-3">
                <div className="flex justify-between text-xs text-gray-700 tracking-widest">
                  <span>PAS DU TOUT</span><span>INFINIMENT</span>
                </div>
                <input type="range" min="0" max="100" value={sliderValue}
                  onChange={e => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 rounded appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${sliderColor} ${sliderValue}%, #374151 ${sliderValue}%)`, accentColor: sliderColor }}
                />
                <div className="text-center">
                  {sliderValue === 0 && <span className="text-gray-700 text-xs tracking-widest">[ EN ATTENTE DE RÉPONSE ]</span>}
                  {sliderValue > 0 && sliderValue < 30 && <span className="text-red-500 text-xs tracking-widest">⚠ RÉPONSE INSUFFISANTE</span>}
                  {sliderValue >= 30 && sliderValue < 70 && <span className="text-yellow-600 text-xs tracking-widest">~ RÉPONSE SUSPECTE ~</span>}
                  {sliderValue >= 70 && sliderValue < 99 && <span className="text-gray-400 text-xs tracking-widest">↑ PRESQUE... CONTINUE</span>}
                  {sliderValue >= 99 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-xs tracking-widest">✓ RÉPONSE VALIDÉE — INFINIMENT</motion.span>}
                </div>
                <div className="flex justify-center text-2xl">
                  {sliderValue === 0 && "🥶"}
                  {sliderValue > 0 && sliderValue < 30 && "😬"}
                  {sliderValue >= 30 && sliderValue < 70 && "🤔"}
                  {sliderValue >= 70 && sliderValue < 99 && "🔥"}
                  {sliderValue >= 99 && "❤️‍🔥"}
                </div>
              </div>

              <AnimatePresence>
                {sliderError && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full border border-red-500 bg-red-950 rounded p-3 text-center">
                    <div className="text-red-400 text-xs tracking-widest font-bold">⛔ RÉPONSE INCORRECTE</div>
                    <div className="text-red-600 text-xs mt-1">La réponse correcte est : INFINIMENT.<br />Remets la jauge à fond, Agent Mouss.</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <SubmitBtn onClick={handleSliderConfirm} />
              <div className="text-gray-800 text-xs tracking-widest">PROTOCOLE V2.6 — CHIFFRÉ</div>
            </Wrapper>
          )}

          {/* ÉCRAN 2 — PRÉNOM */}
          {step === 2 && (
            <Wrapper keyName="prenom">
              <QuestionHeader num={2} total={3} title="IDENTIFICATION REQUISE" />
              <Terminal>" Quel est le prénom de l'homme le plus chanceux du monde ?"</Terminal>

              <input
                type="text"
                value={prenomInput}
                onChange={e => setPrenomInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handlePrenomConfirm()}
                placeholder="ENTREZ LE PRÉNOM..."
                className="w-full bg-black border border-gray-700 text-white text-sm tracking-widest px-4 py-3 rounded outline-none focus:border-white placeholder-gray-700 uppercase"
              />

              <AnimatePresence>
                {prenomError && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full border border-red-500 bg-red-950 rounded p-3 text-center">
                    <div className="text-red-400 text-xs tracking-widest">{prenomErrorMsg}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <SubmitBtn onClick={handlePrenomConfirm} />
              <div className="text-gray-800 text-xs tracking-widest">PROTOCOLE V2.6 — CHIFFRÉ</div>
            </Wrapper>
          )}

          {/* ÉCRAN 3 — FESSE */}
          {step === 3 && (
            <Wrapper keyName="fesse">
              <QuestionHeader num={3} total={3} title="QUESTION SENSIBLE" />
              <Terminal>" Quelle est ta fesse préférée d'Asma ?"</Terminal>

              {!fesseRevealed ? (
                <div className="w-full space-y-3">
                  <div className="text-gray-400 text-xs text-center tracking-widest mb-2">— Choisissez avec soin, Agent Mouss.</div>
                  {["La gauche 🍑", "La droite 🍑"].map((label, i) => (
                    <motion.button key={i} onClick={() => handleFesseChoice(label)} whileTap={{ scale: 0.97 }}
                      className={`w-full h-14 border text-white text-sm tracking-widest rounded transition-all ${
                        fesseChoice === label ? "border-white bg-gray-800" : "border-gray-700 hover:border-gray-400 hover:bg-gray-900"}`}>
                      {label}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-4 text-center">
                  <div className="text-4xl">🍑🍑</div>
                  <div className="w-full bg-black border border-gray-700 rounded p-4">
                    <div className="text-gray-400 text-xs mb-2">{'>'} ANALYSE EN COURS...</div>
                    <div className="text-white text-sm leading-relaxed tracking-wide">
                      Dossier déclassifié, Agent Mouss.<br /><br />
                      La vérité est la suivante :<br />
                      <span className="font-bold">elle les aime autant l'une que l'autre.</span><br /><br />
                      <span className="text-gray-400 text-xs">Mais on passe pour cette fois. 😏</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(4)}
                    className="w-full h-12 border border-gray-700 text-white tracking-widest text-sm rounded hover:bg-gray-900 hover:border-white active:scale-95 transition-all">
                    CONTINUER LE DOSSIER →
                  </button>
                </motion.div>
              )}

              <div className="text-gray-800 text-xs tracking-widest">PROTOCOLE V2.6 — CHIFFRÉ</div>
            </Wrapper>
          )}

        </AnimatePresence>
      </div>
    </>
  )
}
