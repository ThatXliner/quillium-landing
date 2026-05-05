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

    const stage = document.getElementById('features');
    if (!stage) return () => clearInterval(interval);

    const textCol = document.getElementById('text-col')!;
    const shotWrap = document.getElementById('shot-wrap')!;

    const shots = [
      document.getElementById('shot-editor')!,
      document.getElementById('shot-revision')!,
      document.getElementById('shot-comment')!,
      document.getElementById('shot-inline')!,
      document.getElementById('shot-library')!,
    ].filter(Boolean);

    const callouts = [
      { el: document.getElementById('callout-1')!, line: document.getElementById('line-1')! },
      { el: document.getElementById('callout-2')!, line: document.getElementById('line-2')! },
      { el: document.getElementById('callout-3')!, line: document.getElementById('line-3')! },
      { el: document.getElementById('callout-4')!, line: document.getElementById('line-4')! },
    ].filter((c) => c.el && c.line);

    const copies = [
      document.getElementById('copy-editor')!,
      document.getElementById('copy-branches')!,
      document.getElementById('copy-comments')!,
      document.getElementById('copy-inline')!,
      document.getElementById('copy-safety')!,
    ].filter(Boolean);

    const dots = document.querySelectorAll<HTMLElement>('.progress-dot');

    // Initial state
    shots.forEach((s, idx) => { if (idx > 0) gsap.set(s, { opacity: 0, scale: 0.95 }); });
    callouts.forEach((c) => {
      gsap.set(c.el, { opacity: 0, y: 12 });
      gsap.set(c.line, { strokeDashoffset: 200 });
    });
    copies.forEach((c, idx) => { if (idx > 0) gsap.set(c, { opacity: 0, y: 16 }); });
    dots.forEach((d, idx) => { if (idx > 0) gsap.set(d, { opacity: 0.25, scale: 1 }); });
    gsap.set('#hero-scroll-cta', { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=600%',
        pin: true,
        scrub: 1.2,
        onUpdate(self) {
          const p = self.progress;
          dots.forEach((dot, idx) => {
            const threshold = idx / (dots.length - 1);
            const active = p >= threshold - 0.02;
            gsap.to(dot, { opacity: active ? 0.9 : 0.25, scale: active ? 1.4 : 1, duration: 0.08, overwrite: true });
          });
        },
      },
    });

    // Phase 0: Side-by-side → screenshot centers (0% – 20%)
    tl.to(textCol, { opacity: 0, duration: 0.1 }, 0.08);
    // Animate shot from right column to center
    tl.to(shotWrap, { right: 'auto', left: '50%', xPercent: -50, yPercent: -50, top: '50%', width: 'min(88vw, 960px)', maxWidth: 'none', duration: 0.14 }, 0.06);
    tl.to(copies[0], { opacity: 0, y: -14, duration: 0.04 }, 0.16);

    // Phase 1: Branches (20% – 36%)
    tl.to(shots[0], { opacity: 0, scale: 1.12, duration: 0.05 }, 0.2);
    tl.to(shots[1], { opacity: 1, scale: 1, duration: 0.05 }, 0.22);
    tl.to(copies[1], { opacity: 1, y: 0, duration: 0.05 }, 0.22);
    tl.to(callouts[0].el, { opacity: 1, y: 0, duration: 0.04 }, 0.24);
    tl.to(callouts[0].line, { strokeDashoffset: 0, duration: 0.04 }, 0.24);

    // Phase 2: Comments (36% – 52%)
    tl.to(shots[1], { opacity: 0, scale: 1.1, duration: 0.05 }, 0.36);
    tl.to(copies[1], { opacity: 0, y: -14, duration: 0.03 }, 0.36);
    tl.to(callouts[0].el, { opacity: 0, y: -10, duration: 0.03 }, 0.36);
    tl.to(callouts[0].line, { strokeDashoffset: 200, duration: 0.03 }, 0.36);
    tl.to(shots[2], { opacity: 1, scale: 1, duration: 0.05 }, 0.38);
    tl.to(copies[2], { opacity: 1, y: 0, duration: 0.05 }, 0.38);
    tl.to(callouts[1].el, { opacity: 1, y: 0, duration: 0.04 }, 0.4);
    tl.to(callouts[1].line, { strokeDashoffset: 0, duration: 0.04 }, 0.4);

    // Phase 3: Inline (52% – 68%)
    tl.to(shots[2], { opacity: 0, scale: 1.1, duration: 0.05 }, 0.52);
    tl.to(copies[2], { opacity: 0, y: -14, duration: 0.03 }, 0.52);
    tl.to(callouts[1].el, { opacity: 0, y: -10, duration: 0.03 }, 0.52);
    tl.to(callouts[1].line, { strokeDashoffset: 200, duration: 0.03 }, 0.52);
    tl.to(shots[3], { opacity: 1, scale: 1, duration: 0.05 }, 0.54);
    tl.to(copies[3], { opacity: 1, y: 0, duration: 0.05 }, 0.54);
    tl.to(callouts[2].el, { opacity: 1, y: 0, duration: 0.04 }, 0.56);
    tl.to(callouts[2].line, { strokeDashoffset: 0, duration: 0.04 }, 0.56);

    // Phase 4: Safety (68% – 84%)
    tl.to(shots[3], { opacity: 0, scale: 1.1, duration: 0.05 }, 0.68);
    tl.to(copies[3], { opacity: 0, y: -14, duration: 0.03 }, 0.68);
    tl.to(callouts[2].el, { opacity: 0, y: -10, duration: 0.03 }, 0.68);
    tl.to(callouts[2].line, { strokeDashoffset: 200, duration: 0.03 }, 0.68);
    tl.to(shots[4], { opacity: 1, scale: 1, duration: 0.05 }, 0.7);
    tl.to(copies[4], { opacity: 1, y: 0, duration: 0.05 }, 0.7);
    tl.to(callouts[3].el, { opacity: 1, y: 0, duration: 0.04 }, 0.72);
    tl.to(callouts[3].line, { strokeDashoffset: 0, duration: 0.04 }, 0.72);

    // Fade to CTA (92% – 100%)
    tl.to(shots[4], { opacity: 0.3, scale: 1.05, duration: 0.07 }, 0.92);
    tl.to(copies[4], { opacity: 0, y: -14, duration: 0.04 }, 0.9);
    tl.to(callouts[3].el, { opacity: 0, y: -10, duration: 0.03 }, 0.9);
    tl.to(callouts[3].line, { strokeDashoffset: 200, duration: 0.03 }, 0.9);
    tl.to('#hero-scroll-cta', { opacity: 1, duration: 0.06 }, 0.94);

    scrollCtx = tl.scrollTrigger!;

    return () => clearInterval(interval);
  });

  onDestroy(() => { scrollCtx?.kill(); });
