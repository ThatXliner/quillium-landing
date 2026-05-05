<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { Pen, Lock, ShieldCheck, GitBranch, MessageSquare, CircleCheck } from '@lucide/svelte';

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

    const copies = [
      document.getElementById('copy-editor')!,
      document.getElementById('copy-branches')!,
      document.getElementById('copy-comments')!,
      document.getElementById('copy-inline')!,
      document.getElementById('copy-safety')!,
    ].filter(Boolean);

    const annos = [
      document.getElementById('anno-1')!,
      document.getElementById('anno-2')!,
      document.getElementById('anno-3')!,
      document.getElementById('anno-4')!,
    ].filter(Boolean);

    const dots = document.querySelectorAll<HTMLElement>('.progress-dot');

    // Initial state
    shots.forEach((s, idx) => {
      if (idx > 0) gsap.set(s, { opacity: 0, scale: 0.92 });
    });
    copies.forEach((c, idx) => {
      if (idx > 0) gsap.set(c, { opacity: 0, y: 24 });
    });
    annos.forEach((a) => gsap.set(a, { opacity: 0, y: 15 }));
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
    // Phase 0→1: Editor → Branches (15%–20%)
    tl.to(shots[0], { opacity: 0, scale: 1.2, duration: 0.05 }, 0.15);
    tl.to(copies[0], { opacity: 0, y: -20, duration: 0.03 }, 0.15);
    tl.to(shots[1], { opacity: 1, scale: 1, duration: 0.05 }, 0.17);
    tl.to(copies[1], { opacity: 1, y: 0, duration: 0.05 }, 0.17);
    tl.to(annos[0], { opacity: 1, y: 0, duration: 0.04 }, 0.19);

    // Phase 1→2: Branches → Comments (35%–40%)
    tl.to(shots[1], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.35);
    tl.to(copies[1], { opacity: 0, y: -20, duration: 0.03 }, 0.35);
    tl.to(annos[0], { opacity: 0, y: -10, duration: 0.03 }, 0.35);
    tl.to(shots[2], { opacity: 1, scale: 1, duration: 0.05 }, 0.37);
    tl.to(copies[2], { opacity: 1, y: 0, duration: 0.05 }, 0.37);
    tl.to(annos[1], { opacity: 1, y: 0, duration: 0.04 }, 0.39);

    // Phase 2→3: Comments → Inline (55%–60%)
    tl.to(shots[2], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.55);
    tl.to(copies[2], { opacity: 0, y: -20, duration: 0.03 }, 0.55);
    tl.to(annos[1], { opacity: 0, y: -10, duration: 0.03 }, 0.55);
    tl.to(shots[3], { opacity: 1, scale: 1, duration: 0.05 }, 0.57);
    tl.to(copies[3], { opacity: 1, y: 0, duration: 0.05 }, 0.57);
    tl.to(annos[2], { opacity: 1, y: 0, duration: 0.04 }, 0.59);

    // Phase 3→4: Inline → Safety/Library (75%–80%)
    tl.to(shots[3], { opacity: 0, scale: 1.15, duration: 0.05 }, 0.75);
    tl.to(copies[3], { opacity: 0, y: -20, duration: 0.03 }, 0.75);
    tl.to(annos[2], { opacity: 0, y: -10, duration: 0.03 }, 0.75);
    tl.to(shots[4], { opacity: 1, scale: 1, duration: 0.05 }, 0.77);
    tl.to(copies[4], { opacity: 1, y: 0, duration: 0.05 }, 0.77);
    tl.to(annos[3], { opacity: 1, y: 0, duration: 0.04 }, 0.79);

    // Phase 5: fade to CTA (90%–100%)
    tl.to(shots[4], { opacity: 0.4, scale: 1.08, duration: 0.07 }, 0.92);
    tl.to(copies[4], { opacity: 0, y: -20, duration: 0.04 }, 0.9);
    tl.to(annos[3], { opacity: 0, y: -10, duration: 0.03 }, 0.9);
    tl.to('#hero-scroll-cta', { opacity: 1, y: 0, duration: 0.06 }, 0.94);

    // Background transitions
    tl.to(stage, { backgroundColor: '#2a2a2a', duration: 0.08 }, 0.3);
    tl.to(stage, { backgroundColor: '#1a1a1a', duration: 0.06 }, 0.45);
    tl.to(stage, { backgroundColor: '#2a2a2a', duration: 0.06 }, 0.6);
    tl.to(stage, { backgroundColor: '#f5f4f1', duration: 0.08 }, 0.78);

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
      <div class="stage-inner">
        <!-- Feature copy column -->
        <div class="copy-col">
          <!-- Phase 0: Editor (no copy, just a label) -->
          <div class="copy-block" id="copy-editor"></div>

          <!-- Phase 1: Branches -->
          <div class="copy-block" id="copy-branches">
            <div class="feature-icon" style="background:rgba(168,85,247,0.08);">
              <GitBranch size={22} strokeWidth={1.5} color="#a855f7" />
            </div>
            <h3 class="feature-heading">Write in Branches</h3>
            <p class="feature-desc">
              Fork any sentence. Keep every version. Navigate your creative decisions freely and try what might work.
            </p>
          </div>

          <!-- Phase 2: Comments -->
          <div class="copy-block" id="copy-comments">
            <div class="feature-icon" style="background:rgba(252,188,5,0.1);">
              <MessageSquare size={22} strokeWidth={1.5} color="#d97706" />
            </div>
            <h3 class="feature-heading">Great Minds Think Together</h3>
            <p class="feature-desc">
              Comments, revisions, and suggestions float beside the text they're about. Collaborate with your editor, anytime and anywhere.
            </p>
          </div>

          <!-- Phase 3: Inline revisions -->
          <div class="copy-block" id="copy-inline">
            <div class="feature-icon" style="background:rgba(34,197,94,0.08);">
              <GitBranch size={22} strokeWidth={1.5} color="#22c55e" />
            </div>
            <h3 class="feature-heading">Nested Revisions, Inline</h3>
            <p class="feature-desc">
              See revision diffs right where they matter — in the text. Compare branches side-by-side without losing context.
            </p>
          </div>

          <!-- Phase 4: Safety -->
          <div class="copy-block" id="copy-safety">
            <div class="feature-icon" style="background:rgba(59,130,246,0.08);">
              <CircleCheck size={22} strokeWidth={1.5} color="#3b82f6" />
            </div>
            <h3 class="feature-heading">Never Lose Your Work</h3>
            <p class="feature-desc">
              Your work is saved locally — durable, reliable, instant. A database with 25+ years of experience means even if your computer crashes mid-sentence, nothing is lost.
            </p>
            <div class="tag-list">
              <span class="tag tag--blue">Offline-first</span>
              <span class="tag tag--blue">SQLite-backed</span>
              <span class="tag tag--blue">Crash-resistant</span>
            </div>
          </div>
        </div>

        <!-- Screenshot column -->
        <div class="shot-col">
          <div class="screenshots">
            <img src={editorImg} alt="" class="shot" id="shot-editor" />
            <img src={revisionImg} alt="" class="shot" id="shot-revision" />
            <img src={commentImg} alt="" class="shot" id="shot-comment" />
            <img src={inlineImg} alt="" class="shot" id="shot-inline" />
            <img src={libraryImg} alt="" class="shot" id="shot-library" />
          </div>

          <!-- Annotations overlaid on screenshots -->
          <div class="annotations">
            <div class="anno" id="anno-1">
              <svg width="100" height="40" viewBox="0 0 100 40" class="anno-line">
                <path d="M 5 35 Q 30 35 50 20 Q 70 5 95 5" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
              </svg>
            </div>
            <div class="anno" id="anno-2">
              <svg width="100" height="40" viewBox="0 0 100 40" class="anno-line">
                <path d="M 95 35 Q 70 35 50 20 Q 30 5 5 5" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
              </svg>
            </div>
            <div class="anno" id="anno-3">
              <svg width="100" height="40" viewBox="0 0 100 40" class="anno-line">
                <path d="M 5 5 Q 30 20 50 25 Q 70 30 95 30" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
              </svg>
            </div>
            <div class="anno" id="anno-4">
              <svg width="100" height="40" viewBox="0 0 100 40" class="anno-line">
                <path d="M 50 35 Q 50 20 40 10 Q 30 5 5 5" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
              </svg>
            </div>
          </div>
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
    0%, 100% { opacity: 0.25; }
    50% { opacity: 0.55; }
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
  .stage-inner {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: clamp(2rem, 5vw, 5rem);
    align-items: center;
    width: min(92vw, 1100px);
    padding: 0 2rem;
  }

  /* --- Copy column --- */
  .copy-col {
    position: relative;
    min-height: 280px;
  }
  .copy-block {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .feature-icon {
    width: 44px;
    height: 44px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .feature-heading {
    font-family: 'Newsreader', Georgia, serif;
    font-size: clamp(1.35rem, 2.5vw, 1.75rem);
    font-weight: 400;
    color: rgba(0, 0, 0, 0.88);
    margin: 0 0 12px 0;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .feature-desc {
    font-size: 0.95rem;
    color: rgba(0, 0, 0, 0.55);
    line-height: 1.7;
    margin: 0 0 16px 0;
    max-width: 360px;
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }
  .tag {
    border-radius: 9999px;
    padding: 3px 11px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }
  .tag--blue {
    background: rgba(59, 130, 246, 0.08);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #2563eb;
  }

  /* --- Screenshot column --- */
  .shot-col {
    position: relative;
  }
  .screenshots {
    position: relative;
    width: 100%;
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
  }
  .anno-line {
    overflow: visible;
  }
  .anno-line path {
    stroke-linecap: round;
  }
  #anno-1 { top: 15%; right: 18%; }
  #anno-2 { top: 35%; left: 20%; }
  #anno-3 { top: 50%; right: 15%; }
  #anno-4 { bottom: 22%; left: 22%; }

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
    .stage-inner {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      width: 100%;
      padding: 0;
    }
    .copy-col {
      position: relative;
      min-height: auto;
    }
    .copy-block {
      position: relative !important;
      opacity: 1 !important;
      margin-bottom: 1rem;
    }
    .shot { position: relative !important; opacity: 1 !important; }
    .annotations, .progress, .intro-hint { display: none; }
  }
</style>
