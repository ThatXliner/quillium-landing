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
      if (i < fullText.length) { displayText = fullText.slice(0, i + 1); i++; }
      else { showPros = true; clearInterval(interval); setTimeout(() => { showPeriod = true; setTimeout(() => showCursor = false, 600); }, 100); }
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
    ].filter(c => c.el && c.line);

    const copies = [
      document.getElementById('copy-editor')!,
      document.getElementById('copy-branches')!,
      document.getElementById('copy-comments')!,
      document.getElementById('copy-inline')!,
      document.getElementById('copy-safety')!,
    ].filter(Boolean);

    const dots = document.querySelectorAll<HTMLElement>('.progress-dot');

    // Initial state: hide non-first shots, callouts, non-first copies
    shots.forEach((s, idx) => { if (idx > 0) gsap.set(s, { opacity: 0 }); });
    callouts.forEach(c => { gsap.set(c.el, { opacity: 0, y: 12 }); gsap.set(c.line, { strokeDashoffset: 200 }); });
    copies.forEach((c, idx) => { if (idx > 0) gsap.set(c, { opacity: 0, y: 16 }); });
    dots.forEach((d, idx) => { if (idx > 0) gsap.set(d, { opacity: 0.25 }); });
    gsap.set('#hero-scroll-cta', { opacity: 0 });

    // Measure where the shot naturally sits (in the right grid column), calculate center offset
    const shotRect = shotWrap.getBoundingClientRect();
    const vw = window.innerWidth;
    const targetW = Math.min(vw * 0.88, 960);
    const targetScale = targetW / shotRect.width;
    const targetCenterX = vw / 2;
    const currentCenterX = shotRect.left + shotRect.width / 2;
    const moveX = targetCenterX - currentCenterX;
    const currentCenterY = shotRect.top + shotRect.height / 2;
    const moveY = window.innerHeight / 2 - currentCenterY;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=600%', pin: true, scrub: 1.2,
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

    // Phase 0: text fades, screenshot slides to center + scales up (0%–18%)
    tl.to(textCol, { opacity: 0, x: -40, duration: 0.12 }, 0.06);
    tl.to(shotWrap, { x: moveX, y: moveY, scale: targetScale, duration: 0.15 }, 0.06);
    tl.to(copies[0], { opacity: 0, y: -14, duration: 0.04 }, 0.15);

    // Phase 1: Branches (18%–34%)
    tl.to(shots[0], { opacity: 0, duration: 0.05 }, 0.18);
    tl.to(shots[1], { opacity: 1, duration: 0.05 }, 0.2);
    tl.to(copies[1], { opacity: 1, y: 0, duration: 0.05 }, 0.2);
    tl.to(callouts[0].el, { opacity: 1, y: 0, duration: 0.04 }, 0.22);
    tl.to(callouts[0].line, { strokeDashoffset: 0, duration: 0.04 }, 0.22);

    // Phase 2: Comments (34%–50%)
    tl.to(shots[1], { opacity: 0, duration: 0.05 }, 0.34);
    tl.to(copies[1], { opacity: 0, y: -14, duration: 0.03 }, 0.34);
    tl.to(callouts[0].el, { opacity: 0, y: -10, duration: 0.03 }, 0.34);
    tl.to(callouts[0].line, { strokeDashoffset: 200, duration: 0.03 }, 0.34);
    tl.to(shots[2], { opacity: 1, duration: 0.05 }, 0.36);
    tl.to(copies[2], { opacity: 1, y: 0, duration: 0.05 }, 0.36);
    tl.to(callouts[1].el, { opacity: 1, y: 0, duration: 0.04 }, 0.38);
    tl.to(callouts[1].line, { strokeDashoffset: 0, duration: 0.04 }, 0.38);

    // Phase 3: Inline (50%–66%)
    tl.to(shots[2], { opacity: 0, duration: 0.05 }, 0.5);
    tl.to(copies[2], { opacity: 0, y: -14, duration: 0.03 }, 0.5);
    tl.to(callouts[1].el, { opacity: 0, y: -10, duration: 0.03 }, 0.5);
    tl.to(callouts[1].line, { strokeDashoffset: 200, duration: 0.03 }, 0.5);
    tl.to(shots[3], { opacity: 1, duration: 0.05 }, 0.52);
    tl.to(copies[3], { opacity: 1, y: 0, duration: 0.05 }, 0.52);
    tl.to(callouts[2].el, { opacity: 1, y: 0, duration: 0.04 }, 0.54);
    tl.to(callouts[2].line, { strokeDashoffset: 0, duration: 0.04 }, 0.54);

    // Phase 4: Safety (66%–82%)
    tl.to(shots[3], { opacity: 0, duration: 0.05 }, 0.66);
    tl.to(copies[3], { opacity: 0, y: -14, duration: 0.03 }, 0.66);
    tl.to(callouts[2].el, { opacity: 0, y: -10, duration: 0.03 }, 0.66);
    tl.to(callouts[2].line, { strokeDashoffset: 200, duration: 0.03 }, 0.66);
    tl.to(shots[4], { opacity: 1, duration: 0.05 }, 0.68);
    tl.to(copies[4], { opacity: 1, y: 0, duration: 0.05 }, 0.68);
    tl.to(callouts[3].el, { opacity: 1, y: 0, duration: 0.04 }, 0.7);
    tl.to(callouts[3].line, { strokeDashoffset: 0, duration: 0.04 }, 0.7);

    // CTA (92%–100%)
    tl.to(shots[4], { opacity: 0.3, duration: 0.07 }, 0.92);
    tl.to(copies[4], { opacity: 0, y: -14, duration: 0.04 }, 0.9);
    tl.to(callouts[3].el, { opacity: 0, y: -10, duration: 0.03 }, 0.9);
    tl.to(callouts[3].line, { strokeDashoffset: 200, duration: 0.03 }, 0.9);
    tl.to('#hero-scroll-cta', { opacity: 1, duration: 0.06 }, 0.94);

    scrollCtx = tl.scrollTrigger!;
    return () => clearInterval(interval);
  });

  onDestroy(() => { scrollCtx?.kill(); });
