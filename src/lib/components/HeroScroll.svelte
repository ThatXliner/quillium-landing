<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { Pen, Lock, ShieldCheck } from '@lucide/svelte';

  gsap.registerPlugin(ScrollTrigger);

  import editorImg from '$lib/assets/screenshots/01-editor.png';
  import revisionImg from '$lib/assets/screenshots/05-revision-active.png';
  import commentImg from '$lib/assets/screenshots/04-comment-active.png';
  import inlineImg from '$lib/assets/screenshots/13-inline-nested-revision.png';
  import libraryImg from '$lib/assets/screenshots/06-library.png';

  let { release }: { release: { assets: { name: string; url: string }[] } } = $props();

  function findAsset(pattern: string): string {
    const match = release.assets.find((a: { url: string }) => a.url.includes(pattern));
    if (match) return match.url;
    return `https://github.com/ThatXliner/quillium-releases/releases/latest`;
  }

  let detected = $state('unknown');
  let downloadUrl = $derived.by(() => {
    if (detected === 'mac') return findAsset('_aarch64.dmg');
    if (detected === 'windows') return findAsset('_x64-setup.exe');
    if (detected === 'linux') return findAsset('_amd64.deb');
    return '#download';
  });

  let displayText = $state('');
  let showPros = $state(false);
  let showPeriod = $state(false);
  let showCursor = $state(true);

  let scrollCtx: ScrollTrigger | null = null;
  let isMobile = $state(false);

  onMount(() => {
    isMobile = window.innerWidth < 768;

    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mac')) detected = 'mac';
    else if (ua.includes('win')) detected = 'windows';
    else if (ua.includes('linux')) detected = 'linux';

    // Typewriter
    const fullText = 'Prose for ';
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        displayText = fullText.slice(0, i + 1);
        i++;
      } else {
        showPros = true;
        clearInterval(interval);
        setTimeout(() => {
          showPeriod = true;
          setTimeout(() => (showCursor = false), 600);
        }, 100);
      }
    }, 100);

    if (isMobile) return () => clearInterval(interval);

    // --- GSAP Scroll Sequence ---
    const stage = document.getElementById('hero-scroll-stage');
    if (!stage) return () => clearInterval(interval);

    const shots = [
      document.getElementById('shot-editor')!,
      document.getElementById('shot-revision')!,
      document.getElementById('shot-comment')!,
      document.getElementById('shot-inline')!,
      document.getElementById('shot-library')!,
    ].filter(Boolean);

    // Each callout: { el: DOM element, line: SVG path element }
    const callouts = [
      { el: document.getElementById('callout-1')!, line: document.getElementById('line-1')! },
      { el: document.getElementById('callout-2')!, line: document.getElementById('line-2')! },
      { el: document.getElementById('callout-3')!, line: document.getElementById('line-3')! },
      { el: document.getElementById('callout-4')!, line: document.getElementById('line-4')! },
    ].filter((c) => c.el && c.line);

    const dots = document.querySelectorAll<HTMLElement>('.progress-dot');

    // Initial state
    shots.forEach((s, idx) => {
      if (idx > 0) gsap.set(s, { opacity: 0, scale: 0.95 });
    });
    callouts.forEach((c) => {
      gsap.set(c.el, { opacity: 0, y: 12 });
      gsap.set(c.line, { strokeDashoffset: 200 });
    });
    dots.forEach((d, idx) => {
      if (idx > 0) gsap.set(d, { opacity: 0.25, scale: 1 });
    });
    gsap.set('#hero-scroll-cta', { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 1.2,
        onUpdate(self) {
          const p = self.progress;
          dots.forEach((dot, idx) => {
            const threshold = idx / (dots.length - 1);
            const active = p >= threshold - 0.02;
            gsap.to(dot, {
              opacity: active ? 0.9 : 0.25,
              scale: active ? 1.4 : 1,
              duration: 0.08,
              overwrite: true,
            });
          });
        },
      },
    });

    // --- Phase sequence ---
    // Editor → Branches (15%–20%)
    tl.to(shots[0], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.15);
    tl.to(shots[1], { opacity: 1, scale: 1, duration: 0.05 }, 0.17);
    tl.to(callouts[0].el, { opacity: 1, y: 0, duration: 0.04 }, 0.19);
    tl.to(callouts[0].line, { strokeDashoffset: 0, duration: 0.04 }, 0.19);

    // Branches → Comments (35%–40%)
    tl.to(shots[1], { opacity: 0, scale: 1.1, duration: 0.05 }, 0.35);
    tl.to(callouts[0].el, { opacity: 0, y: -10, duration: 0.03 }, 0.35);
    tl.to(callouts[0].line, { strokeDashoffset: 200, duration: 0.03 }, 0.35);
    tl.to(shots[2], { opacity: 1, scale: 1, duration: 0.05 }, 0.37);
    tl.to(callouts[1].el, { opacity: 1, y: 0, duration: 0.04 }, 0.39);
    tl.to(callouts[1].line, { strokeDashoffset: 0, duration: 0.04 }, 0.39);

    // Comments → Inline (55%–60%)
    tl.to(shots[2], { opacity: 0, scale: 1.1, duration: 0.05 }, 0.55);
    tl.to(callouts[1].el, { opacity: 0, y: -10, duration: 0.03 }, 0.55);
    tl.to(callouts[1].line, { strokeDashoffset: 200, duration: 0.03 }, 0.55);
    tl.to(shots[3], { opacity: 1, scale: 1, duration: 0.05 }, 0.57);
    tl.to(callouts[2].el, { opacity: 1, y: 0, duration: 0.04 }, 0.59);
    tl.to(callouts[2].line, { strokeDashoffset: 0, duration: 0.04 }, 0.59);

    // Inline → Library/Safety (75%–80%)
    tl.to(shots[3], { opacity: 0, scale: 1.1, duration: 0.05 }, 0.75);
    tl.to(callouts[2].el, { opacity: 0, y: -10, duration: 0.03 }, 0.75);
    tl.to(callouts[2].line, { strokeDashoffset: 200, duration: 0.03 }, 0.75);
    tl.to(shots[4], { opacity: 1, scale: 1, duration: 0.05 }, 0.77);
    tl.to(callouts[3].el, { opacity: 1, y: 0, duration: 0.04 }, 0.79);
    tl.to(callouts[3].line, { strokeDashoffset: 0, duration: 0.04 }, 0.79);

    // Fade to CTA (90%–100%)
    tl.to(shots[4], { opacity: 0.4, scale: 1.06, duration: 0.07 }, 0.92);
    tl.to(callouts[3].el, { opacity: 0, y: -10, duration: 0.03 }, 0.9);
    tl.to(callouts[3].line, { strokeDashoffset: 200, duration: 0.03 }, 0.9);
    tl.to('#hero-scroll-cta', { opacity: 1, y: 0, duration: 0.06 }, 0.94);

    scrollCtx = tl.scrollTrigger!;

    return () => clearInterval(interval);
  });

  onDestroy(() => {
    scrollCtx?.kill();
  });