</script>

<section class="hero-scroll">
  <!-- Single pinned stage: starts side-by-side, transforms to centered -->
  <div class="stage" id="features">
    <div class="pinned">
      <!-- Text column (starts on left, fades out) -->
      <div class="text-col" id="text-col">
        <div class="logo-wrap">
          <img src="/logo.svg" alt="Quillium mark" width="80" height="80" />
        </div>
        <p class="eyebrow">The Non-Linear Writing App</p>
        <h1 class="headline">
          {displayText}{#if showPros}<span class="italic">Pros</span>{/if}{#if showPeriod}.{/if}<span class="cursor" class:hidden={!showCursor}>|</span>
        </h1>
        <p class="intro-desc">
          Write a sentence three different ways, and decide which to pick later. Branch any phrase without losing a single word.
        </p>
        <div class="intro-trust">
          <a href="/blog/quillium-is-not-an-ai-app" class="trust-link"><Pen size={14} strokeWidth={2} class="opacity-60" /> Write every word (No AI bs).</a>
          <a href="/blog/quillium-privacy" class="trust-link"><Lock size={14} strokeWidth={2} class="opacity-60" /> Fully private.</a>
          <a href="/blog/how-quillium-keeps-your-writing-safe" class="trust-link"><ShieldCheck size={14} strokeWidth={2} class="opacity-60" /> Safe and secure.</a>
        </div>
      </div>

      <!-- Screenshot wrap (starts on right, animates to center) -->
      <div class="shot-wrap" id="shot-wrap">
        <div class="screenshot-area">
          <div class="screenshots">
            <img src={editorImg} alt="" class="shot" id="shot-editor" />
            <img src={revisionImg} alt="" class="shot" id="shot-revision" />
            <img src={commentImg} alt="" class="shot" id="shot-comment" />
            <img src={inlineImg} alt="" class="shot" id="shot-inline" />
            <img src={libraryImg} alt="" class="shot" id="shot-library" />
          </div>
          <div class="callouts">
            <div class="callout" id="callout-1">
              <svg width="130" height="60" viewBox="0 0 130 60" class="callout-svg">
                <path id="line-1" d="M 5 45 Q 40 45 65 25 Q 85 10 120 8" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
                <circle cx="120" cy="8" r="3.5" fill="#a855f7" />
              </svg>
              <span class="callout-label" style="color:#a855f7;">Write in Branches</span>
            </div>
            <div class="callout" id="callout-2">
              <svg width="130" height="60" viewBox="0 0 130 60" class="callout-svg">
                <path id="line-2" d="M 125 45 Q 90 45 65 25 Q 45 10 10 8" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
                <circle cx="10" cy="8" r="3.5" fill="#d97706" />
              </svg>
              <span class="callout-label" style="color:#d97706;">Great Minds Think Together</span>
            </div>
            <div class="callout" id="callout-3">
              <svg width="140" height="60" viewBox="0 0 140 60" class="callout-svg">
                <path id="line-3" d="M 10 10 Q 45 25 70 35 Q 90 42 125 40" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
                <circle cx="125" cy="40" r="3.5" fill="#22c55e" />
              </svg>
              <span class="callout-label" style="color:#22c55e;">Nested Revisions, Inline</span>
            </div>
            <div class="callout" id="callout-4">
              <svg width="140" height="60" viewBox="0 0 140 60" class="callout-svg">
                <path id="line-4" d="M 70 5 Q 60 20 40 35 Q 25 45 10 48" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" />
                <circle cx="10" cy="48" r="3.5" fill="#3b82f6" />
              </svg>
              <span class="callout-label" style="color:#3b82f6;">Never Lose Your Work</span>
            </div>
          </div>
        </div>
        <div class="copy-strip">
          <div class="copy-block" id="copy-editor">
            <p class="copy-subtitle">Your writing, front and center.</p>
          </div>
          <div class="copy-block" id="copy-branches">
            <p class="copy-subtitle">Fork any sentence. Keep every version. Navigate your creative decisions freely and try what might work.</p>
          </div>
          <div class="copy-block" id="copy-comments">
            <p class="copy-subtitle">Comments, revisions, and suggestions float beside the text they're about.</p>
          </div>
          <div class="copy-block" id="copy-inline">
            <p class="copy-subtitle">See revision diffs right where they matter — in the text. Compare branches side-by-side without losing context.</p>
          </div>
          <div class="copy-block" id="copy-safety">
            <p class="copy-subtitle">Your work is saved locally — durable, reliable, instant. Even if your computer crashes mid-sentence, nothing is lost.</p>
            <div class="tag-list">
              <span class="tag tag--blue">Offline-first</span>
              <span class="tag tag--blue">SQLite-backed</span>
              <span class="tag tag--blue">Crash-resistant</span>
            </div>
          </div>
        </div>
      </div>

      <div class="progress" id="hero-scroll-progress">
        {#each [0, 1, 2, 3, 4] as i}
          <span class="dot" data-slide={i}></span>
        {/each}
      </div>
    </div>
  </div>

  <div class="cta-section" id="hero-scroll-cta">
    <a href={downloadUrl} class="btn-primary">Download Now</a>
  </div>
</section>

<style>
  .hero-scroll { width: 100%; background: #f5f4f1; }

  .stage { position: relative; width: 100%; background-color: #f5f4f1; overflow: hidden; }
  .pinned {
    width: 100%; height: 100vh; position: relative;
    display: flex; align-items: center;
  }

  /* --- Text column (left side initially) --- */
  .text-col {
    position: absolute; left: 6%; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; max-width: 400px; z-index: 2;
  }
  .logo-wrap {
    width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;
    border-radius: 22px; border: 1.5px solid rgba(255,255,255,0.35);
    background: radial-gradient(at 40% 35%, #eceef2, #cdd1d9); margin-bottom: 1rem;
  }
  .eyebrow {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase;
    color: rgba(0,0,0,0.35); margin: 0 0 0.75rem 0;
  }
  .headline {
    font-family: 'Newsreader', Georgia, serif; font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 400; line-height: 1.15; letter-spacing: -0.03em;
    color: rgba(0,0,0,0.88); margin: 0 0 1rem 0;
  }
  .italic { font-style: italic; }
  .cursor { font-weight: 300; animation: blink 0.6s step-end infinite; }
  .cursor.hidden { display: none; }
  @keyframes blink { 50% { opacity: 0; } }
  .intro-desc {
    font-size: 0.9rem; line-height: 1.6; color: rgba(0,0,0,0.5); margin: 0 0 1.25rem 0;
  }
  .intro-trust {
    display: flex; flex-wrap: wrap; gap: 0.85rem; padding-top: 1rem;
    border-top: 2px solid;
    border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;
  }
  .trust-link {
    display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.78rem;
    color: rgba(0,0,0,0.5); text-decoration: underline; text-underline-offset: 3px; transition: color 0.3s;
  }
  .trust-link:hover { color: rgba(0,0,0,0.7); }

  /* --- Screenshot wrap (starts on right, animates to center) --- */
  .shot-wrap {
    position: absolute; right: 4%; top: 50%; transform: translateY(-50%);
    width: 50%; max-width: 560px;
  }
  .screenshot-area { position: relative; width: 100%; }
  .screenshots { position: relative; width: 100%; aspect-ratio: 8 / 5; }
  .shot {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
    border-radius: 12px; box-shadow: 0 16px 64px rgba(44,42,39,0.1), 0 4px 16px rgba(44,42,39,0.05);
  }

  /* --- Callouts --- */
  .callouts { position: absolute; inset: 0; pointer-events: none; }
  .callout { position: absolute; display: flex; align-items: center; gap: 0; }
  .callout-svg { overflow: visible; flex-shrink: 0; }
  .callout-label {
    font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
    background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
    padding: 5px 12px; border-radius: 7px; box-shadow: 0 1px 10px rgba(0,0,0,0.08);
    white-space: nowrap; letter-spacing: -0.01em;
  }
  #callout-1 { top: 18%; left: 10%; flex-direction: row; }
  #callout-1 .callout-label { margin-left: -30px; margin-top: -8px; }
  #callout-2 { top: 34%; right: 8%; flex-direction: row-reverse; }
  #callout-2 .callout-label { margin-right: -20px; margin-top: -8px; }
  #callout-3 { top: 55%; left: 8%; flex-direction: row; }
  #callout-3 .callout-label { margin-left: -15px; }
  #callout-4 { bottom: 22%; right: 12%; flex-direction: row-reverse; }
  #callout-4 .callout-label { margin-right: -10px; margin-bottom: 4px; }

  /* --- Copy strip --- */
  .copy-strip { position: relative; width: 100%; min-height: 56px; margin-top: 1rem; }
  .copy-block {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  }
  .copy-subtitle {
    font-family: 'Newsreader', Georgia, serif; font-size: 1rem; font-style: italic;
    color: rgba(0,0,0,0.5); line-height: 1.6; margin: 0; max-width: 500px;
  }
  .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; justify-content: center; }
  .tag { border-radius: 9999px; padding: 3px 11px; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 500; }
  .tag--blue { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #2563eb; }

  /* --- Progress --- */
  .progress {
    position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 14px; z-index: 10;
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(0,0,0,0.2); transition: transform 0.25s ease; }

  /* --- CTA --- */
  .cta-section { display: flex; justify-content: center; padding: 6rem 2rem 7rem; background: #f5f4f1; }

  /* --- Mobile --- */
  @media (max-width: 767px) {
    .stage { overflow: visible; }
    .pinned { height: auto; flex-direction: column; padding: 2rem 1.25rem; gap: 1.5rem; }
    .text-col { position: relative !important; left: auto !important; top: auto !important; transform: none !important; max-width: 100%; }
    .shot-wrap { position: relative !important; right: auto !important; top: auto !important; transform: none !important; width: 100% !important; max-width: 100% !important; }
    .shot { position: relative !important; opacity: 1 !important; }
    .copy-block { position: relative !important; opacity: 1 !important; }
    .callouts, .progress { display: none; }
  }
</style>
