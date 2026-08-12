import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './GalaxyScreen.css';

const plates = [
  { name: "Tu m'éblouis", message: "Si je pouvais choisir un endroit sûr, ce serait à tes côtés.", src: '/3.png', hue: 355, pattern: 'heart' },
  { name: 'Pour toi', message: "Pour toi, qui fais battre mon cœur d'une façon unique. Dans chaque souvenir et chaque battement, il y a toi.", hue: 0, pattern: 'heart' },
  { name: 'Sous les étoiles', message: "Cette nuit-là, on a regardé le ciel ensemble, et j'ai compris qu'aucune étoile ne brille autant que tes yeux.", hue: 350, pattern: 'heart' },
  { name: 'Pour toujours', message: "Peu importe combien de vies je dois vivre, dans chacune d'elles je te choisirai. Pour toujours et un jour de plus.", hue: 358, pattern: 'heart' },
  { name: 'Nos aventures', message: "Il n'y a nulle part au monde où je préfère être qu'à tes côtés, à découvrir de nouveaux endroits.", hue: 355, pattern: 'heart' },
  { name: 'Notre premier baiser', message: "Le jour où nos lèvres se sont rencontrées, l'univers entier a retenu son souffle. Depuis, chacun de tes baisers est ma galaxie préférée.", hue: 0, pattern: 'heart' },
  { name: 'L’amour de ma vie', message: "Plus le temps passe ensemble, plus je t'aime.", src: '/5.png', hue: 350, pattern: 'heart' },
  { name: 'Tu es mon refuge', message: "Quand le monde fait trop de bruit, il me suffit de te regarder pour trouver la paix.", hue: 358, pattern: 'heart' },
];