</script>

<section class="hero-scroll">
  <!-- Intro -->
  <div class="hero-scroll-intro">
    <div class="logo-wrap">
      <img src="/logo.svg" alt="Quillium mark" width="96" height="96" />
    </div>
    <p class="eyebrow">The Non-Linear Writing App</p>
    <h1 class="headline">
      {displayText}{#if showPros}<span class="italic">Pros</span>{/if}{#if showPeriod}.{/if}<span
        class="cursor"
        class:hidden={!showCursor}>|</span
      >
    </h1>
    <p class="intro-hint">Scroll to see what makes it different</p>

    <div class="intro-trust">
      <a href="/blog/quillium-is-not-an-ai-app" class="intro-trust-link"
        ><Pen size={14} strokeWidth={2} class="opacity-60" /> Write every word (No AI bs).</a
      >
      <a href="/blog/quillium-privacy" class="intro-trust-link"
        ><Lock size={14} strokeWidth={2} class="opacity-60" /> Fully private.</a
      >
      <a href="/blog/how-quillium-keeps-your-writing-safe" class="intro-trust-link"
        ><ShieldCheck size={14} strokeWidth={2} class="opacity-60" /> Safe and secure.</a
      >
    </div>
  </div>

  <!-- Pinned stage -->
  <div class="stage" id="hero-scroll-stage">
    <div class="pinned" id="hero-scroll-pinned">
      <!-- Screenshots, big and center -->
      <div class="screenshots">
        <img src={editorImg} alt="" class="shot" id="shot-editor" />
        <img src={revisionImg} alt="" class="shot" id="shot-revision" />
        <img src={commentImg} alt="" class="shot" id="shot-comment" />
        <img src={inlineImg} alt="" class="shot" id="shot-inline" />
        <img src={libraryImg} alt="" class="shot" id="shot-library" />
      </div>

      <!-- Callouts: arrow lines + labels overlaid on screenshot -->
      <div class="callouts">
        <!-- Branches -->
        <div class="callout" id="callout-1">
          <svg width="130" height="60" viewBox="0 0 130 60" class="callout-svg">
            <path id="line-1" d="M 5 45 Q 40 45 65 25 Q 85 10 120 8" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
            <circle cx="120" cy="8" r="3.5" fill="#a855f7" />
          </svg>
          <span class="callout-label" style="color:#a855f7;">Write in Branches</span>
        </div>

        <!-- Comments -->
        <div class="callout" id="callout-2">
          <svg width="130" height="60" viewBox="0 0 130 60" class="callout-svg">
            <path id="line-2" d="M 125 45 Q 90 45 65 25 Q 45 10 10 8" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
            <circle cx="10" cy="8" r="3.5" fill="#d97706" />
          </svg>
          <span class="callout-label" style="color:#d97706;">Great Minds Think Together</span>
        </div>

        <!-- Inline revisions -->
        <div class="callout" id="callout-3">
          <svg width="140" height="60" viewBox="0 0 140 60" class="callout-svg">
            <path id="line-3" d="M 10 10 Q 45 25 70 35 Q 90 42 125 40" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
            <circle cx="125" cy="40" r="3.5" fill="#22c55e" />
          </svg>
          <span class="callout-label" style="color:#22c55e;">Nested Revisions, Inline</span>
        </div>

        <!-- Safety / Library -->
        <div class="callout" id="callout-4">
          <svg width="140" height="60" viewBox="0 0 140 60" class="callout-svg">
            <path id="line-4" d="M 70 5 Q 60 20 40 35 Q 25 45 10 48" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
            <circle cx="10" cy="48" r="3.5" fill="#3b82f6" />
          </svg>
          <span class="callout-label" style="color:#3b82f6;">Never Lose Your Work</span>
        </div>
      </div>

      <!-- Progress dots -->
      <div class="progress" id="hero-scroll-progress">
        {#each [0, 1, 2, 3, 4] as i}
          <span class="dot" data-slide={i}></span>
        {/each}
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="cta-section" id="hero-scroll-cta">
    <p class="cta-desc">
      Write a sentence three different ways, and decide which to pick later. Branch any phrase without losing a single word.
    </p>
    <div class="cta-buttons">
      <a href={downloadUrl} class="btn-primary">Download Now</a>
    </div>
  </div>
</section>

<style>
  .hero-scroll {
    width: 100%;
    background: #f5f4f1;
  }

  /* --- Intro --- */
  .hero-scroll-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
  }
  .logo-wrap {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 32px;
    border: 1.5px solid rgba(255, 255, 255, 0.35);
    background: radial-gradient(at 40% 35%, #eceef2, #cdd1d9);
    margin-bottom: 1rem;
  }
  .eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.35);
    margin: 0 0 1rem 0;
  }
  .headline {
    font-family: 'Newsreader', Georgia, serif;
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: rgba(0, 0, 0, 0.88);
    max-width: 700px;
    margin: 0 0 2rem 0;
  }
  .italic { font-style: italic; }
  .cursor { font-weight: 300; animation: blink 0.6s step-end infinite; }
  .cursor.hidden { display: none; }
  @keyframes blink { 50% { opacity: 0; } }
  .intro-hint {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.4);
    letter-spacing: 0.05em;
    margin: 0 0 2.5rem 0;
    animation: pulse-hint 2s ease-in-out infinite;
  }
  .intro-trust {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    padding-top: 1.5rem;
    border-top: 2px solid;
    border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;
  }
  .intro-trust-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.5);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.3s;
  }
  .intro-trust-link:hover { color: rgba(0, 0, 0, 0.7); }
  @keyframes pulse-hint {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.65; }
  }

  /* --- Stage --- */
  .stage {
    position: relative;
    width: 100%;
    background-color: #f5f4f1;
    overflow: hidden;
  }
  .pinned {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* --- Screenshots --- */
  .screenshots {
    position: relative;
    width: min(88vw, 960px);
    aspect-ratio: 8 / 5;
  }
  .shot {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 16px 64px rgba(44, 42, 39, 0.1), 0 4px 16px rgba(44, 42, 39, 0.05);
  }

  /* --- Callouts --- */
  .callouts {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .callout {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0;
  }
  .callout-svg {
    overflow: visible;
    flex-shrink: 0;
  }
  .callout-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    padding: 5px 12px;
    border-radius: 7px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.08);
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  /* Callout positions — relative to pinned container */
  #callout-1 { top: 18%; left: 10%; flex-direction: row; }
  #callout-1 .callout-label { margin-left: -30px; margin-top: -8px; }
  #callout-2 { top: 34%; right: 8%; flex-direction: row-reverse; }
  #callout-2 .callout-label { margin-right: -20px; margin-top: -8px; }
  #callout-3 { top: 55%; left: 8%; flex-direction: row; }
  #callout-3 .callout-label { margin-left: -15px; }
  #callout-4 { bottom: 22%; right: 12%; flex-direction: row-reverse; }
  #callout-4 .callout-label { margin-right: -10px; margin-bottom: 4px; }

  /* --- Progress dots --- */
  .progress {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 10;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    transition: transform 0.25s ease;
  }

  /* --- CTA --- */
  .cta-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 6rem 2rem 7rem;
    background: #f5f4f1;
  }
  .cta-desc {
    max-width: 520px;
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(0, 0, 0, 0.5);
    margin: 0 0 2.5rem 0;
  }
  .cta-buttons {
    margin-bottom: 2.5rem;
  }

  /* --- Mobile --- */
  @media (max-width: 767px) {
    .stage { overflow: visible; }
    .pinned {
      height: auto;
      padding: 2rem 1.25rem;
    }
    .screenshots {
      width: 100%;
      aspect-ratio: auto;
    }
    .shot { position: relative !important; opacity: 1 !important; }
    .callouts, .progress, .intro-hint { display: none; }
  }
</style>
