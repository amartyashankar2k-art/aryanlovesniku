/**
 * ========================================================
 * AARU & NIKKU'S ROMANTIC JOURNEY JAVASCRIPT
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------
   * 1. APP STATE & LOCAL STORAGE
   * ---------------------------------------------------- */
  const state = {
    currentStep: 1,
    totalSteps: 9,
    envelopeOpened: false,
    musicPlaying: false,
    answers: {
      best: localStorage.getItem('nikku_answer_best') || '',
      worst: localStorage.getItem('nikku_answer_worst') || '',
      feelings: localStorage.getItem('nikku_answer_feelings') || '',
      marry: 'Yes',
      safe: 'Yes'
    }
  };

  /* ----------------------------------------------------
   * 2. AUDIO SYNTHESIZER (Web Audio API)
   * Plays romantic soft chimes, kisses, and ambient melody
   * Works 100% offline with zero external audio assets!
   * ---------------------------------------------------- */
  class RomanticAudioSynth {
    constructor() {
      this.ctx = null;
      this.bgmTimer = null;
      this.isMelodyPlaying = false;
      this.melodyIndex = 0;
      // Romantic arpeggio note frequencies (C major / A minor pentatonic romantic scale)
      this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      // Romantic chord progression arpeggio notes
      this.melodyNotes = [
        523.25, 659.25, 783.99, 659.25, 440.00, 523.25, 659.25, 523.25,
        392.00, 493.88, 587.33, 493.88, 349.23, 440.00, 523.25, 440.00
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Play a gentle bell / chime note
    playChime(freq = 587.33, duration = 1.2, type = 'sine') {
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio not yet permitted by browser interaction', e);
      }
    }

    // Play a romantic chord (3 notes together)
    playChord(freqs = [261.63, 329.63, 392.00]) {
      freqs.forEach((f, idx) => {
        setTimeout(() => this.playChime(f, 1.6, 'triangle'), idx * 70);
      });
    }

    // Play kiss sound effect (sweet pop & chirp)
    playKiss() {
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);

        // Secondary chime after kiss
        setTimeout(() => this.playChime(880, 1.2), 120);
      } catch (e) {}
    }

    // Play wedding chime for proposal
    playWeddingChime() {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((note, i) => {
        setTimeout(() => this.playChime(note, 2.0, 'sine'), i * 220);
      });
    }

    // Background romantic soothing melody loop
    startMelody() {
      this.init();
      this.isMelodyPlaying = true;
      const playNextNote = () => {
        if (!this.isMelodyPlaying) return;
        const note = this.melodyNotes[this.melodyIndex % this.melodyNotes.length];
        this.playChime(note, 1.4, 'sine');
        this.melodyIndex++;
        this.bgmTimer = setTimeout(playNextNote, 600);
      };
      playNextNote();
    }

    stopMelody() {
      this.isMelodyPlaying = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  const audioSynth = new RomanticAudioSynth();

  /* ----------------------------------------------------
   * 3. MUSIC CONTROLLER (Toggle BGM)
   * ---------------------------------------------------- */
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');

  function toggleMusic() {
    state.musicPlaying = !state.musicPlaying;
    if (state.musicPlaying) {
      audioSynth.startMelody();
      musicBtn.classList.add('playing');
      musicIcon.className = 'fa-solid fa-volume-high';
      showToast('🎵 Playing our romantic melody...');
    } else {
      audioSynth.stopMelody();
      musicBtn.classList.remove('playing');
      musicIcon.className = 'fa-solid fa-music';
      showToast('Music paused');
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  /* ----------------------------------------------------
   * 4. BACKGROUND CANVAS: FLOATING HEARTS & STARS
   * ---------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const maxParticles = 45;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(isBurst = false, burstX = 0, burstY = 0) {
      this.reset(isBurst, burstX, burstY);
    }

    reset(isBurst = false, burstX = 0, burstY = 0) {
      this.isBurst = isBurst;
      if (isBurst) {
        this.x = burstX;
        this.y = burstY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
      } else {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 40;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 1.2 + 0.6);
        this.life = 1;
        this.decay = 0;
      }

      this.size = Math.random() * 14 + 10;
      this.type = Math.random() > 0.4 ? 'heart' : 'star';
      this.color = Math.random() > 0.5 ? 'rgba(255, 77, 109, ' : 'rgba(255, 183, 3, ';
      this.opacity = Math.random() * 0.5 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;

      if (this.isBurst) {
        this.life -= this.decay;
        this.vx *= 0.96;
        this.vy *= 0.96;
      } else {
        // Floating sway
        this.vx += Math.sin(this.y * 0.02) * 0.02;
        if (this.y < -30) {
          this.reset(false);
        }
      }
    }

    draw() {
      const alpha = this.isBurst ? this.life * this.opacity : this.opacity;
      if (alpha <= 0) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color + alpha + ')';

      if (this.type === 'heart') {
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, s / 4);
        ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
        ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, s / 4);
        ctx.fill();
      } else {
        // Twinkling Star
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size * 0.6,
                     -Math.sin((18 + i * 72) * Math.PI / 180) * this.size * 0.6);
          ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * this.size * 0.3,
                     -Math.sin((54 + i * 72) * Math.PI / 180) * this.size * 0.3);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Populate floating particles
  for (let i = 0; i < maxParticles; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // initial scatter
    particles.push(p);
  }

  // Interactive Burst on Click / Tap anywhere
  window.addEventListener('click', (e) => {
    // Don't burst if clicking directly on buttons
    if (e.target.closest('button, input, textarea, a')) return;
    for (let i = 0; i < 8; i++) {
      particles.push(new Particle(true, e.clientX, e.clientY));
    }
  });

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.isBurst && p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* ----------------------------------------------------
   * 5. NAVIGATION / STEP CONTROLLER
   * ---------------------------------------------------- */
  const stepPages = document.querySelectorAll('.step-page');
  const progressFill = document.getElementById('progressFill');
  const stepIndicator = document.getElementById('stepIndicator');

  function goToStep(step) {
    if (step < 1 || step > state.totalSteps) return;
    state.currentStep = step;

    // Update active class
    stepPages.forEach(page => {
      const pageStep = parseInt(page.getAttribute('data-step'), 10);
      if (pageStep === step) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Update progress tracker
    const percent = (step / state.totalSteps) * 100;
    progressFill.style.width = `${percent}%`;
    stepIndicator.textContent = `Step ${step} of ${state.totalSteps}`;

    // Play subtle navigation chord
    audioSynth.playChord([329.63, 392.00, 523.25]);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger special actions on certain pages
    if (step === 8) {
      if (typeof reelPlayer !== 'undefined') {
        reelPlayer.initCanvas();
      }
    } else {
      if (typeof reelPlayer !== 'undefined' && reelPlayer.isPlaying) {
        reelPlayer.pause();
      }
    }

    if (step === 9) {
      launchGrandFinaleConfetti();
    }
  }

  /* ----------------------------------------------------
   * 6. PAGE 1: ENVELOPE OPENING & RUNAWAY "NO" BUTTON
   * ---------------------------------------------------- */
  const envelopeBox = document.getElementById('envelopeBox');
  const waxSeal = document.getElementById('waxSeal');
  const page1QuestionArea = document.getElementById('page1QuestionArea');

  function openEnvelope() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;
    envelopeBox.classList.add('opened');
    audioSynth.playChord([261.63, 329.63, 523.25, 659.25]);

    // Confetti burst from envelope
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Smooth scroll down to question card after short delay
    setTimeout(() => {
      page1QuestionArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Aaru: I hope you love this surprise! ❤️');
    }, 900);
  }

  envelopeBox.addEventListener('click', openEnvelope);
  waxSeal.addEventListener('click', openEnvelope);

  // Runaway "No" buttons generator for any button with class .runaway-btn
  function setupRunawayButton(buttonId, customMessages = []) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    const defaultMessages = [
      'No 🙈',
      'Are you sure? 🥺',
      'Wrong button! 😜',
      'Hey Nikku! 🙈',
      'Nice try! 💕',
      'Click YES instead! 🥰',
      'Catch me! 🏃‍♀️💨',
      'Only YES allowed! 💖'
    ];
    const messages = customMessages.length ? customMessages : defaultMessages;
    let msgIndex = 0;

    const dodge = (e) => {
      if (e) e.preventDefault();
      
      const parent = btn.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      // Random offset within reasonable bounds
      const maxOffsetX = Math.min(130, (parentRect.width - btnRect.width) / 2);
      const maxOffsetY = 45;

      const randomX = (Math.random() - 0.5) * (maxOffsetX * 2);
      const randomY = (Math.random() - 0.5) * (maxOffsetY * 2);

      btn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.92)`;

      // Cycle cute message
      msgIndex = (msgIndex + 1) % messages.length;
      btn.textContent = messages[msgIndex];

      // Subtle audio pop
      audioSynth.playChime(784, 0.2, 'triangle');
    };

    // Desktop hover & Mobile touch/pointer events
    btn.addEventListener('mouseenter', dodge);
    btn.addEventListener('touchstart', dodge, { passive: false });
    btn.addEventListener('pointerdown', dodge);
    btn.addEventListener('click', dodge);
  }

  // Setup runaway buttons on Page 1, Page 4, Page 5
  setupRunawayButton('btnP1No', [
    'No 🙈', 'Are you sure? 🥺', 'Wrong answer! 😜', 'Try YES instead! 💕', 'Hehe, caught you! 💖'
  ]);
  setupRunawayButton('btnP4No', [
    'No 🙈', 'Think again! 💍', 'Say YES! 👰‍♀️', 'Aaru is waiting! 🥰', 'You know you want to! ✨'
  ]);
  setupRunawayButton('btnP5No', [
    'No 🤔', 'I will always protect you! 🫂', 'You are my safe haven! 🏡', 'Always safe with me! 💖'
  ]);

  // Page 1 "Yes" Button
  document.getElementById('btnP1Yes').addEventListener('click', () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    showToast('I knew it! My heart is all yours! 🥰');
    setTimeout(() => goToStep(2), 700);
  });

  /* ----------------------------------------------------
   * 7. PAGE 2: BEST & WORST & KISSING EMOJI TRIGGER
   * ---------------------------------------------------- */
  const formPage2 = document.getElementById('formPage2');
  const inputBest = document.getElementById('inputBest');
  const inputWorst = document.getElementById('inputWorst');
  const kissOverlay = document.getElementById('kissOverlay');
  const kissHeartsBurst = document.getElementById('kissHeartsBurst');

  // Pre-fill answers if stored
  if (state.answers.best) inputBest.value = state.answers.best;
  if (state.answers.worst) inputWorst.value = state.answers.worst;

  formPage2.addEventListener('submit', (e) => {
    e.preventDefault();
    const bestVal = inputBest.value.trim();
    const worstVal = inputWorst.value.trim();

    if (!bestVal || !worstVal) {
      showToast('Please share both best and worst, Nikku! 🥰');
      return;
    }

    // Save answers
    state.answers.best = bestVal;
    state.answers.worst = worstVal;
    localStorage.setItem('nikku_answer_best', bestVal);
    localStorage.setItem('nikku_answer_worst', worstVal);

    // Trigger cute kissing emoji animation (MANDATORY ACTION)
    triggerKissingAnimation(() => {
      goToStep(3);
    });
  });

  function triggerKissingAnimation(onComplete) {
    // Show overlay
    kissOverlay.classList.add('active');
    audioSynth.playKiss();

    // Spawn flying kisses & hearts
    kissHeartsBurst.innerHTML = '';
    const heartEmojis = ['💋', '💖', '💕', '😘', '❤️', '🌸'];

    for (let i = 0; i < 22; i++) {
      const heart = document.createElement('span');
      heart.className = 'flying-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 260 + 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 60;

      heart.style.setProperty('--tx', `${tx}px`);
      heart.style.setProperty('--ty', `${ty}px`);
      heart.style.setProperty('--rot', `${rot}deg`);
      heart.style.left = '50%';
      heart.style.top = '50%';
      heart.style.animationDelay = `${Math.random() * 0.3}s`;

      kissHeartsBurst.appendChild(heart);
    }

    // Mini confetti burst
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.5 }
    });

    // Hold kissing animation for 2.4 seconds then transition
    setTimeout(() => {
      kissOverlay.classList.remove('active');
      if (onComplete) onComplete();
    }, 2400);
  }

  /* ----------------------------------------------------
   * 8. PAGE 3: FEELINGS & QUICK TAG PILLS
   * ---------------------------------------------------- */
  const formPage3 = document.getElementById('formPage3');
  const inputFeelings = document.getElementById('inputFeelings');
  const feelingPills = document.querySelectorAll('.tag-pill');
  const btnP3Back = document.getElementById('btnP3Back');

  if (state.answers.feelings) inputFeelings.value = state.answers.feelings;

  // Tag pill quick click adds to textarea
  feelingPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const feelText = pill.getAttribute('data-feel');
      if (!inputFeelings.value.includes(feelText)) {
        inputFeelings.value = inputFeelings.value ? `${inputFeelings.value}, ${feelText}` : feelText;
        pill.classList.add('active');
      }
      audioSynth.playChime(659.25, 0.4);
    });
  });

  formPage3.addEventListener('submit', (e) => {
    e.preventDefault();
    const feelingsVal = inputFeelings.value.trim();
    if (!feelingsVal) {
      showToast('Please tell me how you feel, sweetheart! 💖');
      return;
    }
    state.answers.feelings = feelingsVal;
    localStorage.setItem('nikku_answer_feelings', feelingsVal);
    goToStep(4);
  });

  btnP3Back.addEventListener('click', () => goToStep(2));

  /* ----------------------------------------------------
   * 9. PAGE 4: THE BIG QUESTION (MARRIAGE PROPOSAL)
   * ---------------------------------------------------- */
  const btnP4Yes = document.getElementById('btnP4Yes');

  btnP4Yes.addEventListener('click', () => {
    // Proposal celebrations
    audioSynth.playWeddingChime();

    // Large confetti fireworks
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });

    showToast('💍 Forever starts with you! Aaru & Nikku forever! 👰‍♀️❤️🤵‍♂️');
    setTimeout(() => goToStep(5), 1500);
  });

  /* ----------------------------------------------------
   * 10. PAGE 5: SAFE PLACE
   * ---------------------------------------------------- */
  const btnP5Yes = document.getElementById('btnP5Yes');

  btnP5Yes.addEventListener('click', () => {
    audioSynth.playChord([392.00, 523.25, 659.25]);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    showToast('You will always be safe in my arms, Nikku. Always. 🫂💕');
    setTimeout(() => goToStep(6), 1100);
  });

  /* ----------------------------------------------------
   * 11. PAGE 6: THE LOVE LETTER
   * ---------------------------------------------------- */
  document.getElementById('btnP6Back').addEventListener('click', () => goToStep(5));
  document.getElementById('btnP6Next').addEventListener('click', () => goToStep(7));

  /* ----------------------------------------------------
   * 12. PAGE 7: PHOTO GALLERY & LIGHTBOX
   * ---------------------------------------------------- */
  document.getElementById('btnP7Back').addEventListener('click', () => goToStep(6));
  document.getElementById('btnP7Next').addEventListener('click', () => goToStep(8));

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const polaroidCards = document.querySelectorAll('.polaroid-card');
  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const quote = card.querySelector('.quote-text');
      if (img) {
        lightboxImage.src = img.src;
        lightboxCaption.textContent = quote ? quote.textContent : '';
        lightboxModal.classList.add('active');
        audioSynth.playChime(659.25, 0.4);
      }
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ----------------------------------------------------
   * 13. PAGE 8: A SPECIAL VIDEO - LOVE PHOTO REEL MONTAGE
   * Plays a cinematic video montage of all 19 photos with
   * romantic love music, transitions, and cute border!
   * ---------------------------------------------------- */
  document.getElementById('btnP8Back').addEventListener('click', () => goToStep(7));
  document.getElementById('btnP8Next').addEventListener('click', () => goToStep(9));

  const reelData = [
    { src: 'images/photo1.jpg', quote: '"In your smile, I see something more beautiful than all the stars."' },
    { src: 'images/photo2.jpg', quote: '"Two souls, one heartbeat, better together forever and always."' },
    { src: 'images/photo3.jpg', quote: '"Even among thousands of fairy lights, the brightest light is your eyes."' },
    { src: 'images/photo4.jpg', quote: '"Holding you close and walking through life with you is my greatest joy."' },
    { src: 'images/photo5.jpg', quote: '"You stole my heart from day one, and I never want it back."' },
    { src: 'images/photo6.jpg', quote: '"As long as I\'m holding your hands, I know I\'m right where I belong."' },
    { src: 'images/photo7.jpg', quote: '"Your smile is my daily dose of sunshine and happiness."' },
    { src: 'images/photo8.jpg', quote: '"Every celebration is ten times more special because you are by my side."' },
    { src: 'images/photo9.jpg', quote: '"No crowd, no noise could ever distract my eyes from you."' },
    { src: 'images/photo10.jpg', quote: '"With you, every single memory is wrapped in golden light and pure love."' },
    { src: 'images/photo11.jpg', quote: '"In red, you don\'t just take my breath away, you own every heartbeat."' },
    { src: 'images/photo12.jpg', quote: '"Your smile is my favorite reason to fall in love with life every morning."' },
    { src: 'images/photo13.jpg', quote: '"You look like a dream carved out of sunshine, grace, and pure love."' },
    { src: 'images/photo14.jpg', quote: '"You bring all the vibrant colors of love and laughter into my world."' },
    { src: 'images/photo15.jpg', quote: '"Wherever life leads us, as long as I have you, I have everything."' },
    { src: 'images/photo16.jpg', quote: '"You look like an absolute royal queen. In every crowd, you\'re the only star."' },
    { src: 'images/photo17.jpg', quote: '"Even in a garden full of blooming flowers, my eyes will always choose you."' },
    { src: 'images/photo18.jpg', quote: '"That innocent, adorable smile is the only poetry my heart ever needs."' },
    { src: 'images/photo19.jpg', quote: '"Just looking at your sweet face makes every worry in my world vanish."' }
  ];

  class RomanticPhotoReel {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.slides = reelData;
      this.slideDuration = 5.0; // 5 seconds per slide = 95s total video
      this.totalDuration = this.slides.length * this.slideDuration;
      this.currentTime = 0;
      this.isPlaying = false;
      this.isAudioMuted = false;
      this.lastTimestamp = null;
      this.animId = null;

      // Preloaded image elements
      this.images = [];
      this.loadedCount = 0;
      this.preloadImages();

      // UI Controls
      this.playOverlay = document.getElementById('reelPlayOverlay');
      this.playBtn = document.getElementById('reelPlayBtn');
      this.ctrlPlayBtn = document.getElementById('reelCtrlPlay');
      this.ctrlPlayIcon = document.getElementById('reelCtrlPlayIcon');
      this.ctrlPrevBtn = document.getElementById('reelCtrlPrev');
      this.ctrlNextBtn = document.getElementById('reelCtrlNext');
      this.ctrlAudioBtn = document.getElementById('reelCtrlAudio');
      this.ctrlAudioIcon = document.getElementById('reelCtrlAudioIcon');
      this.progressWrap = document.getElementById('reelProgressWrap');
      this.progressFill = document.getElementById('reelProgressFill');
      this.timeDisplay = document.getElementById('reelTimeDisplay');
      this.counterBadge = document.getElementById('reelCounterBadge');
      this.quoteText = document.getElementById('reelQuoteText');
      this.downloadBtn = document.getElementById('btnDownloadReel');

      this.bindEvents();
    }

    preloadImages() {
      this.slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.src;
        img.onload = () => {
          this.loadedCount++;
          if (this.loadedCount === 1) {
            this.renderFrame(0);
          }
        };
        this.images.push(img);
      });
    }

    initCanvas() {
      if (!this.canvas) return;
      this.renderFrame(this.currentTime);
      this.updateUI();
    }

    bindEvents() {
      if (!this.playBtn) return;

      const togglePlay = () => {
        if (this.isPlaying) this.pause();
        else this.play();
      };

      this.playBtn.addEventListener('click', togglePlay);
      this.ctrlPlayBtn.addEventListener('click', togglePlay);
      this.canvas.addEventListener('click', togglePlay);

      this.ctrlPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentIdx = Math.floor(this.currentTime / this.slideDuration);
        const prevIdx = (currentIdx - 1 + this.slides.length) % this.slides.length;
        this.seek(prevIdx * this.slideDuration);
      });

      this.ctrlNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentIdx = Math.floor(this.currentTime / this.slideDuration);
        const nextIdx = (currentIdx + 1) % this.slides.length;
        this.seek(nextIdx * this.slideDuration);
      });

      this.ctrlAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isAudioMuted = !this.isAudioMuted;
        if (this.isAudioMuted) {
          audioSynth.stopMelody();
          this.ctrlAudioIcon.className = 'fa-solid fa-volume-xmark';
          showToast('Love music muted');
        } else {
          if (this.isPlaying) audioSynth.startMelody();
          this.ctrlAudioIcon.className = 'fa-solid fa-volume-high';
          showToast('Love music playing 🎵');
        }
      });

      // Progress bar scrubbing
      this.progressWrap.addEventListener('click', (e) => {
        const rect = this.progressWrap.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seek(clickRatio * this.totalDuration);
      });

      // Download / Export video clip
      if (this.downloadBtn) {
        this.downloadBtn.addEventListener('click', () => this.exportVideoReel());
      }
    }

    play() {
      this.isPlaying = true;
      this.playOverlay.classList.remove('active');
      this.ctrlPlayIcon.className = 'fa-solid fa-pause';

      if (!this.isAudioMuted) {
        audioSynth.startMelody();
      }

      this.lastTimestamp = performance.now();
      const loop = (now) => {
        if (!this.isPlaying) return;
        const delta = (now - this.lastTimestamp) / 1000;
        this.lastTimestamp = now;

        this.currentTime += delta;
        if (this.currentTime >= this.totalDuration) {
          this.currentTime = 0; // loop seamlessly
        }

        this.renderFrame(this.currentTime);
        this.updateUI();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    pause() {
      this.isPlaying = false;
      this.playOverlay.classList.add('active');
      this.ctrlPlayIcon.className = 'fa-solid fa-play';
      if (this.animId) cancelAnimationFrame(this.animId);
      audioSynth.stopMelody();
    }

    seek(time) {
      this.currentTime = Math.max(0, Math.min(this.totalDuration - 0.01, time));
      this.renderFrame(this.currentTime);
      this.updateUI();
    }

    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateUI() {
      const ratio = (this.currentTime / this.totalDuration) * 100;
      this.progressFill.style.width = `${ratio}%`;
      this.timeDisplay.textContent = `${this.formatTime(this.currentTime)} / ${this.formatTime(this.totalDuration)}`;

      const currentIdx = Math.floor(this.currentTime / this.slideDuration);
      if (this.slides[currentIdx]) {
        this.counterBadge.textContent = `Photo ${currentIdx + 1} of ${this.slides.length} ✨`;
        this.quoteText.textContent = this.slides[currentIdx].quote;
      }
    }

    renderFrame(time) {
      if (!this.ctx) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const ctx = this.ctx;

      const currentIdx = Math.floor(time / this.slideDuration);
      const nextIdx = (currentIdx + 1) % this.slides.length;
      const slideProgress = (time % this.slideDuration) / this.slideDuration;

      const currentImg = this.images[currentIdx];
      const nextImg = this.images[nextIdx];

      ctx.clearRect(0, 0, w, h);

      // Transition crossfade during last 0.8 seconds of each slide
      const fadeThreshold = (this.slideDuration - 0.8) / this.slideDuration;
      const isFading = slideProgress > fadeThreshold;
      const fadeProgress = isFading ? (slideProgress - fadeThreshold) / (1 - fadeThreshold) : 0;

      // Draw current slide
      if (currentImg && currentImg.complete) {
        this.drawSlide(currentImg, slideProgress, 1);
      }

      // Draw next slide with crossfade
      if (isFading && nextImg && nextImg.complete) {
        this.drawSlide(nextImg, 0, fadeProgress);
      }

      // Drifting romantic effects on video
      this.drawReelEffects(time);
    }

    drawSlide(img, progress, alpha) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const ctx = this.ctx;

      ctx.save();
      ctx.globalAlpha = alpha;

      // 1. Blurred, ambient backdrop to fill 16:9 canvas cleanly (no harsh black bars)
      ctx.filter = 'blur(26px) brightness(0.65)';
      ctx.drawImage(img, -20, -20, w + 40, h + 40);
      ctx.filter = 'none';

      // 2. Ken Burns gentle zoom on centered photo
      const kenBurnsScale = 1.0 + (progress * 0.08);
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = w / h;

      let drawW, drawH;
      const maxH = h * 0.84;
      const maxW = w * 0.84;

      if (imgAspect > canvasAspect) {
        drawW = maxW;
        drawH = drawW / imgAspect;
      } else {
        drawH = maxH;
        drawW = drawH * imgAspect;
      }

      drawW *= kenBurnsScale;
      drawH *= kenBurnsScale;

      const x = (w - drawW) / 2;
      const y = (h - drawH) / 2;

      // Soft photo frame shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 12;

      // White card border
      const radius = 18;
      ctx.beginPath();
      ctx.roundRect(x, y, drawW, drawH, radius);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Rounded foreground image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x + 5, y + 5, drawW - 10, drawH - 10, radius - 4);
      ctx.clip();
      ctx.drawImage(img, x, y, drawW, drawH);
      ctx.restore();

      ctx.restore();
    }

    drawReelEffects(time) {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.save();
      // Top romantic watermark
      ctx.font = '700 24px "Dancing Script", cursive, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.fillText('Aaru ❤️ Nikku | for you my love nikuu', 32, 45);

      // Floating gentle heart particles across the video
      for (let i = 0; i < 7; i++) {
        const seed = i * 145.3;
        const hx = ((time * 35 + seed) % w);
        const hy = ((h - (time * 28 + seed * 1.8) % h));
        const size = 12 + (i % 3) * 6;
        ctx.fillStyle = `rgba(255, 117, 143, ${0.25 + (i % 3) * 0.15})`;
        ctx.beginPath();
        ctx.arc(hx, hy, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    exportVideoReel() {
      if (!this.canvas) return;
      showToast('🎥 Preparing video download...');

      try {
        const stream = this.canvas.captureStream(30);
        const mimeTypes = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
        const selectedMime = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';

        const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: selectedMime });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'for_you_my_love_nikuu.webm';
          a.click();
          URL.revokeObjectURL(url);
          showToast('💖 Video Reel downloaded successfully!');
        };

        this.seek(0);
        this.play();
        recorder.start();
        showToast('Recording clip (15s)... please wait! ✨');

        setTimeout(() => {
          if (recorder.state === 'recording') recorder.stop();
        }, 15000);
      } catch (err) {
        showToast('Live video plays seamlessly on screen! 🎥');
        console.warn('MediaRecorder error', err);
      }
    }
  }

  const reelPlayer = new RomanticPhotoReel('photoReelCanvas');

  /* ----------------------------------------------------
   * 14. PAGE 9: THE GRAND FINALE CELEBRATION
   * ---------------------------------------------------- */
  const btnCelebrateAgain = document.getElementById('btnCelebrateAgain');
  const btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
  const btnRestartJourney = document.getElementById('btnRestartJourney');

  function launchGrandFinaleConfetti() {
    const end = Date.now() + 3000;
    const colors = ['#ff4d6d', '#ff758f', '#ffb703', '#ffffff', '#e63946'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    audioSynth.playChord([261.63, 329.63, 392.00, 523.25, 659.25]);
  }

  btnCelebrateAgain.addEventListener('click', () => {
    launchGrandFinaleConfetti();
    showToast('💖 More love showered upon my favorite person!');
  });

  // WhatsApp Message Integration
  btnSendWhatsApp.addEventListener('click', () => {
    const best = state.answers.best || '(Saved in my heart)';
    const worst = state.answers.worst || '(None, you are perfect!)';
    const feelings = state.answers.feelings || '(Happiest girl in the world!)';

    const message = 
`Hey Aaru! ❤️
I just explored your surprise gift for me! Here are my answers:

🌟 Best thing about you: ${best}
🙈 Worst/improvement: ${worst}
💭 How I feel with you: ${feelings}
💍 Ready to marry you: YES! 1000 times YES! 👰‍♀️❤️🤵‍♂️
🫂 Safe with you: Always my safe haven! 🏡

I love you Nikku so much ❤️
I want to live my all life with you ♾️👩❤️👨`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  });

  btnRestartJourney.addEventListener('click', () => {
    goToStep(1);
    showToast('Reliving our love story from the beginning! 💌');
  });

  /* ----------------------------------------------------
   * 15. TOAST NOTIFICATION UTILITY
   * ---------------------------------------------------- */
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toast.classList.add('active');
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  // Initial welcome toast
  setTimeout(() => {
    showToast('Welcome, Nikku! Tap the envelope to unlock Aaru\'s surprise ❤️');
  }, 1000);

});