const ambientPhrases = [
  'AMOUR ÉTERNEL ❤️', 'INFINI ∞ ❤️', "JE T'AIME ❤️", 'MON AMOUR ❤️',
  'AMOUR ÉTERNEL ❤️', 'INFINI ∞ ❤️', 'AMOUR DE MA VIE ❤️', 'AMOUR ÉTERNEL ❤️',
  'INFINI ∞ ❤️', 'AMOUR ÉTERNEL ❤️', 'INFINI ∞ ❤️', "JE T'AIME ❤️",
  'MON AMOUR ❤️', 'AMOUR ÉTERNEL ❤️', 'INFINI ∞ ❤️', 'AMOUR DE MA VIE ❤️',
  'AMOUR ÉTERNEL ❤️', 'INFINI ∞ ❤️',
];

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function makePlateCanvas(p, seed, size = 512) {
  const w = size, h = size;
  const cvs = document.createElement('canvas');
  cvs.width = w; cvs.height = h;
  const ctx = cvs.getContext('2d');
  const rng = mulberry32(seed * 9999);

  ctx.clearRect(0, 0, w, h);
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.48);
  bgGrad.addColorStop(0, `hsla(${p.hue}, 90%, 35%, 0.7)`);
  bgGrad.addColorStop(0.5, `hsla(${p.hue}, 85%, 22%, 0.4)`);
  bgGrad.addColorStop(0.85, `hsla(${p.hue}, 80%, 15%, 0.05)`);
  bgGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const c1 = `hsl(${p.hue}, 90%, 60%)`;
  const c2 = `hsl(${(p.hue + 10) % 360}, 85%, 70%)`;
  const c3 = `hsl(${(p.hue + 20) % 360}, 80%, 85%)`;
  const cx = w / 2, cy = h / 2;

  if (p.pattern === 'heart') {
    const heartPath = (scale) => {
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.04) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const px = cx + x * scale, py = cy + y * scale;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    for (let g = 8; g > 0; g--) { ctx.globalAlpha = 0.08; ctx.fillStyle = c2; heartPath(11 + g); ctx.fill(); }
    ctx.globalAlpha = 0.95;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.4);
    grad.addColorStop(0, c3); grad.addColorStop(0.6, c1); grad.addColorStop(1, `hsl(${p.hue}, 90%, 35%)`);
    ctx.fillStyle = grad; heartPath(13); ctx.fill();
    ctx.globalAlpha = 0.4; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(cx - 50, cy - 40, 36, 20, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  for (let i = 0; i < 80; i++) {
    const x = rng() * w, y = rng() * h, r = rng() * 2 + 0.3;
    ctx.globalAlpha = rng() * 0.8 + 0.2; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'destination-in';
  const alphaMask = ctx.createRadialGradient(cx, cy, w * 0.06, cx, cy, w * 0.47);
  alphaMask.addColorStop(0, 'rgba(255,255,255,1)');
  alphaMask.addColorStop(0.75, 'rgba(255,255,255,0.95)');
  alphaMask.addColorStop(0.9, 'rgba(255,255,255,0.25)');
  alphaMask.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = alphaMask; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  return cvs;
}

function createCenteredPlateTexture(src, fallbackCanvas) {
  const size = 1024;
  const cvs = document.createElement('canvas');
  cvs.width = size; cvs.height = size;
  const ctx = cvs.getContext('2d');
  ctx.drawImage(fallbackCanvas, 0, 0, size, size);

  const tex = new THREE.CanvasTexture(cvs);
  tex.anisotropy = 8;
  tex.needsUpdate = true;

  if (!src) return tex;

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => {
    const scale = Math.max(size / image.width, size / image.height);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const drawX = (size - drawW) / 2;
    const drawY = (size - drawH) / 2;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    tex.needsUpdate = true;
  };
  image.src = src;
  return tex;
}

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export default function GalaxyScreen({ onNext }) {
  const canvasRef = useRef(null);
  const startOverlayRef = useRef(null);
  const startButtonRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const msgImgRef = useRef(null);
  const msgImgBgRef = useRef(null);
  const closeBtnRef = useRef(null);
  const continueBtnRef = useRef(null);

  const onNextRef = useRef(onNext);
  useEffect(() => { onNextRef.current = onNext; }, [onNext]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const startOverlay = startOverlayRef.current;
    const startButton = startButtonRef.current;
    const overlay = overlayRef.current;
    const titleEl = titleRef.current;
    const textEl = textRef.current;
    const msgImg = msgImgRef.current;
    const msgImgBg = msgImgBgRef.current;
    const closeBtn = closeBtnRef.current;
    const continueBtn = continueBtnRef.current;

    let disposed = false;
    let rafId = null;
    let experienceStarted = false;
    let experienceStartMs = 0;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.018);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(6, 4, 10);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.enableZoom = true; controls.enablePan = true;
    controls.zoomSpeed = 0.8; controls.rotateSpeed = 0.5; controls.panSpeed = 0.8;
    controls.minDistance = 1.5; controls.maxDistance = 60; controls.dampingFactor = 0.06;

    const parameters = {
      count: 80000, size: 0.017, radius: 8, branches: 4,
      spin: 1, randomness: 0.3, randomnessPower: 3,
      insideColor: '#ff2020', outsideColor: '#4a0000',
      jetCount: 6000,
    };

    let points = null;
    let jetPoints = null;
    let jetVelocities = [];
    let blackHoleMesh = null, accretionMesh = null, accretionMeshHalo = null, accretionPoints = null;
    let hyperspaceGroup = null, hyperspaceRings = [], hyperspaceSpeed = 0.18;

    const generateBlackHole = () => {
      const bhGeometry = new THREE.SphereGeometry(0.3, 64, 64);
      blackHoleMesh = new THREE.Mesh(bhGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
      scene.add(blackHoleMesh);

      accretionMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.85, 64, 8),
        new THREE.MeshBasicMaterial({ color: 0xff3300, side: THREE.DoubleSide, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending })
      );
      accretionMesh.rotation.x = Math.PI / 2;
      scene.add(accretionMesh);

      accretionMeshHalo = new THREE.Mesh(
        new THREE.RingGeometry(0.32, 0.55, 64, 8),
        new THREE.MeshBasicMaterial({ color: 0xff0022, side: THREE.DoubleSide, transparent: true, opacity: 0.48, blending: THREE.AdditiveBlending })
      );
      accretionMeshHalo.rotation.y = Math.PI / 3;
      scene.add(accretionMeshHalo);

      const accParticlesCount = 6000;
      const accGeo = new THREE.BufferGeometry();
      const accPos = new Float32Array(accParticlesCount * 3);
      const accCol = new Float32Array(accParticlesCount * 3);
      const baseColor = new THREE.Color(0xff4422);
      for (let i = 0; i < accParticlesCount; i++) {
        const i3 = i * 3;
        const r = 0.32 + Math.random() * 0.45;
        const angle = Math.random() * Math.PI * 2;
        accPos[i3] = Math.cos(angle) * r; accPos[i3 + 1] = (Math.random() - 0.5) * 0.02; accPos[i3 + 2] = Math.sin(angle) * r;
        const heat = 1 - ((r - 0.32) / 0.45);
        const pColor = baseColor.clone(); pColor.offsetHSL(0, 0, heat * 0.5);
        accCol[i3] = pColor.r; accCol[i3 + 1] = pColor.g; accCol[i3 + 2] = pColor.b;
      }
      accGeo.setAttribute('position', new THREE.BufferAttribute(accPos, 3));
      accGeo.setAttribute('color', new THREE.BufferAttribute(accCol, 3));
      accretionPoints = new THREE.Points(accGeo, new THREE.PointsMaterial({ size: 0.014, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      scene.add(accretionPoints);
    };

    const generateGalaxy = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);
      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        let radius = Math.random() * parameters.radius;
        if (radius < 1.2) radius += 1.2;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        const rX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const rY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const rZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + rX;
        positions[i3 + 1] = rY / 2;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rZ;
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({ size: parameters.size, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    const heartPoint = (t) => ({
      x: 16 * Math.pow(Math.sin(t), 3) * 0.13,
      y: (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.13,
    });
    const insideHeart = (x, y) => {
      const X = x / 1.2, Y = y / 1.2;
      return Math.pow(X * X + Y * Y - 1, 3) - X * X * Y * Y * Y < 0;
    };

    const generateJet = () => {
      const jetGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.jetCount * 3);
      const colors = new Float32Array(parameters.jetCount * 3);
      jetVelocities = [];
      const heartCenterY = 3.2;
      let placed = 0;
      while (placed < parameters.jetCount) {
        const i3 = placed * 3;
        let px, py;
        if (Math.random() < 0.7) {
          const tParam = Math.random() * Math.PI * 2;
          const hp = heartPoint(tParam);
          const jitter = (Math.random() - 0.5) * 0.18;
          const len = Math.sqrt(hp.x * hp.x + hp.y * hp.y) + 0.001;
          px = hp.x + (hp.x / len) * jitter;
          py = hp.y + (hp.y / len) * jitter;
        } else {
          let attempts = 0;
          do { px = (Math.random() - 0.5) * 5; py = (Math.random() - 0.5) * 5 + 0.4; attempts++; if (attempts > 30) { px = 0; py = 0; break; } } while (!insideHeart(px, py));
        }
        const pz = (Math.random() - 0.5) * 0.4;
        positions[i3] = 0; positions[i3 + 1] = 0; positions[i3 + 2] = 0;
        jetVelocities.push({
          basePx: px, basePy: py + heartCenterY, basePz: pz,
          phase: Math.random() * Math.PI * 2, freq: 0.5 + Math.random() * 0.8,
          amp: 0.04 + Math.random() * 0.08,
          emergeDelay: Math.random() * 0.9, emergeDuration: 0.7 + Math.random() * 0.7,
        });

        const tt = Math.random();
        colors[i3] = 0.9 + tt * 0.1;
        colors[i3 + 1] = tt * 0.05;
        colors[i3 + 2] = tt * 0.1;
        placed++;
      }
      jetGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      jetGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const jetMaterial = new THREE.PointsMaterial({ size: 0.056, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.95 });
      jetPoints = new THREE.Points(jetGeometry, jetMaterial);
      scene.add(jetPoints);
    };

    const generateBgStars = () => {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 4000;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const r = 30 + Math.random() * 120;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i3 + 2] = r * Math.cos(phi);
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0.6, depthWrite: false })));
    };

    const generateHyperspace = () => {
      hyperspaceGroup = new THREE.Group();
      camera.add(hyperspaceGroup);
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 64; spriteCanvas.height = 64;
      const sctx = spriteCanvas.getContext('2d');
      const glow = sctx.createRadialGradient(32, 32, 0, 32, 32, 31);
      glow.addColorStop(0, 'rgba(255,255,255,1)'); glow.addColorStop(0.35, 'rgba(255,255,255,0.9)');
      glow.addColorStop(0.7, 'rgba(255,255,255,0.25)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
      sctx.fillStyle = glow; sctx.fillRect(0, 0, 64, 64);
      const sprite = new THREE.CanvasTexture(spriteCanvas);
      const tube = 2.5;
      const geo = new THREE.TorusGeometry(10, tube, 3, 6, Math.PI * 2);
      const colors = [0xff0044, 0xff2a6d, 0xff7b9c];
      const totalGroup = 58; let accRotation = 0;
      hyperspaceRings = [];
      for (let i = 0; i < totalGroup * 3; i++) {
        const mat = new THREE.PointsMaterial({ size: 0.38 + Math.random() * 0.38, sizeAttenuation: true, map: sprite, alphaTest: 0.04, transparent: true, opacity: 0, color: colors[i % 3], blending: THREE.AdditiveBlending, depthWrite: false });
        const ring = new THREE.Points(geo, mat);
        ring.position.z = -10 - Math.floor(i / 3) * tube * 2;
        ring.rotation.z = accRotation + (Math.PI * 2 / 18) * (i % 3);
        ring.scale.setScalar(0.78 + Math.random() * 0.34);
        ring.frustumCulled = false;
        if (i % 3 === 2) accRotation = Math.PI * 2 * Math.random();
        hyperspaceRings.push(ring);
        hyperspaceGroup.add(ring);
      }
    };

    const plateGroup = new THREE.Group();
    scene.add(plateGroup);
    const plateMeshes = [];

    plates.forEach((p, i) => {
      const fallbackCanvas = makePlateCanvas(p, i * 137, 512);
      const canvasTex = createCenteredPlateTexture(p.src, fallbackCanvas);

      const geo = new THREE.CircleGeometry(1.05 * 0.5, 96);
      const mat = new THREE.MeshBasicMaterial({ map: canvasTex, color: 0xffffff, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 1, toneMapped: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { plate: p, index: i };

      const ring = i % 2;
      const idxInRing = Math.floor(i / 2);
      const platesPerRing = Math.ceil(plates.length / 2);
      const baseAngle = (idxInRing / platesPerRing) * Math.PI * 2;
      const radius = ring === 0 ? 4.2 : 6.8;
      const tilt = ring === 0 ? 0.15 : -0.2;
      const yOff = (ring === 0 ? 0.8 : -0.5) + Math.sin(i) * 0.25;

      plateMeshes.push({ mesh, radius, baseAngle, speed: ring === 0 ? 0.06 : -0.04, tilt, yOffset: yOff, wobblePhase: i * 0.7 });
      plateGroup.add(mesh);
    });

    generateBlackHole(); generateGalaxy(); generateJet(); generateBgStars(); generateHyperspace();

    const textGroup = new THREE.Group();
    scene.add(textGroup);
    const textMeshes = [];

    ambientPhrases.forEach((txt, i) => {
      const cvs = document.createElement('canvas');
      cvs.width = 1024; cvs.height = 128;
      const ctx = cvs.getContext('2d');
      ctx.shadowColor = 'rgba(255,0,50,1)'; ctx.shadowBlur = 24;
      ctx.fillStyle = 'rgba(255,230,240,1)'; ctx.font = 'bold 58px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(txt, 512, 64); ctx.shadowBlur = 8; ctx.fillText(txt, 512, 64);
      const tex = new THREE.CanvasTexture(cvs);
      tex.anisotropy = 8;
      const geo = new THREE.PlaneGeometry(4.4, 0.56);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 1.0 });
      const mesh = new THREE.Mesh(geo, mat);
      const baseAngle = (i / ambientPhrases.length) * Math.PI * 2 + (i * 0.37);
      const radius = 4 + (i % 5) * 1.3;
      const yLevel = Math.sin(i * 1.7) * 0.15;
      textMeshes.push({ mesh, baseAngle, radius, yLevel, speed: 0.03 + (i % 3) * 0.008, phase: i * 0.5 });
      textGroup.add(mesh);
    });

    if (points) points.visible = false;
    [accretionMesh, accretionMeshHalo, accretionPoints, blackHoleMesh, jetPoints].forEach((o) => { if (o) o.visible = false; });
    if (hyperspaceGroup) hyperspaceGroup.visible = true;
    plateMeshes.forEach((d) => { d.mesh.visible = false; d.mesh.scale.set(0.001, 0.001, 0.001); });
    textMeshes.forEach((tx) => { tx.mesh.visible = false; tx.mesh.scale.set(0.001, 0.001, 0.001); });
    camera.position.set(40, 25, 50);

    const setPlateScale = (mesh, scale) => { mesh.scale.setScalar(scale); };
    const getExperienceTime = () => experienceStarted ? (performance.now() - experienceStartMs) / 1000 : 0;

    const startExperience = () => {
      if (experienceStarted) return;
      experienceStarted = true;
      experienceStartMs = performance.now();
      startOverlay.classList.add('hidden');
    };

    startButton.addEventListener('click', startExperience);
    startOverlay.addEventListener('click', startExperience);

    const tick = () => {
      if (disposed) return;
      const t = getExperienceTime();

      if (t < 9) {
        const p = easeOutCubic(Math.min(1, t / 9));
        camera.position.lerpVectors(new THREE.Vector3(40, 25, 50), new THREE.Vector3(3.5, 2.5, 6), p);
        controls.enabled = false;
      } else {
        controls.enabled = true;
      }

      if (hyperspaceGroup) {
        const introFadeIn = smoothstep(0.1, 1.4, t);
        const introFadeOut = 1 - smoothstep(3.4, 5.0, t);
        const strength = introFadeIn * introFadeOut;
        hyperspaceGroup.visible = strength > 0.005;
        hyperspaceGroup.rotation.z = t * 0.55;
        hyperspaceSpeed = hyperspaceSpeed + ((strength > 0.55 ? 1.65 : 0.2) - hyperspaceSpeed) * 0.025;
        hyperspaceRings.forEach((ring, i) => {
          ring.position.z += hyperspaceSpeed;
          ring.rotation.z += 0.012 + (i % 3) * 0.004;
          ring.material.opacity = strength * strength * (0.5 + (i % 3) * 0.18);
          if (ring.position.z > -8) { ring.position.z = -150; ring.rotation.z = Math.random() * Math.PI * 2; }
        });
      }

      if (t > 0.8 && blackHoleMesh) {
        blackHoleMesh.visible = accretionMesh.visible = accretionMeshHalo.visible = accretionPoints.visible = true;
        const s = easeOutBack(Math.min(1, (t - 0.8) / 2.2));
        [blackHoleMesh, accretionMesh, accretionMeshHalo, accretionPoints].forEach((o) => o.scale.setScalar(s));
      }
      if (t > 2.5 && points) {
        points.visible = true;
        const p = Math.min(1, (t - 2.5) / 4.5);
        points.rotation.y = t * (0.05 + (1 - p) * 1.5);
        points.scale.setScalar(easeOutCubic(p));
      } else if (points) { points.rotation.y = t * 0.05; }

      if (t > 4.4 && jetPoints) {
        jetPoints.visible = true; jetPoints.material.opacity = 0.95;
        const heartT = t - 4.4;
        const pos = jetPoints.geometry.attributes.position.array;
        for (let i = 0; i < parameters.jetCount; i++) {
          const i3 = i * 3, v = jetVelocities[i];
          const localT = heartT - v.emergeDelay;
          if (localT <= 0) { pos[i3] = 0; pos[i3 + 1] = 0; pos[i3 + 2] = 0; continue; }
          const p = Math.min(1, localT / v.emergeDuration);
          const eased = 1 - Math.pow(1 - p, 3);
          const beat = 1 + Math.sin(t * 2.2) * 0.04;
          const wob = Math.sin(t * v.freq + v.phase) * v.amp;
          const fx = v.basePx * beat + Math.cos(v.phase) * wob * 0.3;
          const fy = (v.basePy - 3.2) * beat + 3.2 + Math.sin(v.phase * 1.3) * wob * 0.3;
          const fz = v.basePz + Math.sin(t * v.freq * 0.7 + v.phase) * 0.15;
          const arcY = Math.sin(eased * Math.PI) * 0.6;
          pos[i3] = fx * eased; pos[i3 + 1] = fy * eased + arcY * (1 - eased); pos[i3 + 2] = fz * eased;
        }
        jetPoints.geometry.attributes.position.needsUpdate = true;
      }

      plateMeshes.forEach((d, i) => {
        if (t > 5.8 + i * 0.12) {
          d.mesh.visible = true;
          const localP = Math.min(1, (t - 5.8 - i * 0.12) / 1.8);
          const eased = easeOutCubic(localP);
          const angle = d.baseAngle + t * d.speed;
          const fx = Math.cos(angle) * d.radius, fz = Math.sin(angle) * d.radius;
          const fy = d.yOffset + Math.sin(t * 0.4 + d.wobblePhase) * 0.3 + Math.sin(angle) * d.tilt;
          d.mesh.position.set(fx * eased, fy * eased, fz * eased);
          setPlateScale(d.mesh, eased);
          d.mesh.material.opacity = eased;
          d.mesh.lookAt(camera.position);
          d._intro = localP < 1;
        }
      });

      textMeshes.forEach((tx, i) => {
        if (t > 7.0 + i * 0.08) {
          tx.mesh.visible = true;
          const localP = Math.min(1, (t - 7.0 - i * 0.08) / 1.8);
          const eased = easeOutCubic(localP);
          const angle = tx.baseAngle + t * tx.speed;
          const fx = Math.cos(angle) * tx.radius, fz = Math.sin(angle) * tx.radius;
          const fy = tx.yLevel + Math.sin(t * 0.3 + tx.phase) * 0.05;
          tx.mesh.position.set(fx * eased, fy * eased, fz * eased);
          tx.mesh.scale.setScalar(eased);
          tx.mesh.material.opacity = (0.9 + Math.sin(t * 0.6 + tx.phase) * 0.1) * eased;
          tx.mesh.lookAt(camera.position);
          tx._intro = localP < 1;
        }
      });

      if (accretionPoints?.visible) accretionPoints.rotation.y = t * 2.0;
      if (accretionMesh?.visible) accretionMesh.rotation.z = t * 1.5;
      if (accretionMeshHalo?.visible) accretionMeshHalo.rotation.z = -t * 0.5;

      if (jetPoints?.visible) {
        const colArr = jetPoints.geometry.attributes.color.array;
        for (let i = 0; i < parameters.jetCount; i++) {
          const i3 = i * 3, v = jetVelocities[i];
          const flick = 0.78 + Math.sin(t * 3 + v.phase) * 0.12;
          colArr[i3] = 1.0 * flick;
          colArr[i3 + 1] = (Math.sin(v.phase) * 0.05) * flick;
          colArr[i3 + 2] = (Math.cos(v.phase) * 0.05) * flick;
        }
        jetPoints.geometry.attributes.color.needsUpdate = true;
      }

      plateMeshes.forEach((d) => {
        if (d._intro || !d.mesh.visible) return;
        const angle = d.baseAngle + t * d.speed;
        const x = Math.cos(angle) * d.radius, z = Math.sin(angle) * d.radius;
        const y = d.yOffset + Math.sin(t * 0.4 + d.wobblePhase) * 0.3 + Math.sin(angle) * d.tilt;
        d.mesh.position.set(x, y, z);
        setPlateScale(d.mesh, 1);
        d.mesh.lookAt(camera.position);
      });

      textMeshes.forEach((tx) => {
        if (tx._intro || !tx.mesh.visible) return;
        const angle = tx.baseAngle + t * tx.speed;
        const x = Math.cos(angle) * tx.radius, z = Math.sin(angle) * tx.radius;
        const y = tx.yLevel + Math.sin(t * 0.3 + tx.phase) * 0.05;
        tx.mesh.position.set(x, y, z);
        tx.mesh.lookAt(camera.position);
        tx.mesh.material.opacity = 0.9 + Math.sin(t * 0.6 + tx.phase) * 0.1;
      });

      if (continueBtn) {
        const visible = smoothstep(10, 11.5, t) > 0.5;
        continueBtn.classList.toggle('visible', experienceStarted && visible);
      }

      controls.update();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = null;

    const handlePointerDown = (e) => { pointerDownPos = { x: e.clientX, y: e.clientY }; };
    const handlePointerUp = (e) => {
      if (!pointerDownPos) return;
      const dx = e.clientX - pointerDownPos.x, dy = e.clientY - pointerDownPos.y;
      pointerDownPos = null;
      if (Math.hypot(dx, dy) > 5 || getExperienceTime() < 9) return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(plateMeshes.map((d) => d.mesh).filter((m) => m.visible), false);
      if (hits.length > 0) showPlateMessage(hits[0].object.userData.plate, hits[0].object.userData.index);
    };
    const handlePointerMove = (e) => {
      if (getExperienceTime() < 9) return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(plateMeshes.map((d) => d.mesh).filter((m) => m.visible), false);
      canvas.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);

    function showPlateMessage(plate, idx) {
      titleEl.textContent = plate.name;
      textEl.textContent = plate.message;
      if (plate.src) {
        msgImg.src = plate.src;
        msgImgBg.src = plate.src;
      } else {
        const cvs = makePlateCanvas(plate, idx * 137, 512);
        msgImg.src = cvs.toDataURL();
        msgImgBg.src = cvs.toDataURL();
      }
      overlay.classList.add('show');
    }

    const handleClose = () => overlay.classList.remove('show');
    const handleOverlayClick = (e) => { if (e.target === overlay) overlay.classList.remove('show'); };
    const handleKeydown = (e) => { if (e.key === 'Escape') overlay.classList.remove('show'); };
    const handleContinue = () => onNextRef.current?.();

    closeBtn.addEventListener('click', handleClose);
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeydown);
    continueBtn.addEventListener('click', handleContinue);

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
      startButton.removeEventListener('click', startExperience);
      startOverlay.removeEventListener('click', startExperience);
      closeBtn.removeEventListener('click', handleClose);
      overlay.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleKeydown);
      continueBtn.removeEventListener('click', handleContinue);

      controls.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="galaxy-screen">
      <canvas ref={canvasRef} id="bg-canvas" />

      <div ref={startOverlayRef} id="start-overlay">
        <div id="start-card">
          <h1>Notre Amour Galactique</h1>
          <img id="start-gif" src="/fondo1.gif" alt="Début" />
          <p>Prêt à découvrir l'infini de mon amour pour toi ?</p>
          <button ref={startButtonRef} id="start-button">C'est parti !</button>
        </div>
      </div>

      <div ref={overlayRef} id="message-overlay">
        <div id="message-card">
          <div id="message-image-wrap">
            <img ref={msgImgBgRef} id="message-image-bg" alt="" aria-hidden="true" crossOrigin="anonymous" />
            <img ref={msgImgRef} id="message-image" alt="" crossOrigin="anonymous" />
          </div>
          <h2 ref={titleRef} id="message-title"></h2>
          <p ref={textRef} id="message-text"></p>
          <button ref={closeBtnRef} id="message-close">FERMER ✦</button>
        </div>
      </div>

      <button ref={continueBtnRef} id="galaxy-continue">Continuer →</button>
    </div>
  );
}