</script>

<section class="w-full bg-[#f5f4f1]">
  <div id="features" class="relative w-full overflow-hidden bg-[#f5f4f1] max-md:overflow-visible">
    <div class="flex h-screen w-full items-center justify-center max-md:h-auto max-md:px-5 max-md:py-8">
      <div class="stage-inner grid w-[min(94vw,1150px)] grid-cols-2 items-center gap-[clamp(2rem,5vw,5rem)] px-8 max-md:grid-cols-1">
        <!-- Text column (grid left) -->
        <div id="text-col" class="flex flex-col pl-[clamp(0px,2vw,2rem)]">
          <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/35 bg-[radial-gradient(at_40%_35%,#eceef2,#cdd1d9)]">
            <img src="/logo.svg" alt="Quillium mark" width="72" height="72" />
          </div>
          <p class="mb-3 m-0 text-[0.7rem] font-semibold tracking-[0.13em] uppercase text-black/35">The Non-Linear Writing App</p>
          <h1 class="mb-4 m-0 font-serif text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] tracking-[-0.03em] text-black/88" style="font-family: 'Newsreader', Georgia, serif;">
            {displayText}{#if showPros}<span class="italic">Pros</span>{/if}{#if showPeriod}.{/if}<span class="animate-blink" class:hidden={!showCursor}>|</span>
          </h1>
          <p class="mb-5 m-0 text-[0.9rem] leading-[1.6] text-black/50">Write a sentence three different ways, and decide which to pick later. Branch any phrase without losing a single word.</p>
          <div class="flex flex-wrap gap-[0.85rem] border-t-2 pt-4" style="border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;">
            <a href="/blog/quillium-is-not-an-ai-app" class="trust-link"><Pen size={14} strokeWidth={2} class="opacity-60" /> Write every word (No AI bs).</a>
            <a href="/blog/quillium-privacy" class="trust-link"><Lock size={14} strokeWidth={2} class="opacity-60" /> Fully private.</a>
            <a href="/blog/how-quillium-keeps-your-writing-safe" class="trust-link"><ShieldCheck size={14} strokeWidth={2} class="opacity-60" /> Safe and secure.</a>
          </div>
        </div>

        <!-- Screenshot (grid right, GSAP animates it to center) -->
        <div id="shot-wrap" class="will-change-transform">
          <div class="relative w-full">
            <div class="relative w-full aspect-[8/5]">
              <img src={editorImg} alt="" id="shot-editor" class="absolute inset-0 h-full w-full rounded-xl object-contain shadow-[0_16px_64px_rgba(44,42,39,0.1),0_4px_16px_rgba(44,42,39,0.05)]" />
              <img src={revisionImg} alt="" id="shot-revision" class="absolute inset-0 h-full w-full rounded-xl object-contain shadow-[0_16px_64px_rgba(44,42,39,0.1),0_4px_16px_rgba(44,42,39,0.05)]" />
              <img src={commentImg} alt="" id="shot-comment" class="absolute inset-0 h-full w-full rounded-xl object-contain shadow-[0_16px_64px_rgba(44,42,39,0.1),0_4px_16px_rgba(44,42,39,0.05)]" />
              <img src={inlineImg} alt="" id="shot-inline" class="absolute inset-0 h-full w-full rounded-xl object-contain shadow-[0_16px_64px_rgba(44,42,39,0.1),0_4px_16px_rgba(44,42,39,0.05)]" />
              <img src={libraryImg} alt="" id="shot-library" class="absolute inset-0 h-full w-full rounded-xl object-contain shadow-[0_16px_64px_rgba(44,42,39,0.1),0_4px_16px_rgba(44,42,39,0.05)]" />
            </div>
            <div id="callouts-wrap" class="pointer-events-none absolute inset-0">
              <div id="callout-1" class="absolute" style="top:18%;left:10%;">
                <svg width="130" height="60" viewBox="0 0 130 60" class="overflow-visible flex-shrink-0"><path id="line-1" d="M 5 45 Q 40 45 65 25 Q 85 10 120 8" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" /><circle cx="120" cy="8" r="3.5" fill="#a855f7" /></svg>
                <span class="ml-[-30px] mt-[-8px] whitespace-nowrap rounded-lg bg-white/90 px-3 py-[5px] text-[0.78rem] font-semibold tracking-[-0.01em] text-[#a855f7] shadow-[0_1px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl" style="font-family:'Inter',sans-serif;">Write in Branches</span>
              </div>
              <div id="callout-2" class="absolute" style="top:34%;right:8%;">
                <svg width="130" height="60" viewBox="0 0 130 60" class="overflow-visible flex-shrink-0"><path id="line-2" d="M 125 45 Q 90 45 65 25 Q 45 10 10 8" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" /><circle cx="10" cy="8" r="3.5" fill="#d97706" /></svg>
                <span class="mr-[-20px] mt-[-8px] whitespace-nowrap rounded-lg bg-white/90 px-3 py-[5px] text-[0.78rem] font-semibold tracking-[-0.01em] text-[#d97706] shadow-[0_1px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl" style="font-family:'Inter',sans-serif;">Great Minds Think Together</span>
              </div>
              <div id="callout-3" class="absolute" style="top:55%;left:8%;">
                <svg width="140" height="60" viewBox="0 0 140 60" class="overflow-visible flex-shrink-0"><path id="line-3" d="M 10 10 Q 45 25 70 35 Q 90 42 125 40" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" /><circle cx="125" cy="40" r="3.5" fill="#22c55e" /></svg>
                <span class="ml-[-15px] whitespace-nowrap rounded-lg bg-white/90 px-3 py-[5px] text-[0.78rem] font-semibold tracking-[-0.01em] text-[#22c55e] shadow-[0_1px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl" style="font-family:'Inter',sans-serif;">Nested Revisions, Inline</span>
              </div>
              <div id="callout-4" class="absolute" style="bottom:22%;right:12%;">
                <svg width="140" height="60" viewBox="0 0 140 60" class="overflow-visible flex-shrink-0"><path id="line-4" d="M 70 5 Q 60 20 40 35 Q 25 45 10 48" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" /><circle cx="10" cy="48" r="3.5" fill="#3b82f6" /></svg>
                <span class="mr-[-10px] mb-1 whitespace-nowrap rounded-lg bg-white/90 px-3 py-[5px] text-[0.78rem] font-semibold tracking-[-0.01em] text-[#3b82f6] shadow-[0_1px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl" style="font-family:'Inter',sans-serif;">Never Lose Your Work</span>
              </div>
            </div>
          </div>
          <div class="relative mt-4 w-full min-h-[56px]">
            <div id="copy-editor" class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p class="m-0 max-w-[500px] font-serif text-base italic leading-[1.6] text-black/50" style="font-family:'Newsreader',Georgia,serif;">Your writing, front and center.</p>
            </div>
            <div id="copy-branches" class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p class="m-0 max-w-[500px] font-serif text-base italic leading-[1.6] text-black/50" style="font-family:'Newsreader',Georgia,serif;">Fork any sentence. Keep every version. Navigate your creative decisions freely and try what might work.</p>
            </div>
            <div id="copy-comments" class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p class="m-0 max-w-[500px] font-serif text-base italic leading-[1.6] text-black/50" style="font-family:'Newsreader',Georgia,serif;">Comments, revisions, and suggestions float beside the text they're about. Collaborate with your editor, anytime and anywhere.</p>
            </div>
            <div id="copy-inline" class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p class="m-0 max-w-[500px] font-serif text-base italic leading-[1.6] text-black/50" style="font-family:'Newsreader',Georgia,serif;">See revision diffs right where they matter — in the text. Compare branches side-by-side without losing context.</p>
            </div>
            <div id="copy-safety" class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p class="m-0 max-w-[500px] font-serif text-base italic leading-[1.6] text-black/50" style="font-family:'Newsreader',Georgia,serif;">Your work is saved locally — durable, reliable, instant. Even if your computer crashes mid-sentence, nothing is lost.</p>
              <div class="mt-[10px] flex flex-wrap justify-center gap-2">
                <span class="rounded-full border border-blue-500/20 bg-blue-500/8 px-[11px] py-[3px] text-xs font-medium text-blue-600" style="font-family:'Inter',sans-serif;">Offline-first</span>
                <span class="rounded-full border border-blue-500/20 bg-blue-500/8 px-[11px] py-[3px] text-xs font-medium text-blue-600" style="font-family:'Inter',sans-serif;">SQLite-backed</span>
                <span class="rounded-full border border-blue-500/20 bg-blue-500/8 px-[11px] py-[3px] text-xs font-medium text-blue-600" style="font-family:'Inter',sans-serif;">Crash-resistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="hero-scroll-progress" class="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-[14px]">
        {#each [0, 1, 2, 3, 4] as i}
          <span class="progress-dot h-[7px] w-[7px] rounded-full bg-black/20 transition-transform duration-300" data-slide={i}></span>
        {/each}
      </div>
    </div>
  </div>
  <div id="hero-scroll-cta" class="flex justify-center bg-[#f5f4f1] px-8 pb-28 pt-24">
    <a href={downloadUrl} class="btn-primary">Download Now</a>
  </div>
</section>

<style>
  @keyframes blink { 50% { opacity: 0; } }
  .animate-blink { animation: blink 0.6s step-end infinite; }

  .trust-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.78rem;
    color: rgba(0, 0, 0, 0.5);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.3s;
  }
  .trust-link:hover { color: rgba(0, 0, 0, 0.7); }

  @media (max-width: 767px) {
    :global(#shot-editor),
    :global(#shot-revision),
    :global(#shot-comment),
    :global(#shot-inline),
    :global(#shot-library),
    :global(#copy-editor),
    :global(#copy-branches),
    :global(#copy-comments),
    :global(#copy-inline),
    :global(#copy-safety) { position: relative !important; opacity: 1 !important; }
    :global(#callouts-wrap),
    :global(#hero-scroll-progress) { display: none !important; }
  }
</style>
