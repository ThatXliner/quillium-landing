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

    if (isMobile) return;

    // --- GSAP Scroll Sequence ---
    const stage = document.getElementById('hero-scroll-stage');
    const pinned = document.getElementById('hero-scroll-pinned');
    if (!stage || !pinned) return;

    const shots = [
      document.getElementById('shot-editor')!,
      document.getElementById('shot-revision')!,
      document.getElementById('shot-comment')!,
      document.getElementById('shot-inline')!,
      document.getElementById('shot-library')!,
    ].filter(Boolean);

    const annos = [
      document.getElementById('anno-1')!,
      document.getElementById('anno-2')!,
      document.getElementById('anno-3')!,
      document.getElementById('anno-4')!,
    ].filter(Boolean);

    const dots = document.querySelectorAll<HTMLElement>('.progress-dot');

    // Initial state: only first screenshot visible
    shots.forEach((s, idx) => {
      if (idx > 0) gsap.set(s, { opacity: 0, scale: 0.92 });
    });
    annos.forEach((a) => gsap.set(a, { opacity: 0, y: 15 }));
    dots.forEach((d, idx) => {
      if (idx > 0) gsap.set(d, { opacity: 0.3, scale: 1 });
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
    // Phase 0: Editor visible (0% – 15%)
    // Phase 1: → Revision (15% – 20%)
    tl.to(shots[0], { opacity: 0, scale: 1.2, duration: 0.05 }, 0.15);
    tl.to(shots[1], { opacity: 1, scale: 1, duration: 0.05 }, 0.17);
    tl.to(annos[0], { opacity: 1, y: 0, duration: 0.04 }, 0.18);
    // Phase 2: → Comment (35% – 40%)
    tl.to(shots[1], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.35);
    tl.to(annos[0], { opacity: 0, y: -10, duration: 0.03 }, 0.35);
    tl.to(shots[2], { opacity: 1, scale: 1, duration: 0.05 }, 0.37);
    tl.to(annos[1], { opacity: 1, y: 0, duration: 0.04 }, 0.38);
    // Phase 3: → Inline (55% – 60%)
    tl.to(shots[2], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.55);
    tl.to(annos[1], { opacity: 0, y: -10, duration: 0.03 }, 0.55);
    tl.to(shots[3], { opacity: 1, scale: 1, duration: 0.05 }, 0.57);
    tl.to(annos[2], { opacity: 1, y: 0, duration: 0.04 }, 0.58);
    // Phase 4: → Library (75% – 80%)
    tl.to(shots[3], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.75);
    tl.to(annos[2], { opacity: 0, y: -10, duration: 0.03 }, 0.75);
    tl.to(shots[4], { opacity: 1, scale: 1, duration: 0.05 }, 0.77);
    tl.to(annos[3], { opacity: 1, y: 0, duration: 0.04 }, 0.78);
    // Phase 5: reveal CTA (90% – 100%)
    tl.to(shots[4], { opacity: 0.4, scale: 1.08, duration: 0.07 }, 0.92);
    tl.to(annos[3], { opacity: 0, y: -10, duration: 0.03 }, 0.9);
    tl.to('#hero-scroll-cta', { opacity: 1, y: 0, duration: 0.06 }, 0.94);

    // Background transitions
    // Warm cream → dark → warm cream
    tl.to(
      stage,
      { backgroundColor: '#2a2a2a', duration: 0.08 },
      0.3,
    );
    tl.to(
      stage,
      { backgroundColor: '#1a1a1a', duration: 0.06 },
      0.45,
    );
    tl.to(
      stage,
      { backgroundColor: '#2a2a2a', duration: 0.06 },
      0.6,
    );
    tl.to(
      stage,
      { backgroundColor: '#f5f4f1', duration: 0.08 },
      0.78,
    );

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
  </div>

  <!-- Pinned stage -->
  <div class="stage" id="hero-scroll-stage">
    <div class="pinned" id="hero-scroll-pinned">
      <!-- Screenshots -->
      <div class="screenshots">
        <img src={editorImg} alt="" class="shot" id="shot-editor" />
        <img src={revisionImg} alt="" class="shot" id="shot-revision" />
        <img src={commentImg} alt="" class="shot" id="shot-comment" />
        <img src={inlineImg} alt="" class="shot" id="shot-inline" />
        <img src={libraryImg} alt="" class="shot" id="shot-library" />
      </div>

      <!-- Feature label overlays -->
      <div class="feature-label" id="feature-editor">Your writing, front and center</div>

      <!-- Annotations -->
      <div class="annotations">
        <div class="anno" id="anno-1">
          <svg
            width="140"
            height="50"
            viewBox="0 0 140 50"
            class="anno-line"
            style="position:absolute;top:0;left:0;"
          >
            <path
              d="M 5 40 Q 20 40 40 25 Q 60 10 100 8"
              fill="none"
              stroke="#a855f7"
              stroke-width="1.5"
              stroke-dasharray="200"
              stroke-dashoffset="200"
              stroke-linecap="round"
            />
          </svg>
          <span>Write in Branches</span>
        </div>

        <div class="anno" id="anno-2">
          <svg
            width="130"
            height="50"
            viewBox="0 0 130 50"
            class="anno-line"
            style="position:absolute;top:0;left:0;"
          >
            <path
              d="M 115 8 Q 100 20 80 28 Q 50 40 10 40"
              fill="none"
              stroke="#d97706"
              stroke-width="1.5"
              stroke-dasharray="200"
              stroke-dashoffset="200"
              stroke-linecap="round"
            />
          </svg>
          <span>Great Minds Think Together</span>
        </div>

        <div class="anno" id="anno-3">
          <svg
            width="140"
            height="50"
            viewBox="0 0 140 50"
            class="anno-line"
            style="position:absolute;top:0;left:0;"
          >
            <path
              d="M 5 10 Q 30 25 55 30 Q 80 35 110 30"
              fill="none"
              stroke="#22c55e"
              stroke-width="1.5"
              stroke-dasharray="200"
              stroke-dashoffset="200"
              stroke-linecap="round"
            />
          </svg>
          <span>Inline Nested Revisions</span>
        </div>

        <div class="anno" id="anno-4">
          <svg
            width="130"
            height="50"
            viewBox="0 0 130 50"
            class="anno-line"
            style="position:absolute;top:0;left:0;"
          >
            <path
              d="M 80 5 Q 80 20 70 35 Q 60 48 10 45"
              fill="none"
              stroke="#3b82f6"
              stroke-width="1.5"
              stroke-dasharray="200"
              stroke-dashoffset="200"
              stroke-linecap="round"
            />
          </svg>
          <span>Never Lose Your Work</span>
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
      Write a sentence three different ways, and decide which to pick later. Branch any phrase without
      losing a single word.
    </p>
    <div class="cta-buttons">
      <a href={downloadUrl} class="btn-primary">Download Now</a>
      <a href="#features" class="cta-secondary">See how it works</a>
    </div>
    {#if isMobile}
      <p class="text-[0.7rem] text-black/30 mt-2">
        By downloading, you agree to the
        <a href="/terms" class="underline underline-offset-2 text-black/40 hover:text-black/55">Terms of Service</a
        >
      </p>
    {/if}
    <div class="trust-row">
      <a href="/blog/quillium-is-not-an-ai-app" class="trust-link"
        ><Pen size={14} strokeWidth={2} class="opacity-50" /> Write every word (No AI bs).</a
      >
      <a href="/blog/quillium-privacy" class="trust-link"
        ><Lock size={14} strokeWidth={2} class="opacity-50" /> Fully private.</a
      >
      <a href="/blog/how-quillium-keeps-your-writing-safe" class="trust-link"
        ><ShieldCheck size={14} strokeWidth={2} class="opacity-50" /> Safe and secure.</a
      >
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
    margin: 0;
  }
  .italic {
    font-style: italic;
  }
  .cursor {
    font-weight: 300;
    animation: blink 0.6s step-end infinite;
  }
  .cursor.hidden {
    display: none;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  /* --- Stage --- */
  .stage {
    position: relative;
    width: 100%;
    background-color: #f5f4f1;
    overflow: hidden;
  }
  .pinned {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    position: relative;
  }

  /* --- Screenshots --- */
  .screenshots {
    position: relative;
    width: min(82vw, 860px);
    aspect-ratio: 8 / 5;
  }
  .shot {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(44, 42, 39, 0.12), 0 4px 12px rgba(44, 42, 39, 0.06);
  }

  /* --- Feature label (shown on first slide) --- */
  .feature-label {
    position: absolute;
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Newsreader', Georgia, serif;
    font-size: 1.15rem;
    font-style: italic;
    color: rgba(0, 0, 0, 0.45);
    pointer-events: none;
  }

  /* --- Annotations --- */
  .annotations {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .anno {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0;
  }
  .anno span {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.75);
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(10px);
    padding: 5px 12px;
    border-radius: 8px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
    white-space: nowrap;
    position: relative;
    z-index: 2;
  }
  .anno-line {
    overflow: visible;
    flex-shrink: 0;
    z-index: 1;
  }
  .anno-line path {
    stroke-linecap: round;
  }

  /* Annotation placements — relative to the pinned container */
  #anno-1 {
    top: 20%;
    left: 53%;
    flex-direction: row;
  }
  #anno-1 span {
    margin-left: -10px;
  }
  #anno-2 {
    top: 38%;
    right: 55%;
    flex-direction: row-reverse;
  }
  #anno-2 span {
    margin-right: -10px;
  }
  #anno-3 {
    top: 52%;
    left: 50%;
    flex-direction: row;
  }
  #anno-3 span {
    margin-left: -10px;
  }
  #anno-4 {
    bottom: 18%;
    left: 45%;
    flex-direction: column;
    align-items: flex-start;
  }

  /* --- Progress dots --- */
  .progress {
    position: absolute;
    right: 1.25rem;
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
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.5);
    color: rgba(0, 0, 0, 0.88);
    font-weight: 500;
    font-size: 0.95rem;
    text-decoration: none;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }
  .cta-secondary:hover {
    background: rgba(0, 0, 0, 0.03);
    transform: translateY(-1px);
  }
  .trust-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    padding-top: 1.5rem;
    border-top: 2px solid;
    border-image: linear-gradient(
        90deg,
        transparent,
        #3b82f6,
        #a855f7,
        #22c55e,
        #fcbc05,
        transparent
      )
      1;
  }
  .trust-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.5);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.3s;
  }
  .trust-link:hover {
    color: rgba(0, 0, 0, 0.7);
  }

  /* --- Mobile: disable pin, show static stack --- */
  @media (max-width: 767px) {
    .stage {
      overflow: visible;
    }
    .pinned {
      height: auto;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1.25rem;
    }
    .screenshots {
      width: 100%;
      aspect-ratio: auto;
    }
    .shot {
      position: relative !important;
      opacity: 1 !important;
      margin-bottom: 1.25rem;
      box-shadow: 0 4px 16px rgba(44, 42, 39, 0.08);
    }
    .annotations {
      display: none;
    }
    .feature-label {
      display: none;
    }
    .progress {
      display: none;
    }
  }
</style>
