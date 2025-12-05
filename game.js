console.log('game.js loaded');

window.addEventListener('load', () => {

let arcWallet = null;
let arcProvider = null;
const arcConnectBtn = document.getElementById('wallet-connect-btn');
const arcAddressEl = document.getElementById('wallet-address');
let gameState = "menu";

    async function connectWallet() {
      if (!window.solana || !window.solana.isPhantom) {
        alert("Phantom wallet not detected! Install https://phantom.app");
        return;
      }
      try {
        arcProvider = window.solana;

await arcProvider.connect();
        arcWallet = arcProvider;
        const addr = arcWallet.publicKey.toBase58().slice(0,4) + ".." + arcWallet.publicKey.toBase58().slice(-4);

        arcConnectBtn.textContent = "WALLET CONNECTED";
        arcConnectBtn.style.background = "#22c55e";
        arcAddressEl.textContent = addr;
        arcAddressEl.style.opacity = 1;
      } catch(e) { console.error(e); }
    }
   if (arcConnectBtn) {
  arcConnectBtn.addEventListener('click', connectWallet);

}


    async function claimSOL(arcAmount) {
      if (!arcWallet) return alert("Connect wallet first!");
      alert(
    "Claiming rewards for " +
    arcAmount.toLocaleString() +
    " ARC!\nThis will be real SOL on mainnet."
);

    }

    // helper: update points UI
    function updatePointsDisplay() {
      try {
        const pointsLabel = document.getElementById("points-label");
        if (pointsLabel) pointsLabel.textContent = "ARC: " + points.toLocaleString();
        updateAchievements();
        updateUpgradePanel();
      } catch (e) { console.error(e); }
    }

    function tryClaimAchievement(arcNeeded, rewardSOL) {
  if (points >= arcNeeded && arcWallet) {
    const msg =
      "Claim " +
      rewardSOL +
      " SOL for " +
      arcNeeded.toLocaleString() +
      " ARC?";

    if (confirm(msg)) {
      claimSOL(points);
      points = 0;
      updatePointsDisplay();
    }
  }
}

// =============================================================

        // ==============================================================
    // INTRO DIALOG ELEMENTS + SCRIPT
    // ==============================================================

    const dialogContainer   = document.getElementById('dialog-container');
    const dialogTextEl      = document.getElementById('dialog-text');
    const dialogContinueEl  = document.getElementById('dialog-continue');
    const introBackdrop     = document.getElementById('intro-backdrop');

   const introScript = [
    "Yo, Farmer. Glad you made it.",
    "The fields have gone to hell — monsters everywhere, creeping closer every night.",
    "I can’t hold them off alone, but you… you’ve got potential.",
    "Here’s the deal: you fight, you survive, you protect this farm.",
    "In return, I’ll reward you with ARC — and later, that ARC will convert straight into real Solana.",
    "Sounds good, right?",
    // The farmer steps out of the barn and wishes you luck before you head off
    "Good luck out there!"
];


    let introIndex = 0;
    let typing = false;
    let introReady = false;   // prevents early clicks
    // Track whether the intro cutscene has been completed.  Once true we skip
    // running the intro on subsequent runs and restarts.
    let introCompleted = false;

    const cutsceneFarmer    = document.getElementById("cutscene-farmer");
    const cutsceneFarmerImg = document.getElementById("cutscene-farmer-img");
    // ===============================
    // SIMPLE CHARACTER SELECT OVERLAY
    // ===============================

   const CHARACTER_CONFIGS = [
  {
    id: "pink",
    name: "PINK MONSTER",
    description: "Fast little chaos demon. Default skin.",
    previewSrc: "Pink_Monster.png",
    idleSrc: "Pink_Monster.png",
    walkSrc: "Pink_Monster_Walk_6.png",
    stats: { speed: 5, damage: 3, defense: 2 } // 0–5 scale, purely visual
  },
  {
    id: "owlet",
    name: "OWLET",
    description: "Little hooded mage. Slightly tankier, a bit slower.",
    previewSrc: "Owlet_Monster.png",
    idleSrc: "Owlet_Monster_Idle_4.png",
    walkSrc: "Owlet_Monster_Walk_6.png",
    stats: { speed: 3, damage: 4, defense: 4 }
  },
  {
    id: "dude",
    name: "DUDE",
    description: "Chill explorer. Balanced stats.",
    previewSrc: "Dude_Monster.png",
    idleSrc: "Dude_Monster_Idle_4.png",
    walkSrc: "Dude_Monster_Walk_6.png",
    stats: { speed: 4, damage: 4, defense: 3 }
  }
];




let weaponSelectOverlay = null;
    let charSelectOverlay = null;

    function applyCharacterConfig(cfg) {
      // reuse same Image objects, just swap src
      playerIdleImg.src = cfg.idleSrc;
      playerWalkImg.src = cfg.walkSrc;
    }

    function buildCharacterSelectOverlay() {
      if (charSelectOverlay) return;

      charSelectOverlay = document.createElement("div");
      charSelectOverlay.id = "character-select-overlay";
      Object.assign(charSelectOverlay.style, {
        position: "fixed",
        inset: "0",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at center, rgba(15,23,42,0.94), rgba(15,23,42,0.98))",
        zIndex: "250",
        pointerEvents: "auto"
      });

      const inner = document.createElement("div");
      Object.assign(inner.style, {
        padding: "18px 22px",
        borderRadius: "18px",
        border: "1px solid rgba(148,163,184,0.7)",
        background:
          "radial-gradient(circle at 0 0, rgba(56,189,248,0.25), transparent 60%)," +
          "radial-gradient(circle at 100% 100%, rgba(250,204,21,0.25), transparent 60%)," +
          "rgba(15,23,42,0.98)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.9)",
        minWidth: "320px",
        maxWidth: "520px",
        textAlign: "center",
        fontFamily: "'Press Start 2P', system-ui, sans-serif",
        color: "#e5e7eb"
      });

      const title = document.createElement("div");
      title.textContent = "CHOOSE YOUR CHARACTER";
      Object.assign(title.style, {
        fontSize: "14px",
        letterSpacing: "0.14em",
        marginBottom: "12px",
        color: "#facc15",
        textShadow: "0 0 10px rgba(250,204,21,0.9)"
      });

      const subtitle = document.createElement("div");
      subtitle.textContent = "Click to select. More heroes coming soon.";
      Object.assign(subtitle.style, {
        fontSize: "10px",
        marginBottom: "16px",
        color: "#9ca3af"
      });

      const row = document.createElement("div");
      Object.assign(row.style, {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap"
      });

      CHARACTER_CONFIGS.forEach((cfg, idx) => {
  const card = document.createElement("button");
  card.type = "button";
  card.classList.add("char-select-card");
  Object.assign(card.style, {
    cursor: "pointer",
    borderRadius: "14px",
    padding: "10px 10px 8px 10px",
    border: "1px solid rgba(148,163,184,0.7)",
    background:
      "radial-gradient(circle at 0 0, rgba(56,189,248,0.18), rgba(15,23,42,0.98))",
    color: "#e5e7eb",
    minWidth: "120px",
    maxWidth: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Press Start 2P', system-ui, sans-serif",
    fontSize: "9px",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out"
  });

  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-4px) scale(1.03)";
    card.style.boxShadow = "0 18px 40px rgba(15,23,42,0.95), 0 0 18px rgba(129,140,248,0.9)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
    card.style.boxShadow = "none";
  });


        const imgWrapper = document.createElement("div");
Object.assign(imgWrapper.style, {
  marginTop: "6px",
  marginBottom: "8px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

const img = document.createElement("img");
// IMPORTANT: heroes use previewSrc / idleSrc, NOT spriteSrc
img.src = cfg.previewSrc || cfg.idleSrc;
img.classList.add("char-select-sprite");
Object.assign(img.style, {
  imageRendering: "pixelated",
  width: "48px",
  height: "48px",
  objectFit: "contain",
  display: "block"
});

imgWrapper.appendChild(img);
card.appendChild(imgWrapper);



        const nameEl = document.createElement("div");
        nameEl.textContent = cfg.name;
        Object.assign(nameEl.style, {
          fontSize: "9px",
          marginTop: "2px",
          color: "#fbbf24"
        });

        const descEl = document.createElement("div");
descEl.textContent = cfg.description;
Object.assign(descEl.style, {
  fontSize: "8px",
  lineHeight: "1.4",
  color: "#9ca3af"
});

// === tiny stat bars ===
const stats = cfg.stats || { speed: 3, damage: 3, defense: 3 };

function makeStatRow(label, value) {
  const row = document.createElement("div");
  row.classList.add("char-stat-row");

  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  Object.assign(labelEl.style, {
    fontSize: "7px",
    letterSpacing: "0.1em",
    color: "#e5e7eb",
    opacity: "0.85"
  });

  const bar = document.createElement("div");
  bar.classList.add("char-stat-bar");
  Object.assign(bar.style, {
    flex: "1",
    height: "6px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.95)",
    overflow: "hidden",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.9)"
  });

  const fill = document.createElement("div");
  fill.classList.add("char-stat-fill");
  const clamped = Math.max(0, Math.min(5, value));
  const pct = (clamped / 5) * 100;
  Object.assign(fill.style, {
    height: "100%",
    width: pct + "%",
    background: "linear-gradient(90deg,#22c55e,#a5b4fc,#facc15)",
    boxShadow: "0 0 6px rgba(129,140,248,0.9)"
  });

  bar.appendChild(fill);
  row.appendChild(labelEl);
  row.appendChild(bar);
  return row;
}

const statsContainer = document.createElement("div");
Object.assign(statsContainer.style, {
  width: "100%",
  marginTop: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
});
statsContainer.appendChild(makeStatRow("SPEED",  stats.speed));
statsContainer.appendChild(makeStatRow("DAMAGE", stats.damage));
statsContainer.appendChild(makeStatRow("DEFENSE",stats.defense));

const keyHint = document.createElement("div");
keyHint.textContent = `[${idx + 1}]`;
Object.assign(keyHint.style, {
  fontSize: "8px",
  marginTop: "6px",
  opacity: "0.7"
});

card.appendChild(imgWrapper);
card.appendChild(nameEl);
card.appendChild(descEl);
card.appendChild(statsContainer);
card.appendChild(keyHint);


        card.addEventListener("click", () => {
          finishCharacterSelect(cfg);
        });

        row.appendChild(card);
      });

      const hint = document.createElement("div");
     hint.textContent = "Press 1 / 2 / 3 to pick quickly.";
      Object.assign(hint.style, {
        marginTop: "12px",
        fontSize: "9px",
        color: "#9ca3af"
      });

      inner.appendChild(title);
      inner.appendChild(subtitle);
      inner.appendChild(row);
      inner.appendChild(hint);

      charSelectOverlay.appendChild(inner);
      document.body.appendChild(charSelectOverlay);
    }

    function startCharacterSelect() {
      buildCharacterSelectOverlay();
      if (charSelectOverlay) {
        charSelectOverlay.style.display = "flex";
      }
      gameState = "characterSelect";
    }

        function finishCharacterSelect(cfg) {
      applyCharacterConfig(cfg);

      if (charSelectOverlay) {
        charSelectOverlay.style.display = "none";
      }

      // After character selection, go to weapon selection
      startWeaponSelect();
    }


    function selectCharacterByIndex(idx) {
      const cfg = CHARACTER_CONFIGS[idx];
      if (!cfg) return;
      finishCharacterSelect(cfg);
    }
// === WEAPON SELECT OVERLAY ===
function buildWeaponSelectOverlay() {
  if (weaponSelectOverlay) return;

  weaponSelectOverlay = document.createElement("div");
  weaponSelectOverlay.id = "weapon-select-overlay";
  Object.assign(weaponSelectOverlay.style, {
    position: "fixed",
    inset: "0",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at center, rgba(15,23,42,0.94), rgba(15,23,42,0.98))",
    zIndex: "260",
    pointerEvents: "auto"
  });

  const inner = document.createElement("div");
  Object.assign(inner.style, {
    padding: "18px 22px",
    borderRadius: "18px",
    border: "1px solid rgba(148,163,184,0.7)",
    background:
      "radial-gradient(circle at 0 0, rgba(56,189,248,0.25), transparent 60%)," +
      "radial-gradient(circle at 100% 100%, rgba(250,204,21,0.25), transparent 60%)," +
      "rgba(15,23,42,0.98)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.9)",
    minWidth: "320px",
    maxWidth: "520px",
    textAlign: "center",
    fontFamily: "'Press Start 2P', system-ui, sans-serif",
    color: "#e5e7eb"
  });

  const title = document.createElement("div");
  title.textContent = "CHOOSE YOUR WEAPON";
  Object.assign(title.style, {
    fontSize: "14px",
    letterSpacing: "0.14em",
    marginBottom: "8px",
    color: "#fbbf24"
  });

  const subtitle = document.createElement("div");
  subtitle.textContent = "Click to arm up.";
  Object.assign(subtitle.style, {
    fontSize: "10px",
    marginBottom: "16px",
    color: "#9ca3af"
  });

  const row = document.createElement("div");
  Object.assign(row.style, {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap"
  });

  WEAPON_SELECT_CONFIGS.forEach((cfg, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    Object.assign(card.style, {
      cursor: "pointer",
      borderRadius: "14px",
      padding: "10px 10px 8px 10px",
      border: "1px solid rgba(148,163,184,0.7)",
      background:
        "radial-gradient(circle at 0 0, rgba(56,189,248,0.18), rgba(15,23,42,0.98))",
      color: "#e5e7eb",
      minWidth: "120px",
      maxWidth: "150px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      fontFamily: "inherit"
    });

    card.addEventListener("click", () => finishWeaponSelect(cfg));

    const imgWrapper = document.createElement("div");
Object.assign(imgWrapper.style, {
  width: "56px",
  height: "56px",
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(15,23,42,1), rgba(15,23,42,0.4))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden"
});

const img = document.createElement("img");
// IMPORTANT: weapons use spriteSrc
img.src = cfg.spriteSrc;
Object.assign(img.style, {
  imageRendering: "pixelated",
  maxHeight: "32px",
  maxWidth: "64px",
  width: "auto",
  height: "auto",
  display: "block"
});

imgWrapper.appendChild(img);
card.appendChild(imgWrapper);


    const nameEl = document.createElement("div");
    nameEl.textContent = cfg.name;
    Object.assign(nameEl.style, {
      fontSize: "9px",
      marginTop: "2px",
      color: "#fbbf24"
    });

    const descEl = document.createElement("div");
    descEl.textContent = cfg.description;
    Object.assign(descEl.style, {
      fontSize: "8px",
      lineHeight: "1.4",
      color: "#9ca3af"
    });

    const keyHint = document.createElement("div");
    keyHint.textContent = `[${idx + 1}]`;
    Object.assign(keyHint.style, {
      fontSize: "8px",
      marginTop: "4px",
      color: "#6b7280"
    });

    card.appendChild(imgWrapper);
    card.appendChild(nameEl);
    card.appendChild(descEl);
    card.appendChild(keyHint);
    row.appendChild(card);
  });

  inner.appendChild(title);
  inner.appendChild(subtitle);
  inner.appendChild(row);
  weaponSelectOverlay.appendChild(inner);
  document.body.appendChild(weaponSelectOverlay);
}

function startWeaponSelect() {
  buildWeaponSelectOverlay();
  if (weaponSelectOverlay) {
    weaponSelectOverlay.style.display = "flex";
  }
  gameState = "weaponSelect";
}

function finishWeaponSelect(cfg) {
  selectedWeaponId = cfg.weaponId;
  player.weapon = getWeaponTemplateById(cfg.weaponId);
  gunSpriteImg.src = cfg.spriteSrc;

  if (weaponSelectOverlay) {
    weaponSelectOverlay.style.display = "none";
  }

  const gameTitle = document.getElementById("game-title");
  if (gameTitle) gameTitle.style.display = "none";

  recomputeStats();
  gameState = "playing";
  initAudio();
}

    function showNextIntroLine() {
  // Only react when intro is actually active AND allowed to advance
  if (gameState !== "intro" || !introReady) return;

  console.debug(
    "showNextIntroLine called, introIndex=",
    introIndex,
    "typing=",
    typing,
    "gameState=",
    gameState
  );

    // If we've shown all lines, cleanly end the intro
  if (introIndex >= introScript.length) {
    // hide all cutscene elements
    dialogContainer.classList.add("dialog-hidden");
    introBackdrop.classList.add("intro-hidden");
    cutsceneFarmer.classList.add("cutscene-hidden");
    // mark intro as completed so we don't show it again
    introCompleted = true;
    // instead of jumping straight into gameplay,
    // open the character select overlay
    startCharacterSelect();
    return;
  }


  // Type out the next line
  typing = true;
  dialogTextEl.textContent = "";
  dialogContinueEl.classList.remove("blink");

  let i = 0;
  const line = introScript[introIndex++];

  const interval = setInterval(() => {
    if (i < line.length) {
      dialogTextEl.textContent += line[i++];
      playTypeSound();
    } else {
      clearInterval(interval);
      typing = false;
      dialogContinueEl.classList.add("blink");
    }
  }, 30);
}

// =====================
// INTRO INPUT: SPACE / CLICK TO ADVANCE
// =====================

// Space key advances dialog – only when intro is actually ready
document.addEventListener("keydown", (e) => {
  // First, ignore anything that is not space
  const isSpace =
    e.code === "Space" || e.key === " " || e.key === "Spacebar";
  if (!isSpace) return;

  // Only react while in intro AND after introReady is set
  if (gameState !== "intro" || !introReady) return;

  // Ignore while dialog is hidden
  const dialogVisible = !dialogContainer.classList.contains("dialog-hidden");
  if (!dialogVisible) return;

  // Stop space from scrolling / typing random stuff
  e.preventDefault();

  if (!typing) {
    dialogContinueEl.classList.remove("blink");
    showNextIntroLine();
  }
});

    // Allow pressing E to skip the entire intro cutscene.  When E is pressed
    // while the intro is active and ready, hide the dialog/backdrop/farmer,
    // mark the intro as completed and jump straight to character select.
    document.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (k !== 'e') return;
      if (gameState !== 'intro' || !introReady) return;
      // Prevent default behaviour (e.g. typing)
      e.preventDefault();
      // hide cutscene UI
      dialogContainer.classList.add('dialog-hidden');
      introBackdrop.classList.add('intro-hidden');
      cutsceneFarmer.classList.add('cutscene-hidden');
      // mark intro as done so subsequent runs skip it
      introCompleted = true;
      // open character select immediately
      startCharacterSelect();
    });

// Allow clicking the dialog bubble to advance (touch-friendly)
dialogContainer.addEventListener("click", (ev) => {
  if (gameState !== "intro" || !introReady) return;
  if (!typing) {
    dialogContinueEl.classList.remove("blink");
    showNextIntroLine();
  }
});

// Ensure overlay button always advances (more reliable than container click)
const dialogAdvanceBtn = document.getElementById("dialog-advance");
if (dialogAdvanceBtn) {
  dialogAdvanceBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    if (gameState !== "intro" || !introReady) return;
    if (!typing) {
      dialogContinueEl.classList.remove("blink");
      showNextIntroLine();
    }
  });
}
// Number keys select characters while in character select
document.addEventListener("keydown", (e) => {
  if (gameState !== "characterSelect") return;

  if (e.key === "1") {
    e.preventDefault();
    selectCharacterByIndex(0); // Pink
  } else if (e.key === "2") {
    e.preventDefault();
    selectCharacterByIndex(1); // Owlet
  } else if (e.key === "3") {
    e.preventDefault();
    selectCharacterByIndex(2); // Dude
  }
});




    // Robustly wire menu buttons and log clicks
const menuButtons = document.querySelectorAll('[data-action]');
if (menuButtons.length === 0) console.warn('No menu buttons found at startup');

menuButtons.forEach(btn => {
  btn.addEventListener('click', (ev) => {
    const action = btn.getAttribute('data-action');
    console.log('menu button clicked:', action);

    if (action === 'play') {
      const mm = document.getElementById('main-menu');
      if (mm) mm.style.display = 'none';
      // If the intro has already been completed once, skip the cutscene and go directly to character select
      if (introCompleted) {
        startCharacterSelect();
        return;
      }
      // Otherwise start the cutscene/intro normally
      introBackdrop.classList.remove('intro-hidden');
      gameState = 'intro';
      cutsceneFarmer.classList.remove("cutscene-hidden");
      cutsceneFarmer.style.animation = "farmer-walk-in 1.8s ease-out forwards";
      setTimeout(() => {
        cutsceneFarmerImg.style.transform = "scaleX(-1)";
        cutsceneFarmerImg.style.animation =
          "farmer-wave 0.9s ease-in-out 4 alternate";
        dialogContainer.classList.remove('dialog-hidden');
        introReady = true;
        showNextIntroLine();
      }, 1800);
    }
  });
});


    // Auto-start play for debugging so users don't need to click the menu
    setTimeout(() => {
      try {
        const playBtn = document.querySelector('[data-action="play"]');
        if (playBtn) {
          // Only auto-click play on the first load to start the intro.  After the
          // intro has been completed once, we won't auto-click again so
          // restarts skip the cutscene.
          if (!introCompleted) {
            console.log('auto-clicking play button');
            playBtn.click();
          }
        } else {
          console.warn('No play button found to auto-click');
        }
      } catch (e) { console.error('auto-start failed', e); }
    }, 250);



    // fix achievement CLAIM parsing (strip non-digits)
    document.querySelectorAll('.achievement').forEach(div => {
      const rewardSpan = div.querySelector('.achievement-reward');
      const btn = document.createElement('button');
      btn.textContent = "CLAIM SOL";
      btn.style = "margin-top:6px;padding:4px 8px;font-size:9px;background:#22c55e;color:#000;border-radius:8px;cursor:pointer;";
      btn.onclick = () => {
        const metaSpan = div.querySelector('.achievement-meta span');
        const arcText = metaSpan ? metaSpan.textContent : "0";
        const arc = parseInt(arcText.replace(/[^\d]/g,'')) || 0;
        const needed = arc;
        if (points >= needed) {
          tryClaimAchievement(needed, (rewardSpan.textContent.match(/\d+\.\d+/) || ["0"])[0]);
        } else {
          alert("Not enough ARC yet!");
        }
      };
      div.appendChild(btn);
    });

    // ==============================================================



    // global audio context (used by intro SFX + music)
    // audioCtx declared above near dialog SFX

function playTypeSound() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return;
    }
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";

  const baseFreqs = [140, 155, 170, 185, 200];
  const base = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
  const jitter = (Math.random() - 0.5) * 20;
  osc.frequency.value = base + jitter;

  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
  gain.gain.linearRampToValueAtTime(0.0, now + 0.09);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

let introAmbient = null;
let introGain = null;

function startIntroAmbient() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return;
    }
  }

  introAmbient = audioCtx.createOscillator();
  introGain = audioCtx.createGain();

  introAmbient.type = "sine";
  introAmbient.frequency.value = 50;
  introGain.gain.value = 0.0001;

  introAmbient.connect(introGain);
  introGain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  introAmbient.start(now);
  introGain.gain.linearRampToValueAtTime(0.03, now + 2.0);
}

function stopIntroAmbient() {
  if (!introGain || !introAmbient) return;

  const now = audioCtx.currentTime;
  introGain.gain.cancelScheduledValues(now);
  introGain.gain.setValueAtTime(introGain.gain.value, now);
  introGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

  setTimeout(() => {
    try { introAmbient.stop(); } catch {}
    introAmbient = null;
    introGain = null;
  }, 1600);
}



// ===== BASIC SETUP =====
    const canvas = document.getElementById("game");
    let ctx = null;
    try {
      ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (ctx) ctx.imageSmoothingEnabled = false;
    } catch (err) {
      console.error('Failed to get 2D context for canvas:', err);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

// ===== WORLD / ARENA (FARM) =====
// World size – large enough to cover everything visible on wide screens so you
// never hit an invisible wall next to the HUD.
const WORLD_WIDTH = 2600;
const WORLD_HEIGHT = 2000;
// Only the central vertical lane is playable.
// Everything outside this band (left/right) is decoration only.
const PLAY_LANE_WIDTH = 1400; // tweak this to make middle wider/narrower
const PLAY_MIN_X = (WORLD_WIDTH - PLAY_LANE_WIDTH) / 2;
const PLAY_MAX_X = PLAY_MIN_X + PLAY_LANE_WIDTH;

// ===== FIELD TILES SETUP =====
const TILE_SIZE = 32;
const fieldTiles = [];
for (let i = 1; i <= 64; i++) {
  const img = new Image();
  const num = String(i).padStart(2, '0');
  img.src = `assets/1%20Tiles/FieldsTile_${num}.png`;
  fieldTiles.push(img);
}
// ----- MIDDLE-LANE TILESET (Tileset.png) -----
// This is a 256x256 sheet = 16x16 tiles of 16x16 pixels.
const TILESET_IMG = new Image();
TILESET_IMG.src = "Tileset.png";

// ----- DARK CASTLE TILES FOR RIFT REALM -----
const riftTiles = [];
for (let i = 1; i <= 25; i++) {
  const img = new Image();
  img.src = `DarkCastleTiles/DarkCastle_${i}_16x16.png`;
  riftTiles.push(img);
}


// Tileset meta
const TILESET_TILE_SIZE = 16;   // source tile size in the PNG
const TILESET_COLS = 16;        // 256 / 16

// Which tile from Tileset.png to use for the playable lane.
// (col,row) in the 16x16 grid. Change these if you want a different tile.
const MIDDLE_TILE_COL = 0;      // <-- tweak later if you want
const MIDDLE_TILE_ROW = 9;      // some of the grey path blocks
const worldCols = Math.ceil(WORLD_WIDTH / TILE_SIZE);
const worldRows = Math.ceil(WORLD_HEIGHT / TILE_SIZE);
const groundMap = [];
for (let row = 0; row < worldRows; row++) {
  groundMap[row] = [];
  for (let col = 0; col < worldCols; col++) {
    groundMap[row][col] = Math.floor(Math.random() * fieldTiles.length);
  }
}

// Recreate the tilemap with new random tiles.  This is used when restarting
// a run to keep the battlefield feeling fresh.  It re-populates the
// existing groundMap array with random indices pointing into fieldTiles.
function generateTilemap() {
  for (let r = 0; r < worldRows; r++) {
    for (let c = 0; c < worldCols; c++) {
      groundMap[r][c] = Math.floor(Math.random() * fieldTiles.length);
    }
  }
}

// ===== DECORATIONS =====
const decorImages = [];

// Build the list of decoration image paths (trees)
const baseDecorPaths = []; // still empty = only trees + treasure
const treeNames = [
  "Autumn_tree1.png",
  "Autumn_tree2.png",
  "Autumn_tree3.png",
  "Broken_tree1.png",
  "Broken_tree2.png",
  "Broken_tree3.png",
  "Broken_tree4.png",
  "Broken_tree5.png",
  "Broken_tree6.png",
  "Broken_tree7.png",
  "Burned_tree1.png",
  "Burned_tree2.png",
  "Burned_tree3.png",
  "Christmas_tree1.png",
  "Christmas_tree2.png",
  "Christmas_tree3.png",
  "Flower_tree1.png",
  "Flower_tree2.png",
  "Flower_tree3.png",
  "Fruit_tree1.png",
  "Fruit_tree2.png",
  "Fruit_tree3.png",
  "Moss_tree1.png",
  "Moss_tree2.png",
  "Moss_tree3.png",
  "Palm_tree1_1.png",
  "Palm_tree1_2.png",
  "Palm_tree1_3.png",
  "Palm_tree2_.png",
  "Palm_tree2_1.png",
  "Palm_tree2_2.png",
  "Snow_christmass_tree1.png",
  "Snow_christmass_tree2.png",
  "Snow_christmass_tree3.png",
  "Snow_tree1.png",
  "Snow_tree2.png",
  "Snow_tree3.png",
  "Tree1.png",
  "Tree2.png",
  "Tree3.png"
];

// The user’s tree PNGs live directly in assets/Trees_texture_shadow_dark
const possibleTreeFolders = [
  "assets/Trees_texture_shadow_dark"
];

const decorPaths = [];
baseDecorPaths.forEach(p => decorPaths.push(p));
treeNames.forEach(name => {
  possibleTreeFolders.forEach(folder => {
    decorPaths.push(`${folder}/${name}`);
  });
});

// turn each decor path into an Image()
decorPaths.forEach(path => {
  const img = new Image();
  img.src = path;
  decorImages.push(img);
});

// ----- NEW: treasure tiles we use as static decorations -----
// These are (column,row) in the 16x16 grid of Treasure.png
// Feel free to tweak / add more coords.
const treasureDecorTiles = [
  { col: 0, row: 0 },  // coin piles
  { col: 1, row: 0 },
  { col: 2, row: 0 },
  { col: 3, row: 0 },
  { col: 4, row: 2 },  // gold bars / blocks
  { col: 5, row: 2 },
  { col: 6, row: 2 },
  { col: 0, row: 4 },  // trophies / cups
  { col: 1, row: 4 },
  { col: 2, row: 4 },
  { col: 3, row: 4 },
  { col: 7, row: 5 },  // fancy weapons / gems
  { col: 8, row: 5 },
  { col: 9, row: 5 },
  { col: 10, row: 5 },
  { col: 0, row: 8 },  // carpets / rugs
  { col: 1, row: 8 },
  { col: 2, row: 8 },
  { col: 3, row: 8 },
  { col: 4, row: 12 }, // statues / big objects
  { col: 5, row: 12 },
  { col: 6, row: 12 },
  { col: 7, row: 12 }
];

const decorations = [];

/**
 * Decorations:
 * - Tree decorations: { img, x, y }
 * - Treasure decorations: { type:"treasure", tileCol, tileRow, size, x, y }
 */
function initDecorations() {
  decorations.length = 0;

  // 1) Trees scattered around the whole world (like before)
  const treeCount = 100;
  const minTreeDist = 80;
  const treePlaced = [];

  for (let i = 0; i < treeCount; i++) {
    const img = decorImages[Math.floor(Math.random() * decorImages.length)];
    let x, y;
    let attempts = 0;
    do {
      const margin = 64;
      x = margin + Math.random() * (WORLD_WIDTH - margin * 2);
      y = margin + Math.random() * (WORLD_HEIGHT - margin * 2);
      attempts++;
      if (attempts > 10) break;
    } while (treePlaced.some(p => Math.hypot(p.x - x, p.y - y) < minTreeDist));
    treePlaced.push({ x, y });
    decorations.push({ img, x, y }); // existing tree style
  }

  // 2) Treasure decorations ONLY in the non-playable left/right bands
  const treasureCount = 130;          // how many shiny bits
  const minTreasureDist = 40;         // spacing between them
  const treasurePlaced = [];
  const sideMargin = 48;
  const treasureWorldSize = 32;       // world size of each icon

  const leftMinX  = sideMargin;
  const leftMaxX  = PLAY_MIN_X - sideMargin - treasureWorldSize;
  const rightMinX = PLAY_MAX_X + sideMargin;
  const rightMaxX = WORLD_WIDTH - sideMargin - treasureWorldSize;

  for (let i = 0; i < treasureCount; i++) {
    const tile = treasureDecorTiles[
      Math.floor(Math.random() * treasureDecorTiles.length)
    ];

    let x, y;
    let attempts = 0;
    do {
      const useLeft = Math.random() < 0.5;
      if (useLeft) {
        x = leftMinX + Math.random() * Math.max(1, leftMaxX - leftMinX);
      } else {
        x = rightMinX + Math.random() * Math.max(1, rightMaxX - rightMinX);
      }
      y = sideMargin + Math.random() * (WORLD_HEIGHT - sideMargin * 2);
      attempts++;
      if (attempts > 12) break;
    } while (treasurePlaced.some(p => Math.hypot(p.x - x, p.y - y) < minTreasureDist));

    treasurePlaced.push({ x, y });

    decorations.push({
      type: "treasure",
      tileCol: tile.col,
      tileRow: tile.row,
      size: treasureWorldSize + Math.random() * 10, // small size variation
      x,
      y
    });
  }
}

function drawDecorations() {
  decorations.forEach(obj => {
    const sx = obj.x - camera.x;
    const sy = obj.y - camera.y;

    // quick off-screen cull
    if (sx < -64 || sy < -64 || sx > canvas.width + 64 || sy > canvas.height + 64) {
      return;
    }

    // TREASURE DECORATION (from Treasure.png)
    if (obj.type === "treasure") {
      if (!powerupSheetImg || !powerupSheetImg.complete || powerupSheetImg.naturalWidth === 0) return;

      const srcX = obj.tileCol * POWERUP_TILE_SIZE;
      const srcY = obj.tileRow * POWERUP_TILE_SIZE;
      const size = obj.size || 32;

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      // little shadow under treasure
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + size * 0.3, size * 0.5, size * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(
        powerupSheetImg,
        srcX, srcY,
        POWERUP_TILE_SIZE, POWERUP_TILE_SIZE,
        sx - size / 2,
        sy - size / 2,
        size, size
      );

      ctx.restore();
      return;
    }

    // TREE DECORATION (existing behavior)
    if (!obj.img || !obj.img.complete || obj.img.naturalWidth === 0) return;
    ctx.drawImage(obj.img, sx, sy);
  });
}

// ===== FARM AREA SETUP =====
// We'll load a pre‑rendered pixel farm scene and position it in the middle of the world.
// The farm is fenced off and should be non‑walkable.
const farmImg = new Image();
// Disable loading a farm overlay; leave src empty to prevent 404 errors.
farmImg.src = "";
// Define the farm's size and position.  We place the farm off to the side rather than in the centre
// so the player can move freely in the main field.  Adjust FARM_SIZE and offsets as desired.
// The farm should sit in the centre of the world and be relatively compact.  Players
// start near the farm and protect it against incoming monsters.  Keep it small
// so it looks cute and doesn't dominate the play area.
const FARM_SIZE = 500; // world units (adjust if your image needs scaling)
// Place the farm at the centre of the map
const farmWidth = FARM_SIZE;
const farmHeight = FARM_SIZE;
const farmX = WORLD_WIDTH / 2 - FARM_SIZE / 2;
const farmY = WORLD_HEIGHT / 2 - FARM_SIZE / 2;


// A glowing Solana totem statue near the farm.
// This uses simple pixel-style rectangles and gradients so it matches the rest of the art.
const SOLANA_TOTEM_X = WORLD_WIDTH / 2;
const SOLANA_TOTEM_Y = farmY - 120; // just above the farm

function drawSolanaTotem() {
  const sx = SOLANA_TOTEM_X - camera.x;
  const sy = SOLANA_TOTEM_Y - camera.y;

  // Only draw if on screen
  if (sx < -80 || sy < -80 || sx > canvas.width + 80 || sy > canvas.height + 80) return;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // subtle floating motion
  const floatOffset = Math.sin(animTime * 0.015) * 4;

  // halo glow
  const haloRadius = 46;
  const grad = ctx.createRadialGradient(
    sx, sy + floatOffset, 0,
    sx, sy + floatOffset, haloRadius
  );
  grad.addColorStop(0, "rgba(56,189,248,0.9)");
  grad.addColorStop(0.4, "rgba(129,140,248,0.7)");
  grad.addColorStop(1, "rgba(15,23,42,0.0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sx, sy + floatOffset, haloRadius, 0, Math.PI * 2);
  ctx.fill();

  // stone pedestal
  const baseW = 40;
  const baseH = 18;
  ctx.fillStyle = "#020617";
  ctx.fillRect(sx - baseW / 2, sy + 26 + floatOffset, baseW, baseH);
  ctx.fillStyle = "#111827";
  ctx.fillRect(sx - baseW / 2 + 3, sy + 26 + floatOffset + 3, baseW - 6, baseH - 6);

  // Solana logo-like bars (pixelated, slanted)
  const barW = 54;
  const barH = 8;

  function drawBar(yOffset, tilt) {
    ctx.save();
    ctx.translate(sx - barW / 2, sy + yOffset + floatOffset);
    ctx.transform(1, 0, tilt, 1, 0, 0);

    const barGrad = ctx.createLinearGradient(0, 0, barW, 0);
    barGrad.addColorStop(0, "#22c55e");
    barGrad.addColorStop(0.5, "#22d3ee");
    barGrad.addColorStop(1, "#a855f7");
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, 0, barW, barH);

    // crisp outline
    ctx.strokeStyle = "rgba(15,23,42,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, barW, barH);

    ctx.restore();
  }

  drawBar(-14, 0.25);
  drawBar(0, 0.25);
  drawBar(14, 0.25);

  ctx.restore();
}


// Simple animated animals inside the farm.  Each animal has a position
// and a small random velocity that makes it wander around inside the fence.
const farmAnimals = [];

function initFarmAnimals() {
  farmAnimals.length = 0;
  const count = 6;
  for (let i = 0; i < count; i++) {
    farmAnimals.push({
      // Start them away from the edges so they don't immediately bounce
      x: farmX + 80 + Math.random() * (farmWidth - 160),
      y: farmY + 80 + Math.random() * (farmHeight - 160),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: 10 + Math.random() * 6,
      color: Math.random() < 0.5 ? '#facc15' : '#f97316'
    });
  }
}

function updateFarmAnimals(dt) {
  const speedScale = dt * 60;
  farmAnimals.forEach(a => {
    a.x += a.vx * speedScale;
    a.y += a.vy * speedScale;
    // Bounce off the fence boundaries (with a margin)
    const margin = 40;
    if (a.x - a.r < farmX + margin || a.x + a.r > farmX + farmWidth - margin) {
      a.vx *= -1;
      a.x = Math.max(farmX + margin + a.r, Math.min(farmX + farmWidth - margin - a.r, a.x));
    }
    if (a.y - a.r < farmY + margin || a.y + a.r > farmY + farmHeight - margin) {
      a.vy *= -1;
      a.y = Math.max(farmY + margin + a.r, Math.min(farmY + farmHeight - margin - a.r, a.y));
    }
  });
}


    function randomSeeded(x, y) {
      const seed = x * 73856093 ^ y * 19349663;
      return ((seed * 9301 + 49297) % 233280) / 233280;
    }

        // Simple edge-based collision: outside the farm image is solid
function isSolidAt(px, py) {
    // Outside world = solid
    if (px < 0 || py < 0) return true;
    if (px > WORLD_WIDTH || py > WORLD_HEIGHT) return true;

    // Outside the central play lane horizontally = solid
    if (px < PLAY_MIN_X || px > PLAY_MAX_X) return true;

    // Everything else is walkable
    return false;
}



    // ===== INPUT =====
const keys = {};   // <-- THIS MUST EXIST, at global scope
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

// mark keys as held down for movement and provide some extra helpers
// We map arrow keys to their WASD equivalents so players can choose either control scheme.
// We also listen for the "R" key to restart the run when the player has died.
window.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  // Track the raw key
  keys[k] = true;
  // Map arrow keys onto WASD for movement
  if (k === 'arrowup') keys['w'] = true;
  if (k === 'arrowdown') keys['s'] = true;
  if (k === 'arrowleft') keys['a'] = true;
  if (k === 'arrowright') keys['d'] = true;

  // Allow pressing R to restart when the run is over
  if (k === 'r') {
    // Only restart if the game is currently over (so we don't accidentally reset mid‑fight)
    if (typeof gameOver !== 'undefined' && gameOver) {
      restartGame();
    }
  }

  // F key: enter / exit rifts
  if (k === 'f') {
    if (typeof gameOver !== 'undefined' && !gameOver && gameState === "playing") {
      if (riftPortalActive && !inRift) {
        enterRift();
      } else if (inRift) {
        // Optional: allow manual early exit (no extra reward)
        exitRift(false);
      }
    }
  }
});


window.addEventListener("keyup", e => {
  const k = e.key.toLowerCase();
  // Unset the raw key
  keys[k] = false;
  // Also unset our WASD mapping if releasing an arrow key
  if (k === 'arrowup') keys['w'] = false;
  if (k === 'arrowdown') keys['s'] = false;
  if (k === 'arrowleft') keys['a'] = false;
  if (k === 'arrowright') keys['d'] = false;
});

// Mouse / shooting: listen on window so UI layers don't block clicks
window.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

window.addEventListener("mousedown", e => {
  if (e.button === 0) mouseDown = true;               // left click = shoot
  if (e.button === 2 && gameState === "playing") {    // right click = dash
    tryDash();
  }
});

window.addEventListener("mouseup", e => {
  if (e.button === 0) mouseDown = false;
});

window.addEventListener("contextmenu", e => e.preventDefault());



    // ===== AUDIO =====
    let audioCtx = null;
    let musicInterval = null;
    let musicStep = 0;

    function initAudio() {
      if (!audioCtx) {
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch {}
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      if (audioCtx && !musicInterval) {
        startMusic();
      }
    }
    window.addEventListener("click", initAudio, { once: true });

    function playGunshot(power = 1) {
      if (!audioCtx) return;
      const t0 = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = 900;
      gain.gain.setValueAtTime(0.4 * power, t0);
      gain.gain.exponentialRampToValueAtTime(0.01, t0 + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.07);

      const duration = 0.12;
      const sampleRate = audioCtx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const envelope = (1 - t) * (1 - t);
        data[i] = (Math.random() * 2 - 1) * envelope * power * 0.6;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 600;

      const gain2 = audioCtx.createGain();
      gain2.gain.value = 0.45 * power;

      src.connect(filter);
      filter.connect(gain2);
      gain2.connect(audioCtx.destination);
      src.start(t0);
    }

    function playEnemyShot() {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = 280;
      gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }

    function playUIBeep(freq = 600) {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }

    function playGlassBreak() {
      if (!audioCtx) return;
      const t0 = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1500, t0);
      osc.frequency.exponentialRampToValueAtTime(400, t0 + 0.18);
      gain.gain.setValueAtTime(0.28, t0);
      gain.gain.exponentialRampToValueAtTime(0.01, t0 + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.2);

      const duration = 0.2;
      const sampleRate = audioCtx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const envelope = (1 - t) * (1 - t);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.7;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1600;
      const gain2 = audioCtx.createGain();
      gain2.gain.value = 0.4;
      src.connect(filter);
      filter.connect(gain2);
      gain2.connect(audioCtx.destination);
      src.start(t0);
    }

    function playRewardChime() {
      if (!audioCtx) return;
      const t0 = audioCtx.currentTime;
      const freqs = [660, 880, 990];
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = f;
        const start = t0 + i * 0.05;
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    }


// Deep whoosh + low sweep when entering the SOLANA REALM
function playRiftEnterSound() {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(420, t0);
  osc.frequency.exponentialRampToValueAtTime(90, t0 + 0.7);

  gain.gain.setValueAtTime(0.0, t0);
  gain.gain.linearRampToValueAtTime(0.28, t0 + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.8);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.85);
}

    function startMusic() {
      if (!audioCtx) return;
      const scale = [0, 3, 5, 7, 10];
      const baseFreq = 220;
      const tempoMs = 420;

      musicInterval = setInterval(() => {
        const t = audioCtx.currentTime;
        const step = musicStep++ % 8;
        const noteIndex = scale[(step + 2) % scale.length];
        const freq = baseFreq * Math.pow(2, noteIndex / 12);

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.45);

        if (step % 4 === 0) {
          const pad = audioCtx.createOscillator();
          const padGain = audioCtx.createGain();
          pad.type = "triangle";
          pad.frequency.value = baseFreq / 2;
          padGain.gain.setValueAtTime(0.04, t);
          padGain.gain.exponentialRampToValueAtTime(0.005, t + 1.2);
          pad.connect(padGain);
          padGain.connect(audioCtx.destination);
          pad.start(t);
          pad.stop(t + 1.3);
        }
      }, tempoMs);
    }

    // ===== PLAYER / ENTITIES =====
    const playerBase = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      r: 10,
      speed: 3.2,
      maxHp: 100,
      hp: 100,
      fireRate: 200,
      damage: 36,
      bulletSpeed: 7.5,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      dashSpeed: 8.5,
      dashDuration: 140,
      dashCooldown: 1100,
      headshotMultiplier: 2
    };

    let player = {};
let bullets = [];
let enemyBullets = [];
let enemies = [];
let powerups = [];
let damagePopups = [];
let arcOrbs = [];      // ← NEW: ARC magnet orbs
let particles = [];
let screenShake = 0;
let time = 0;
    let points = 0;

    let kills = 0;
    let lastShotTime = 0;
    let lastDashTime = -9999;
    let dashEndTime = -9999;
    let camera = { x: 0, y: 0 };

    let bossKillsTrigger = 20;
    let bossAlive = false;
    let gameOver = false;
    let lastTime = performance.now();
    let animTime = 0;
    let playerFacingAngle = 0;

    let shakeTime = 0;
    let shakeIntensity = 0;

    let lastKillTime = 0;
const DOUBLE_KILL_WINDOW = 1200;

let xpMultiplier = 1;

// === WAVE SYSTEM ===
let wave = 1;
let waveEnemiesTarget = 0;
let waveEnemiesSpawned = 0;
let waveEnemiesKilled = 0;
let waveInBreak = false;
let waveBreakEndTime = 0;
let waveSpawnCooldown = 0;
let waveBossSpawned = false;
let currentWaveConfig = null;

// simple screen flash for wave transitions (VFX)
let waveFlashAlpha = 0;

// === RIFT DUNGEONS ===
let inRift = false;
let riftDepth = 0;
let riftEnemiesTarget = 0;
let riftEnemiesSpawned = 0;
let riftEnemiesKilled = 0;
let riftSpawnCooldown = 0;
let riftPortalActive = false;
let riftPortalX = 0;
let riftPortalY = 0;
let pendingWaveAfterRift = null;
let riftEnterFlash = 0;   // 0..1 fade when entering SOLANA REALM


// === ARC MULTIPLIER / STREAK ===
let arcMultiplier = 1;            // how much ARC is multiplied
let arcStreak = 0;                // number of kills in streak
let arcStreakLastKillTime = 0;    // timestamp of last streak kill
const ARC_STREAK_WINDOW = 4000;   // ms allowed between kills

let xpBoostActive = false;
let xpBoostEndTime = 0;
let xpBoostDuration = 8000;

    let speedBoostActive = false;
    let speedBoostEndTime = 0;
    let speedBoostDuration = 6000;
    let baseMoveSpeed = playerBase.speed;

    // === AURORA MOUNTAIN SKY BACKGROUND ===
    const skyBgImg = new Image();
    // Disable loading the nebula sky; leave src empty to prevent 404 errors
    skyBgImg.src = "";
    let skyBgLoaded = false;
    skyBgImg.onload = () => {
      skyBgLoaded = true;
    };


    // SIMPLE moon craters so drawSky won't throw
    const moonCraters = [
      { angle: -0.8, dist: 0.28, radius: 5 },
      { angle: 0.3, dist: 0.4, radius: 8 },
      { angle: 1.1, dist: 0.12, radius: 4 },
      { angle: -1.6, dist: 0.48, radius: 6 }
    ];

    // SKY: one consolidated implementation (stars + moon + nebula)
    const skyStars = [];
    let skyInitDone = false;

    function initSky() {
      skyStars.length = 0;
      const starCount = 120;
      for (let i = 0; i < starCount; i++) {
        skyStars.push({
          x: Math.random(),
          y: Math.random() * 0.9,
          size: 0.6 + Math.random() * 1.3,
          depth: 0.3 + Math.random() * 0.7,
          twSpeed: 0.6 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2
        });
      }
      skyInitDone = true;
    }

        function drawSky() {
      if (!skyInitDone) initSky();

      // 1) basic dark fill as safety background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2) draw aurora mountain PNG as a parallax background
      if (skyBgLoaded && skyBgImg.naturalWidth > 0 && skyBgImg.naturalHeight > 0) {
        const viewW = canvas.width;
        const viewH = canvas.height;

        const imgW = skyBgImg.naturalWidth;
        const imgH = skyBgImg.naturalHeight;
        const imgAspect = imgW / imgH;

        // scale image so it always covers the whole screen
        let targetH = viewH;
        let targetW = targetH * imgAspect;

        if (targetW < viewW) {
          // if it's not wide enough, base on width instead
          targetW = viewW;
          targetH = targetW / imgAspect;
        }

        // slow parallax so sky moves a little with camera
        const parallax = 0.18; // smaller = slower movement
        const camX = camera.x * parallax;

        // tile horizontally so huge maps never "run out" of sky
        let offsetX = -(camX % targetW);
        if (offsetX > 0) offsetX -= targetW;

        // anchor mountains so bottom of image sits at bottom of screen
        const offsetY = viewH - targetH;

        for (let x = offsetX; x < viewW + targetW; x += targetW) {
          ctx.drawImage(
            skyBgImg,
            0, 0, imgW, imgH,
            x, offsetY,
            targetW, targetH
          );
        }
      }

      // 3) OPTIONAL: soft stars on top of the sky (keeps the vibe)
      ctx.save();
      const t = performance.now() * 0.001;
      for (const s of skyStars) {
        const parallax = 0.25 * s.depth;
        const sx = s.x * canvas.width - camera.x * parallax;
        const sy = s.y * canvas.height * 0.9 - camera.y * parallax * 0.3;
        if (sx < -20 || sx > canvas.width + 20 || sy < -20 || sy > canvas.height + 20) continue;

        const tw = 0.5 + 0.5 * Math.sin(t * s.twSpeed + s.phase);
        const r = s.size * (0.6 + tw * 0.8);
        ctx.globalAlpha = 0.3 + tw * 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = "#e5e7eb";
        ctx.fill();
      }
      ctx.restore();
    }


    // wind streaks
    const windLines = [];
    function initWind() {
      for (let i = 0; i < 18; i++) {
        windLines.push({
          x: WORLD_WIDTH / 2 - 500 + Math.random() * 1000,
          y: WORLD_HEIGHT / 2 - 500 + Math.random() * 1000,
          vx: 0.18 + Math.random() * 0.3
        });
      }
    }

    // ===== FALLING LEAVES AROUND TREES (WORLD SPACE) =====
function updateGroundLeaves(dt) {
  const speedScale = dt * 60;

  groundLeaves.forEach(l => {
    if (l.y < l.groundY) {
      l.y += l.vy * speedScale;
      l.swayPhase += l.swaySpeed * speedScale;
      l.x += Math.sin(l.swayPhase) * 0.2 * speedScale * 0.1;
    } else {
      if (Math.random() < 0.0009 * speedScale) {
        l.y = l.startY;
        l.swayPhase = Math.random() * Math.PI * 2;
      }
    }
  });
}

function drawGroundLeaves() {
  if (!groundLeaves.length) return;

  ctx.save();

  groundLeaves.forEach(l => {
    const sx = l.x - camera.x;
    const sy = l.y - camera.y;
    if (sx < -40 || sy < -40 || sx > canvas.width + 40 || sy > canvas.height + 40) return;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(Math.sin(l.swayPhase) * 0.4);

    const s = l.size;
    const grad = ctx.createLinearGradient(-s, -s, s, s);

    if (l.tint < 0.33) {
      grad.addColorStop(0, "rgba(34,197,94,0.0)");
      grad.addColorStop(0.5, "rgba(74,222,128,0.9)");
      grad.addColorStop(1, "rgba(21,128,61,0.0)");
    } else if (l.tint < 0.66) {
      grad.addColorStop(0, "rgba(250,204,21,0.0)");
      grad.addColorStop(0.5, "rgba(234,179,8,0.9)");
      grad.addColorStop(1, "rgba(161,98,7,0.0)");
    } else {
      grad.addColorStop(0, "rgba(248,113,113,0.0)");
      grad.addColorStop(0.5, "rgba(239,68,68,0.9)");
      grad.addColorStop(1, "rgba(127,29,29,0.0)");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.2, s * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

// ===== CINEMATIC FALLING LEAVES (screen-space overlay) =====
const leafParticles = [];

function makeLeaf(x, y) {
  return {
    x,
    y,
    vy: 0.35 + Math.random() * 0.6,
    vx: -0.2 + Math.random() * 0.4,
    size: 8 + Math.random() * 10,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() * 0.03 + 0.01) * (Math.random() < 0.5 ? 1 : -1),
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: 0.02 + Math.random() * 0.04,
    tint: Math.random()
  };
}

function initLeaves() {
  leafParticles.length = 0;

  const count = Math.floor((canvas.width * canvas.height) / 60000);
  const clamped = Math.max(15, Math.min(45, count));

  for (let i = 0; i < clamped; i++) {
    leafParticles.push(
      makeLeaf(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      )
    );
  }
}

function updateLeaves(dt) {
  const speedScale = dt * 60;

  for (let i = 0; i < leafParticles.length; i++) {
    const l = leafParticles[i];

    l.x += l.vx * speedScale;
    l.y += l.vy * speedScale;
    l.rotation += l.spin * speedScale;
    l.swayPhase += l.swaySpeed * speedScale;
    l.x += Math.sin(l.swayPhase) * 0.35 * speedScale * 0.1;

    if (l.y - l.size > canvas.height + 40 || l.x < -80 || l.x > canvas.width + 80) {
      leafParticles[i] = makeLeaf(
        Math.random() * (canvas.width + 200) - 100,
        -40 - Math.random() * canvas.height * 0.4
      );
    }
  }
}

function drawLeaves() {
  if (!leafParticles.length) return;

  ctx.save();
  ctx.globalAlpha = 0.7;

  leafParticles.forEach(l => {
    const sx = l.x;
    const sy = l.y;

    if (sx < -60 || sx > canvas.width + 60 || sy < -60 || sy > canvas.height + 80) return;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(l.rotation);

    const s = l.size;
    const grad = ctx.createLinearGradient(-s, -s, s, s);

    if (l.tint < 0.33) {
      grad.addColorStop(0, "rgba(34,197,94,0.0)");
      grad.addColorStop(0.5, "rgba(74,222,128,0.85)");
      grad.addColorStop(1, "rgba(21,128,61,0.0)");
    } else if (l.tint < 0.66) {
      grad.addColorStop(0, "rgba(250,204,21,0.0)");
      grad.addColorStop(0.5, "rgba(234,179,8,0.85)");
      grad.addColorStop(1, "rgba(161,98,7,0.0)");
    } else {
      grad.addColorStop(0, "rgba(248,113,113,0.0)");
      grad.addColorStop(0.5, "rgba(239,68,68,0.85)");
      grad.addColorStop(1, "rgba(127,29,29,0.0)");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s, 0, 0, s);
    ctx.quadraticCurveTo(-s, 0, 0, -s);
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

// ===== UI ELEMENTS =====
const hpBar = document.getElementById("hp-bar");
const xpBar = document.getElementById("xp-bar");
const arcStreakBar   = document.getElementById("arc-streak-bar");      // ok if null
const hpLabel        = document.getElementById("hp-label");
const xpLabel        = document.getElementById("xp-label");
const arcStreakLabel = document.getElementById("arc-streak-label") || document.getElementById("arc-streak-value");    // ok if null
const levelLabel     = document.getElementById("level-label");
const pointsLabel    = document.getElementById("points-label");
const arcMultLabel   = document.getElementById("arc-mult-label");      // may be null, that's fine
const killsLabel     = document.getElementById("kills-label");
const dashLabel      = document.getElementById("dash-label");
const bossLabel      = document.getElementById("boss-label");
const gameOverEl     = document.getElementById("game-over");
const gameOverStatsEl = document.getElementById("game-over-stats");
const restartBtn     = document.getElementById("restart-btn");

    const ach1Fill = document.getElementById("ach-1-fill");
    const ach2Fill = document.getElementById("ach-2-fill");
    const ach3Fill = document.getElementById("ach-3-fill");
    const ach1Meta = document.getElementById("ach-1-meta");
    const ach2Meta = document.getElementById("ach-2-meta");
    const ach3Meta = document.getElementById("ach-3-meta");

    const mainMenu = document.getElementById("main-menu");

    const centerToast = document.getElementById("center-toast");

    const xpBoostWrapper = document.getElementById("xp-boost-wrapper");
    const xpBoostFill = document.getElementById("xp-boost-fill");
    const speedBoostWrapper = document.getElementById("speed-boost-wrapper");
    const speedBoostFill = document.getElementById("speed-boost-fill");

    // upgrade panel
    const upgradeOverlay = document.getElementById("upgrade-overlay");
    const upgradeArcLabel = document.getElementById("upgrade-arc-label");
    const weaponInfoEl = document.getElementById("weapon-info");
    const gearInfoEl = document.getElementById("gear-info");
    const rollWeaponBtn = document.getElementById("roll-weapon-btn");
    const rollGearBtn = document.getElementById("roll-gear-btn");
    const closeUpgradeBtn = document.getElementById("close-upgrade-btn");
    let upgradeOpen = false;

    restartBtn.addEventListener("click", () => restartGame());

    // Set glowy yellow font for labels
const labels = [hpLabel, xpLabel, levelLabel, pointsLabel, killsLabel, dashLabel, bossLabel, arcStreakLabel];
labels.forEach(label => {
  if (label) {
    label.style.color = '#facc15';
    label.style.textShadow = '0 0 4px #facc15, 0 0 8px #facc15';
  }
});

    // ===== PLAYER & ENEMY SPRITES =====
    const playerSprites = [
      [
        "............",
        "....hhhh....",
        "...hhhhhh...",
        "...hsssshh..",
        "...hsssshh..",
        "....ssss....",
        "....jjjj....",
        "...jjjjjj...",
        "...jjjjjj...",
        "...bbbbbb...",
        "...bbbbbb...",
        "...pp..pp...",
        "...pp..pp...",
        "....f..f....",
        "............",
        "............",
      ],
      [
        "............",
        "....hhhh....",
        "...hhhhhh...",
        "...hsssshh..",
        "...hsssshh..",
        "....ssss....",
        "....jjjj....",
        "...jjjjjj...",
        "...jjjjjj...",
        "...bbbbbb...",
        "...bbb.bb...",
        "...pp..p....",
        "...pp..pp...",
        "....f..f....",
        "............",
        "............",
      ],
      [
        "............",
        "....hhhh....",
        "...hhhhhh...",
        "...hsssshh..",
        "...hsssshh..",
        "....ssss....",
        "....jjjj....",
        "...jjjjjj...",
        "...jjjjjj...",
        "...bbbbbb...",
        "...bb.bbb...",
        "....p..pp...",
        "...pp..pp...",
        "....f..f....",
        "............",
        "............",
      ],
    ];
        


// bullet sprite
const bulletImg = new Image();
bulletImg.src = "bullet.png";  // yellow bullet pixel sprite

// === ENEMY SPRITESHEETS (mushroom variants) ===
const enemySheetBlue = new Image();
enemySheetBlue.src = "Mushroom_Reg.png";     // blue default mushroom

const enemySheetSpike = new Image();
enemySheetSpike.src = "Mushroom_spike.png";  // pink spiky mushroom (fast enemy)

const enemySheetSpotted = new Image();
enemySheetSpotted.src = "Mushroom_spotted.png";   // green mushroom

// FRAME INFO (from the sheet you showed)
const ENEMY_FRAME_W  = 32;
const ENEMY_FRAME_H  = 32;
const ENEMY_COLS     = 12;
const ENEMY_ROWS     = 4;
const ENEMY_TOTAL    = ENEMY_COLS * ENEMY_ROWS;

// WALK ANIMATION SETTINGS (row 1 = second row)
const ENEMY_ANIM_ROW    = 1;   // keep row 1 (second row)
const ENEMY_ANIM_START  = 0;   // start from first frame in that row
const ENEMY_ANIM_FRAMES = 4;   // <-- only use frames 0..5



const PLAYER_IMG_WIDTH = 32;
const PLAYER_IMG_HEIGHT = 32;

const PLAYER_WALK_FRAMES = 6;
const PLAYER_DUST_FRAMES = 6;

let playerWalkFrame = 0;
let playerDustFrame = 0;
let playerWalkTimer = 0;
let playerDustTimer = 0;

const PLAYER_WALK_FRAME_DURATION = 80; // ms per frame
const PLAYER_DUST_FRAME_DURATION = 60;

let playerIsMoving = false;





    const SPRITE_WIDTH = 12;
    const SPRITE_HEIGHT = 16;
    const SPRITE_SCALE = 2.5;

    const enemySpritesBase = [
      [
        "............",
        "............",
        "....hhhh....",
        "...hsssshh..",
        "...hsssshh..",
        "....sssss...",
        ".....sss....",
        "....aaaa....",
        "...aaBBBB...",
        "...aaBBBB...",
        "....PPPP....",
        "....PPPP....",
        ".....FF.....",
        "....F..F....",
        "............",
        "............",
      ],
      [
        "............",
        "............",
        "....hhhh....",
        "...hsssshh..",
        "...hsssshh..",
        "....sssss...",
        ".....sss....",
        "....aaaa....",
        "...aaBBBB...",
        "...aaBBBB...",
        "....PPPP....",
        "....PPP.....",
        "....F.F.....",
        ".....F......",
        "............",
        "............",
      ],
      [
        "............",
        "............",
        "....hhhh....",
        "...hsssshh..",
        "...hsssshh..",
        "....sssss...",
        ".....sss....",
        "....aaaa....",
        "...aaBBBB...",
        "...aaBBBB...",
        "....PPPP....",
        ".....PPP....",
        ".....F.F....",
        "......F.....",
        "............",
        "............",
      ],
    ];
// === IMAGE-BASED PLAYER SPRITE ===
const playerIdleImg = new Image();
playerIdleImg.src = "Pink_Monster.png";

const playerWalkImg = new Image();
playerWalkImg.src = "Pink_Monster_Walk_6.png";

const playerDustImg = new Image();
playerDustImg.src = "Walk_Run_Push_Dust_6.png";

// Gun sprite (changes based on selected weapon)
const gunSpriteImg = new Image();
gunSpriteImg.src = "red.png";  // default; overridden after you pick a weapon
// powerup treasure spritesheet (Treasure.png, 16x16 grid of 16x16 tiles)
const powerupSheetImg = new Image();
powerupSheetImg.src = "Treasure.png";   // file next to game.js

const POWERUP_TILE_SIZE = 16;  // each tile is 16x16
    function playerColorForChar(c) {
      switch (c) {
        case "h": return "#0b1120";
        case "s": return "#fed7aa";
        case "j": return "#b45309";
        case "b": return "#1d4ed8";
        case "p": return "#111827";
        case "f": return "#020617";
        default: return null;
      }
    }

    function enemyColorForChar(c, enemy) {
      const type = enemy.isBoss ? "boss" : enemy.type;
      if (c === "h") {
        if (type === "tanky") return "#111827";
        if (type === "ranged") return "#082f49";
        return "#020617";
      }
      if (c === "s") return "#fecaca";
      if (c === "a") {
        if (type === "fast") return "#b91c1c";
        if (type === "tanky") return "#7c3aed";
        if (type === "ranged") return "#22c55e";
        if (type === "boss") return "#f97316";
        return "#4b5563";
      }
      if (c === "B") {
        if (type === "fast") return "#ef4444";
        if (type === "tanky") return "#a855f7";
        if (type === "ranged") return "#4ade80";
        if (type === "boss") return "#facc15";
        return "#9ca3af";
      }
      if (c === "P") return "#020617";
      if (c === "F") return "#000000";
      return null;
    }

            function drawPlayerSprite(px, py, frameIndex) {
  const w = PLAYER_IMG_WIDTH;
  const h = PLAYER_IMG_HEIGHT;

  // shadow
  ctx.fillStyle = "rgba(15,23,42,0.9)";
  ctx.beginPath();
  ctx.ellipse(px, py + player.r + 4, player.r + 6, player.r / 2 + 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.imageSmoothingEnabled = false;

  // choose sprite sheet & frame
  let img = playerIdleImg;
  let frame = 0;

  if (playerIsMoving) {
    img = playerWalkImg;
    frame = playerWalkFrame;

    // Draw dust when moving
    if (playerDustImg.complete && playerDustImg.naturalWidth > 0) {
      const dustFrameW = playerDustImg.width / PLAYER_DUST_FRAMES;
      const dustFrameH = playerDustImg.height;
      const dustSrcX = playerDustFrame * dustFrameW;

      const dustScale = 1.0;
      const dustW = dustFrameW * dustScale;
      const dustH = dustFrameH * dustScale;

      ctx.save();
      ctx.translate(px, py + 5); // Adjusted position for dust at feet
      const flip = Math.cos(playerFacingAngle) < 0 ? -1 : 1;
      ctx.scale(flip, 1);

      ctx.drawImage(
        playerDustImg,
        dustSrcX, 0, dustFrameW, dustFrameH,
        -dustW / 2, -dustH / 2,
        dustW, dustH
      );

      ctx.restore();
    }
  } else {
    playerDustFrame = 0; // Reset dust when not moving
  }

  const frameW = 32;
  const frameH = 32;
  const srcX = frame * frameW;

  // flip horizontally when aiming left, normal when aiming right
  const flip = Math.cos(playerFacingAngle) < 0 ? -1 : 1;

  if (img.complete && img.naturalWidth > 0) {
    ctx.save();
    // draw centered on player, with a small vertical offset like before
    ctx.translate(px, py - 4);
    ctx.scale(flip, 1);

    ctx.drawImage(
      img,
      srcX, 0, frameW, frameH,
      -frameW / 2, -frameH / 2,   // draw around origin
      frameW, frameH
    );

    ctx.restore();
  } else {
    // fallback
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(px, py, player.r, 0, Math.PI * 2);
    ctx.fill();
  }


    // gun (selected weapon sprite)
const gunImg = gunSpriteImg;
const gunLoaded = gunImg.complete && gunImg.naturalWidth > 0;


    if (gunLoaded) {
    // scale the tiny sprite up, but not crazy huge
    const gunScale = 1.2; // was 2.5 - much smaller now
    const gw = gunImg.naturalWidth * gunScale;
    const gh = gunImg.naturalHeight * gunScale;

    ctx.save();
    // position at player center, slightly up
    ctx.translate(px, py - 3);
    ctx.rotate(playerFacingAngle);

    // draw so the butt of the gun sits near the player
    // and the barrel points forward
   const buttOffsetX = -14;  // more negative = further back, closer to that rear hand
const buttOffsetY = 3;    // positive = lower, out of his eyes



    ctx.drawImage(
      gunImg,
      0,
      0,
      gunImg.naturalWidth,
      gunImg.naturalHeight,
      buttOffsetX,
      buttOffsetY,
      gw,
      gh
    );

    ctx.restore();
  } else {

    // fallback: simple line gun if image not loaded yet
    const gunLen = player.r + 8;
    const gx = px + Math.cos(playerFacingAngle) * gunLen;
    const gy = py + Math.sin(playerFacingAngle) * gunLen - 2;
    ctx.strokeStyle = "#f9fafb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py - 3);
    ctx.lineTo(gx, gy);
    ctx.stroke();
  }
}


    function drawEnemySprite(sx, sy, enemy, frameIndex) {
  ctx.imageSmoothingEnabled = false;
  // Pick which mushroom sheet to use
  // fast enemies = spiky, everyone else = blue
  // Choose sprite based on enemy type
let sheetImg;
if (enemy.type === "fast") {
    sheetImg = enemySheetSpike;       // pink spiky
} else if (enemy.type === "tanky") {
    sheetImg = enemySheetSpotted;     // green spotted
} else {
    sheetImg = enemySheetBlue;        // default blue
}


  // If the mushroom spritesheet is loaded, use it
  if (sheetImg.complete && sheetImg.naturalWidth > 0) {
    const frames = ENEMY_ANIM_FRAMES || ENEMY_TOTAL || 1;
    const safeFrame = (typeof frameIndex === "number" ? frameIndex : 0);
    const localIndex = (safeFrame % frames + frames) % frames; // 0..frames-1

    // Convert local frame index (0..frames-1) into global sheet index
    const idx = ENEMY_ANIM_START + localIndex + ENEMY_ANIM_ROW * ENEMY_COLS;

    const col = idx % ENEMY_COLS;
    const row = Math.floor(idx / ENEMY_COLS);

    const srcX = col * ENEMY_FRAME_W;
    const srcY = row * ENEMY_FRAME_H;

    // Scale mushrooms slightly; bosses a bit bigger if you want
    const baseScale = enemy.isBoss ? 1.2 : 1.0;
    const drawW = ENEMY_FRAME_W * baseScale;
    const drawH = ENEMY_FRAME_H * baseScale;

    // Treat (sx, sy) as the FEET position on the ground
    const destX = sx - drawW / 2;
    const destY = sy - drawH;

    ctx.save();

    // simple shadow under the feet
    const shadowWidth  = drawW * 0.55;
    const shadowHeight = drawH * 0.20;
    const shadowY      = sy + 4;

    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.beginPath();
    ctx.ellipse(sx, shadowY, shadowWidth, shadowHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // draw the sprite
    ctx.drawImage(
    sheetImg,
      srcX, srcY, ENEMY_FRAME_W, ENEMY_FRAME_H,
      destX, destY,
      drawW, drawH
    );

    ctx.restore();
    return;
  }

  // Fallback: simple circle if image not loaded yet
  ctx.fillStyle = enemy.isBoss ? "#f97316" : "#22c55e";
  ctx.beginPath();
  ctx.arc(sx, sy, enemy.r, 0, Math.PI * 2);
  ctx.fill();
}







    // ===== WEAPONS & GEAR =====
    const WEAPON_POOL = [
  { id: "pistol",  name: "Sidearm Pistol", damageBonus: 0,  fireRateDelta: 0,   bulletSpeed: 7.5,  pellets: 1, spread: 0.02, pierce: 0, description: "Reliable default pistol." },
  { id: "shotgun", name: "Farm Shotgun",   damageBonus: -4, fireRateDelta: 180, bulletSpeed: 7.0,  pellets: 5, spread: 0.25, pierce: 0, description: "Close-range spread. Huge burst, slow fire." },
  { id: "rifle",   name: "Marksman Rifle", damageBonus: 6,  fireRateDelta: 60,  bulletSpeed: 9.0,  pellets: 1, spread: 0.01, pierce: 0, description: "Accurate rifle. More damage and speed." },
  { id: "smg",     name: "ARC SMG",        damageBonus: -6, fireRateDelta: -90, bulletSpeed: 7.8,  pellets: 1, spread: 0.12, pierce: 0, description: "Sprays bullets. Very fast but weaker shots." },
  { id: "sniper",  name: "Solana Sniper",  damageBonus: 22, fireRateDelta: 260, bulletSpeed: 11.5, pellets: 1, spread: 0.0,  pierce: 2, description: "Piercing high-damage shot. Slow but deadly." },
  {
    id: "ak47",
    name: "AK-47",
    description: "Reliable assault rifle. High fire rate, solid damage.",
    damageBonus: 6,       // more damage than pistol / SMG
    fireRateDelta: -3,    // shoots faster than default
    bulletSpeed: 9,       // fast bullets
    pellets: 1,
    pierce: 0
  }
];

// === WEAPON SELECTION CONFIGS (for the pre-game weapon picker) ===
const WEAPON_SELECT_CONFIGS = [
  {
    id: "red",
    name: "Red Blaster",
    description: "High damage, solid fire rate.",
    weaponId: "ak47",
    spriteSrc: "red.png"
  },
  {
    id: "blue",
    name: "Blue Pulse",
    description: "More precision, slightly lighter shots.",
    weaponId: "rifle",
    spriteSrc: "blue.png"
  },
  {
    id: "ak",
    name: "AK-47",
    description: "Classic rifle. Balanced and reliable.",
    weaponId: "ak47",
    spriteSrc: "ak.png"
  }
];

// currently chosen weapon for this run (by id from WEAPON_POOL)
let selectedWeaponId = "ak47";
function getWeaponTemplateById(id) {
  const found = WEAPON_POOL.find(w => w.id === id);
  return found ? clone(found) : clone(WEAPON_POOL[0]);
}

function getSelectedWeapon() {
  return getWeaponTemplateById(selectedWeaponId || WEAPON_POOL[0].id);
}


    const GEAR_POOL = [
      { slot: "helmet",   name: "Rusty Helmet",      rarity: "common",  bonus: { hp: 15 } },
      { slot: "helmet",   name: "Solana Visor",      rarity: "epic",    bonus: { hp: 30, xpMult: 0.15 } },
      { slot: "chest",    name: "Leather Vest",      rarity: "common",  bonus: { hp: 20 } },
      { slot: "chest",    name: "ARC Plate",         rarity: "rare",    bonus: { hp: 35, damage: 3 } },
      { slot: "boots",    name: "Runner Boots",      rarity: "rare",    bonus: { speed: 0.4 } },
      { slot: "gloves",   name: "Gunner Gloves",     rarity: "rare",    bonus: { fireRate: -40 } },
      { slot: "accessory",name: "Lucky Token",       rarity: "rare",    bonus: { xpMult: 0.1 } }
    ];

    function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
function getDefaultWeapon() { return clone(WEAPON_POOL[0]); }
function getRandomWeapon() { const idx = Math.floor(Math.random() * WEAPON_POOL.length); return clone(WEAPON_POOL[idx]); }
function getRandomGear() { const idx = Math.floor(Math.random() * GEAR_POOL.length); return clone(GEAR_POOL[idx]); }

    function equipGear(item) {
      if (!player.gear) player.gear = {};
      player.gear[item.slot] = item;
      recomputeStats();
      showToast("Equipped: " + item.name);
      playRewardChime();
    }

function weaponSummary(w) {
  if (!w) return "No weapon equipped.";

  let txt = "";
  txt += w.name + "\n\n";
  if (w.description) txt += w.description + "\n\n";

  const dmg     = w.damageBonus   != null ? w.damageBonus   : 0;
  const frDelta = w.fireRateDelta != null ? w.fireRateDelta : 0;
  const speed   = w.bulletSpeed   != null ? w.bulletSpeed   : 0;
  const pellets = w.pellets       != null ? w.pellets       : 1;
  const pierce  = w.pierce        != null ? w.pierce        : 0;

  txt += "Damage bonus: " + dmg;
  txt += "\nFire rate Δ: " + frDelta + " ms";
  txt += "\nBullet speed: " + speed;
  txt += "\nPellets: " + pellets;
  txt += "\nPierce: " + pierce;

  return txt;
}

function gearSummaryText() {
  if (!player.gear) player.gear = {};

  const slots = ["helmet", "chest", "boots", "gloves", "accessory"];
  let txt = "";

  for (const slot of slots) {
    const item = player.gear[slot];
    if (!item) {
      txt += slot.toUpperCase() + ": (empty)\n";
    } else {
      const b = item.bonus || {};
      const bonuses = [];

      if (b.hp)           bonuses.push("HP +" + b.hp);
      if (b.damage)       bonuses.push("DMG +" + b.damage);
      if (b.fireRate)     bonuses.push("FR " + (b.fireRate >= 0 ? "+" : "") + b.fireRate + " ms");
      if (b.speed)        bonuses.push("SPD +" + b.speed.toFixed(1));
      if (b.dashCooldown) bonuses.push("DashCD " + b.dashCooldown);
      if (b.xpMult)       bonuses.push("XP +" + Math.round(b.xpMult * 100) + "%");

      txt += slot.toUpperCase() + ": " + item.name + " [" + (item.rarity || "common") + "]";
      if (bonuses.length) txt += " (" + bonuses.join(", ") + ")";
      txt += "\n";
    }
  }

  if (!txt) return "No gear equipped.";
  return txt;
}


    function updateUpgradePanel() {
      if (!upgradeOpen) return;
      upgradeArcLabel.textContent = "ARC: " + points.toLocaleString();
      weaponInfoEl.textContent = weaponSummary(player.weapon);
      gearInfoEl.textContent = gearSummaryText();
    }

    function openUpgradePanel() {
      if (upgradeOpen) return;
      upgradeOpen = true;
      upgradeOverlay.style.display = "flex";
      gameState = "upgrade";
      updateUpgradePanel();
    }

    function closeUpgradePanel() {
      if (!upgradeOpen) return;
      upgradeOpen = false;
      upgradeOverlay.style.display = "none";
      gameState = "playing";
    }

    function tryRollWeapon() {
      const cost = 200;
      if (points < cost) {
        showToast("Need " + cost + " ARC");
        playUIBeep(400);
        return;
      }
      points -= cost;
      const newW = getRandomWeapon();
      player.weapon = newW;
      recomputeStats();
      showToast("New weapon: " + newW.name);
      updateUpgradePanel();
    }

    function tryRollGear() {
      const cost = 150;
      if (points < cost) {
        showToast("Need " + cost + " ARC");
        playUIBeep(400);
        return;
      }
      points -= cost;
      const g = getRandomGear();
      equipGear(g);
      updateUpgradePanel();
    }

    // ===== HELPERS =====
    function resetPlayer() {
      Object.assign(player, playerBase);
      player.baseDamage = player.damage;
      player.baseFireRate = player.fireRate;
      player.baseSpeed = player.speed;
      player.baseMaxHp = player.maxHp;
      player.baseDashCooldown = player.dashCooldown;
      player.baseBulletSpeed = player.bulletSpeed;
player.weapon = getSelectedWeapon();
player.gear = { helmet: null, chest: null, boots: null, gloves: null, accessory: null };

      // Reinitialize decorations each run so the map feels fresh
      initDecorations();
      player.xpGearMult = 1;
      player.bodyDamage = player.damage;
      baseMoveSpeed = player.speed;
      recomputeStats();
    }

    function recomputeStats() {
      let dmg = player.baseDamage;
      let fire = player.baseFireRate;
      let speed = player.baseSpeed;
      let maxHp = player.baseMaxHp;
      let dashCd = player.baseDashCooldown;
      let xpGearMult = 1;

      if (!player.gear) player.gear = {};
      for (const slot in player.gear) {
        const item = player.gear[slot];
        if (!item || !item.bonus) continue;
        const b = item.bonus;
        if (b.hp) maxHp += b.hp;
        if (b.damage) dmg += b.damage;
        if (b.fireRate) fire += b.fireRate;
        if (b.speed) speed += b.speed;
        if (b.dashCooldown) dashCd += b.dashCooldown;
        if (b.xpMult) xpGearMult *= (1 + b.xpMult);
      }

      const w = player.weapon;
      if (w) {
        if (w.damageBonus) dmg += w.damageBonus;
        if (w.fireRateDelta) fire += w.fireRateDelta;
        player.bulletSpeed = w.bulletSpeed || player.baseBulletSpeed;
      } else {
        player.bulletSpeed = player.baseBulletSpeed;
      }

      player.damage = dmg;
      player.bodyDamage = dmg;
      player.fireRate = Math.max(80, fire);
      player.speed = speed;
      player.maxHp = maxHp;
      if (player.hp > player.maxHp) player.hp = player.maxHp;
      player.dashCooldown = Math.max(400, dashCd);
      player.xpGearMult = xpGearMult;
      baseMoveSpeed = player.speed;
    }

        function spawnEnemy(type = null) {
  // pick type if not specified
  if (!type) {
    const r = Math.random();
    if (r < 0.35)      type = "normal"; // snake
    else if (r < 0.65) type = "fast";   // hyena
    else if (r < 0.85) type = "tanky";  // chunky snake
    else               type = "ranged";
  }

  const spawnMarginX = 40; // don't spawn right on the very edge of the map
const minX = spawnMarginX;
const maxX = WORLD_WIDTH - spawnMarginX;


    // pick spawn position away from player, but inside the central play lane horizontally
  let x, y;
const spawnMargin = 40; // don't spawn exactly on the edge of the map
  const spawnMinX = PLAY_MIN_X + spawnMargin;
  const spawnMaxX = PLAY_MAX_X - spawnMargin;
  do {
    x = spawnMinX + Math.random() * (spawnMaxX - spawnMinX);
    y = Math.random() * WORLD_HEIGHT;
  } while (distance(x, y, player.x, player.y) < 260);





  const isBoss = (type === "boss");

  // basic stats per type
  let hp, speed, r, pointsReward, xpReward, fireCooldown;
  if (isBoss) {
    type = "boss";
    r = 26;
    hp = 600;
    speed = 1.7;
    pointsReward = 60;
    xpReward = 45;
    fireCooldown = 650;
  } else if (type === "fast") {
    r = 13;
    hp = 40;
    speed = 2.4;
    pointsReward = 6;
    xpReward = 6;
    fireCooldown = 999999; // no shooting
  } else if (type === "tanky") {
    r = 16;
    hp = 120;
    speed = 1.1;
    pointsReward = 10;
    xpReward = 8;
    fireCooldown = 999999;
  } else if (type === "ranged") {
    r = 13;
    hp = 45;
    speed = 1.35;
    pointsReward = 7;
    xpReward = 7;
    fireCooldown = 900;
  } else { // "normal"
    r = 13;
    hp = 50;
    speed = 1.6;
    pointsReward = 5;
    xpReward = 5;
    fireCooldown = 999999;
  }

  const enemy = {
    x,
    y,
    r,
    type,
    hp,
    maxHp: hp,
    speed,
    pointsReward,
    xpReward,
    wobblePhase: Math.random() * Math.PI * 2,
    lastShot: 0,
    fireCooldown,
    isBoss,
    // pick a random frame from Enemy.png (0–47)
    spriteIndex: Math.floor(Math.random() * ENEMY_TOTAL)
  };

  // If this enemy was spawned inside a Rift, scale it up to feel more dangerous.
  if (inRift && !enemy.isBoss) {
    const hpScale = 1 + riftDepth * 0.25;
    const speedScale = 1 + riftDepth * 0.15;
    enemy.hp *= hpScale;
    enemy.maxHp = enemy.hp;
    enemy.speed *= speedScale;
    enemy.pointsReward = Math.round(enemy.pointsReward * (1 + riftDepth * 0.2));
    enemy.xpReward = Math.round(enemy.xpReward * (1 + riftDepth * 0.2));
    enemy.isRift = true;
  }

  enemies.push(enemy);
  if (isBoss) bossAlive = true;
}





    function maybeSpawnBoss() {
      if (!bossAlive && kills >= bossKillsTrigger) {
        spawnEnemy("boss");
        bossLabel.textContent = "Boss: spawned!";
        bossKillsTrigger += 30;
      } else if (!bossAlive) {
        const remaining = bossKillsTrigger - kills;
        bossLabel.textContent = "Boss: " + remaining + " kills left";
      }
    }

    

// ===== WAVE CONFIG & CONTROL =====
function getWaveConfig(w) {
  // how many non-boss enemies this wave wants
  const enemyCount = 18 + w * 5; // scales up each wave

  // composition: only existing enemy types
  let mix = {
    normal: 0.45,
    fast:   0.22,
    tanky:  0.20,
    ranged: 0.13
  };

  if (w >= 4) {
    mix.ranged += 0.05;
    mix.normal -= 0.05;
  }
  if (w >= 7) {
    mix.fast += 0.05;
    mix.tanky += 0.05;
    mix.normal -= 0.10;
  }

  const bossThisWave = (w % 5 === 0); // every 5th wave has a boss

  return { enemyCount, mix, bossThisWave };
}

function pickEnemyTypeForWave(mix) {
  const r = Math.random();
  let acc = 0;
  const order = ["normal", "fast", "tanky", "ranged"];
  for (const type of order) {
    acc += mix[type] || 0;
    if (r <= acc) return type;
  }
  return "normal";
}

function startWave(w) {
  wave = w;
  currentWaveConfig = getWaveConfig(wave);

  waveEnemiesTarget = currentWaveConfig.enemyCount;
  waveEnemiesSpawned = 0;
  waveEnemiesKilled = 0;
  waveInBreak = false;
  waveBossSpawned = false;
  waveSpawnCooldown = 0;

  // wave flash VFX
  waveFlashAlpha = 0.55;

  if (bossLabel) {
    bossLabel.textContent = "Wave " + wave + " starting!";
  }
  showToast("WAVE " + wave);
  triggerShake(8);
}


function updateWaveSystem(dt, now) {
  // Wave logic only runs in the normal world (not inside rifts)
  if (inRift || !currentWaveConfig || gameOver) return;

  // fade wave flash
  if (waveFlashAlpha > 0) {
    waveFlashAlpha = Math.max(0, waveFlashAlpha - dt * 0.08);
  }

  // between waves → chill break
  if (waveInBreak) {
    if (now >= waveBreakEndTime) {
      // if player didn't enter the rift, continue to next wave normally
      if (riftPortalActive) {
        riftPortalActive = false;
        pendingWaveAfterRift = null;
      }
      startWave(wave + 1);
    } else if (bossLabel) {
      const sec = Math.max(0, (waveBreakEndTime - now) / 1000).toFixed(1);
      bossLabel.textContent =
        "Wave " + wave + " cleared – next in " + sec + "s";
    }
    return;
  }

  const aliveNonBoss = enemies.filter(e => !e.isBoss).length;
  const maxSimul = Math.min(35 + wave * 2, 70); // how many can be on screen

  // spawn wave enemies in batches
  if (waveEnemiesSpawned < waveEnemiesTarget && aliveNonBoss < maxSimul) {
    waveSpawnCooldown -= dt;
    if (waveSpawnCooldown <= 0) {
      const batch = Math.min(3, waveEnemiesTarget - waveEnemiesSpawned);
      for (let i = 0; i < batch; i++) {
        const t = pickEnemyTypeForWave(currentWaveConfig.mix);
        spawnEnemy(t);           // uses your existing types
        waveEnemiesSpawned++;
      }

      const baseCd = 0.9;
      const minCd  = 0.18;
      const scaled = baseCd - wave * 0.06;
      waveSpawnCooldown = Math.max(minCd, scaled);
    }
  }

  // boss per wave (using your existing boss type)
  if (currentWaveConfig.bossThisWave && !waveBossSpawned) {
    // spawn boss once 60% of wave enemies are dead
    if (!bossAlive && waveEnemiesKilled >= Math.floor(waveEnemiesTarget * 0.6)) {
      spawnEnemy("boss");
      waveBossSpawned = true;
      if (bossLabel)
        bossLabel.textContent = "Wave " + wave + " – BOSS!";
      triggerShake(14);
    }
  }

  const remaining = Math.max(0, waveEnemiesTarget - waveEnemiesKilled);

  // check wave completion
  if (!waveInBreak) {
    if (!bossAlive &&
        waveEnemiesKilled >= waveEnemiesTarget &&
        enemies.length === 0) {
      waveInBreak = true;
      waveBreakEndTime = now + 4500;
      pendingWaveAfterRift = wave + 1;
      if (bossLabel) bossLabel.textContent = "Wave " + wave + " cleared!";
      showToast("Wave " + wave + " cleared!");

      // Offer a Rift portal after mid-game waves
      if (wave >= 3 && !inRift) {
        openRiftPortal();
      }
    } else if (bossLabel) {
      const bossSuffix =
        currentWaveConfig.bossThisWave && !waveBossSpawned ? " – boss soon" :
        currentWaveConfig.bossThisWave && bossAlive ? " – boss alive" : "";
      bossLabel.textContent =
        "Wave " + wave + " – " + remaining + " left" + bossSuffix;
    }
  }
}


// ===== RIFT DUNGEONS (small challenge rooms) =====

// Open a portal somewhere in the world that the player can choose to enter.
function openRiftPortal() {
  // Don't stack portals
  if (riftPortalActive || inRift) return;
  riftPortalActive = true;

  // Place it roughly in the middle of the world (near the farm / spawn)
  riftPortalX = WORLD_WIDTH / 2;
  riftPortalY = WORLD_HEIGHT / 2;

  showToast("A Rift has opened - press F to enter");
}

// Enter the rift: clear current enemies and spawn a new mini-encounter.
function enterRift() {
  if (!riftPortalActive || inRift || gameOver || gameState !== "playing") return;

  inRift = true;
  riftPortalActive = false;

  // scale difficulty with depth
  riftDepth += 1;
  riftEnemiesKilled = 0;
  riftEnemiesSpawned = 0;
  riftEnemiesTarget = 12 + riftDepth * 6;
  riftSpawnCooldown = 0.3;

  // remember what the "next wave" after this rift should be
  if (pendingWaveAfterRift == null) {
    pendingWaveAfterRift = wave + 1;
  }

  // clear the battlefield
  enemies = [];
  bullets = [];
  enemyBullets = [];
  powerups = [];
  damagePopups = [];

  // cancel any current wave break
  waveInBreak = false;
  currentWaveConfig = null;

  // some quick VFX as we enter SOLANA REALM
  triggerShake(12);
  waveFlashAlpha = 0.7;
  riftEnterFlash = 1;
  showSolanaRealmToast();
  playRiftEnterSound();
}

// Handle spawning and completion while inside a rift.
function updateRiftSystem(dt, now) {
  if (!inRift || gameOver) return;

  // drive the SOLANA REALM entry fade while inside
  if (riftEnterFlash > 0) {
    riftEnterFlash = Math.max(0, riftEnterFlash - dt * 0.7);
  }


  const alive = enemies.length;
  const maxSimul = Math.min(16 + riftDepth * 2, 40);

  // spawn enemies in small batches
  if (riftEnemiesSpawned < riftEnemiesTarget && alive < maxSimul) {
    riftSpawnCooldown -= dt;
    if (riftSpawnCooldown <= 0) {
      const batch = Math.min(3, riftEnemiesTarget - riftEnemiesSpawned);
      for (let i = 0; i < batch; i++) {
        spawnEnemy(); // type chosen inside spawnEnemy()
        riftEnemiesSpawned++;
      }

      const baseCd = 0.7;
      const minCd  = 0.18;
      const scaled = baseCd - riftDepth * 0.04;
      riftSpawnCooldown = Math.max(minCd, scaled);
    }
  }

  // if we've killed everything the rift wanted, exit and give rewards
  if (riftEnemiesKilled >= riftEnemiesTarget && enemies.length === 0) {
    exitRift(true);
  }
}

// Exit the rift back into the normal wave loop.
// If success is true, grant a small reward.
function exitRift(success = true) {
  if (!inRift) return;
  inRift = false;

  // clear combat state inside the rift
  enemies = [];
  bullets = [];
  enemyBullets = [];
  powerups = [];
  damagePopups = [];

  if (success) {
    const bonusArc = 50 + riftDepth * 25;
    points += bonusArc;
    spawnArcPopup(bonusArc, player.x, player.y);
    addXP(20 + riftDepth * 5);
    showToast("Rift Depth " + riftDepth + " cleared!");
  } else {
    showToast("Rift collapsed!");
  }

  riftEnemiesTarget = 0;
  riftEnemiesSpawned = 0;
  riftEnemiesKilled = 0;
  riftSpawnCooldown = 0;

  // if we had a pending wave, resume from there
  if (pendingWaveAfterRift != null) {
    startWave(pendingWaveAfterRift);
    pendingWaveAfterRift = null;
  }
}

// Full-screen visual tint while inside a rift.
function drawRiftOverlay() {
  if (!inRift) return;

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "rgba(15,23,42,0.95)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const grad = ctx.createRadialGradient(
    cx, cy, 0,
    cx, cy, Math.max(canvas.width, canvas.height)
  );
  grad.addColorStop(0, "rgba(76,29,149,0.7)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // extra fade-to-black on first entry into SOLANA REALM
  if (riftEnterFlash > 0) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = riftEnterFlash * 0.9;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.restore();
}

// Little swirling portal drawn in the world when a rift is available.
function drawRiftPortal() {
  if (!riftPortalActive || inRift) return;

  const sx = riftPortalX - camera.x;
  const sy = riftPortalY - camera.y;

  if (sx < -80 || sy < -80 || sx > canvas.width + 80 || sy > canvas.height + 80) return;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const t = animTime * 0.05;
  const radius = 26 + Math.sin(t) * 4;

  const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
  grad.addColorStop(0, "rgba(129,140,248,0.9)");
  grad.addColorStop(0.5, "rgba(56,189,248,0.7)");
  grad.addColorStop(1, "rgba(15,23,42,0.0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(209,213,219,0.9)";
  ctx.beginPath();
  ctx.arc(sx, sy, radius * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function spawnPowerup(x, y) {
      const r = Math.random();
      let kind;
      if (r < 0.25) kind = "health";
      else if (r < 0.45) kind = "damage";
      else if (r < 0.6) kind = "speed";
      else if (r < 0.75) kind = "xp";
      else if (r < 0.9) kind = "speed2x";
      else kind = "gear_or_weapon";
      powerups.push({ x, y, r: 6, kind, ttl: 15000 });
    }

    function distance(x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1;
      return Math.sqrt(dx*dx + dy*dy);
    }

    function addXP(amount) {
      const gearMult = player.xpGearMult || 1;
      amount *= xpMultiplier * gearMult;
      player.xp += amount;
      while (player.xp >= player.nextLevelXp) {
        player.xp -= player.nextLevelXp;
        player.level++;
        player.nextLevelXp = Math.floor(player.nextLevelXp * 1.3);
        player.maxHp += 12;
        player.hp = player.maxHp;
        player.damage += 3;
        player.bodyDamage = player.damage;
        player.fireRate = Math.max(120, player.fireRate - 10);
        playUIBeep(650);
      }
    }

    function tryDash() {
      const now = performance.now();
      if (now - lastDashTime < player.dashCooldown) return;
      const moveX = (keys["d"] ? 1 : 0) - (keys["a"] ? 1 : 0);
      const moveY = (keys["s"] ? 1 : 0) - (keys["w"] ? 1 : 0);
      if (moveX === 0 && moveY === 0) return;
      lastDashTime = now;
      dashEndTime = now + player.dashDuration;
      playUIBeep(300);
    }

    function restartGame() {
      gameOver = false;
      points = 0;
      kills = 0;
      bullets = [];
      enemyBullets = [];
      enemies = [];
      powerups = [];
      damagePopups = [];
      bossAlive = false;
      bossKillsTrigger = 20;
      lastShotTime = 0;
      lastDashTime = -9999;
      dashEndTime = -9999;
      animTime = 0;
      shakeTime = 0;
      xpMultiplier = 1;
      xpBoostActive = false;
      speedBoostActive = false;

      // reset player + world
      resetPlayer();
      generateTilemap(); // Regenerate map on restart
      initDecorations(); // Reposition decorative trees on restart

      // reset wave state
      currentWaveConfig = null;
      wave = 1;
      waveEnemiesTarget = 0;
      waveEnemiesSpawned = 0;
      waveEnemiesKilled = 0;
      waveInBreak = false;
      waveBossSpawned = false;
      waveSpawnCooldown = 0;
      waveFlashAlpha = 0;

      gameOverEl.style.display = "none";
      gameState = "playing";

      // start fresh wave 1
      startWave(1);
    }

    let toastTimeout = null;
    function showToast(text) {
      centerToast.textContent = text;
      centerToast.style.opacity = "1";
      centerToast.style.transform = "translate(-50%, -50%) scale(1)";
      centerToast.style.transition = "opacity 0.25s ease-out, transform 0.25s ease-out";
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        centerToast.style.opacity = "0";
        centerToast.style.transform = "translate(-50%, -50%) scale(0.98)";
      }, 900);
    }

    function showSolanaRealmToast() {
      centerToast.textContent = "SOLANA REALM";
      centerToast.style.opacity = "1";
      centerToast.style.transform = "translate(-50%, -50%) scale(1)";
      centerToast.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        centerToast.style.opacity = "0";
        centerToast.style.transform = "translate(-50%, -50%) scale(0.9)";
      }, 1400);
    }

    function isPlayerNearUpgradeStation() {
      if (!upgradeStationPos) return false;
      return distance(player.x, player.y, upgradeStationPos.x, upgradeStationPos.y) < 90;
    }

    function spawnDamagePopup(value, x, y, isHeadshot) {
  damagePopups.push({ x, y, value, isHeadshot, ttl: 600, vy: 0.05, isArc: false });
}

// When player gets hit, ARC streak is lost
function resetArcStreakOnHit() {
  if (arcStreak > 0) {
    arcStreak = 0;
    arcMultiplier = 1;
    arcStreakLastKillTime = 0;
    if (arcMultLabel) {
      arcMultLabel.textContent = "ARC x1.0";
    }
  }
}


    // draw damage popups (handles ARC and headshot visuals)
function drawDamagePopups() {
  damagePopups.forEach(p => {
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;

    const baseTtl = p.baseTtl || 600;
    const lifeRatio = Math.max(0, p.ttl / baseTtl);
    const alpha = lifeRatio;

    ctx.save();
    ctx.textAlign = "center";

    if (p.isArc) {
      // === GOD-TIER ARC POPUP ===
      const tier = p.tier || "small";
      const extraScale =
        tier === "mega" ? 0.7 :
        tier === "big"  ? 0.4 :
                          0.25;

      const scale = 1 + extraScale * (1 - lifeRatio);
      const fontSize = 11 * scale;

      ctx.font = fontSize.toFixed(1) +
        "px 'Press Start 2P', system-ui, sans-serif";

      ctx.shadowColor = "rgba(250,204,21," + alpha + ")";
      ctx.shadowBlur = 10 * scale;

      const text = p.text || ("+" + p.value + " ARC");

      ctx.fillStyle = "rgba(250,204,21," + alpha + ")";
      ctx.strokeStyle = "rgba(15,23,42," + alpha + ")";
      ctx.lineWidth = 2.2 * scale;

      // subtle wobble
      const wobble = Math.sin((1 - lifeRatio) * Math.PI * 2) * 2 * scale;
      ctx.translate(0, wobble);

      ctx.strokeText(text, sx, sy);
      ctx.fillText(text, sx, sy);
    } else {
      // normal damage numbers stay simple
      ctx.font = "11px 'Press Start 2P', system-ui, sans-serif";
      ctx.fillStyle = p.isHeadshot
        ? "rgba(250,204,21," + alpha + ")"
        : "rgba(248,250,252," + alpha + ")";

      const text = p.isHeadshot ? "★ " + p.value : p.value;
      ctx.fillText(text, sx, sy);
    }

    ctx.restore();
  });
}

    // updateAchievements (already used in many places)
    function updateAchievements() {
      const p = points;
      const a1 = Math.min(1, p / 10000);
      const a2 = Math.min(1, p / 25000);
      const a3 = Math.min(1, p / 50000);

      ach1Fill.style.transform = "scaleX(" + a1 + ")";
      ach2Fill.style.transform = "scaleX(" + a2 + ")";
      ach3Fill.style.transform = "scaleX(" + a3 + ")";

      ach1Meta.textContent = Math.floor(a1 * 100) + "%";
      ach2Meta.textContent = Math.floor(a2 * 100) + "%";
      ach3Meta.textContent = Math.floor(a3 * 100) + "%";
    }

    // main update/draw loop (kept logic intact, ensured drawDamagePopups is used)
    function update(dt, now) {
    animTime += dt;
   // updateGroundLeaves(dt);
// updateLeaves(dt);

     // === PLAYER WALK / DUST ANIMATION UPDATE ===
  if (playerIsMoving) {
    playerWalkTimer += dt * 16.67;
    if (playerWalkTimer > PLAYER_WALK_FRAME_DURATION) {
      playerWalkTimer = 0;
      playerWalkFrame = (playerWalkFrame + 1) % PLAYER_WALK_FRAMES;
    }

    playerDustTimer += dt * 16.67;
    if (playerDustTimer > PLAYER_DUST_FRAME_DURATION) {
      playerDustTimer = 0;
      playerDustFrame = (playerDustFrame + 1) % PLAYER_DUST_FRAMES;
    }
  } else {
    playerWalkFrame = 0;
    playerDustFrame = 0;
    playerWalkTimer = 0;
    playerDustTimer = 0;
  }

      if (gameState !== "playing") {
        updateAchievements();
        return;
      }
      if (gameOver) return;

      if (shakeTime > 0) {
        shakeTime -= dt * 16.67;
        if (shakeTime < 0) shakeTime = 0;
      }

      if (xpBoostActive) {
        if (now >= xpBoostEndTime) {
          xpBoostActive = false;
          xpMultiplier = 1;
          xpBoostWrapper.style.display = "none";
        } else {
          const ratio = (xpBoostEndTime - now) / xpBoostDuration;
          xpBoostFill.style.transform = "scaleX(" + Math.max(0, ratio) + ")";
          xpBoostFill.style.background = "linear-gradient(90deg,#22c55e,#a855f7)";
        }
      }
      if (speedBoostActive) {
        if (now >= speedBoostEndTime) {
          speedBoostActive = false;
          player.speed = baseMoveSpeed;
          speedBoostWrapper.style.display = "none";
        } else {
          const ratio = (speedBoostEndTime - now) / speedBoostDuration;
          speedBoostFill.style.transform = "scaleX(" + Math.max(0, ratio) + ")";
          speedBoostFill.style.background = "linear-gradient(90deg,#38bdf8,#22c55e)";
        }
      }

      let moveX = (keys["d"] ? 1 : 0) - (keys["a"] ? 1 : 0);
      let moveY = (keys["s"] ? 1 : 0) - (keys["w"] ? 1 : 0);
      let length = Math.hypot(moveX, moveY);
      let speed = player.speed;

      if (now < dashEndTime) {
        speed = player.dashSpeed;
      }

      playerIsMoving = length > 0;

            if (length > 0) {

        moveX /= length;
        moveY /= length;
        const stepX = moveX * speed * dt;
        const stepY = moveY * speed * dt;

        const newX = player.x + stepX;
        if (!isSolidAt(newX - player.r, player.y) &&
            !isSolidAt(newX + player.r, player.y) &&
            !isSolidAt(newX, player.y - player.r) &&
            !isSolidAt(newX, player.y + player.r)) {
          player.x = newX;
        }

        const newY = player.y + stepY;
        if (!isSolidAt(player.x - player.r, newY) &&
            !isSolidAt(player.x + player.r, newY) &&
            !isSolidAt(player.x, newY - player.r) &&
            !isSolidAt(player.x, newY + player.r)) {
          player.y = newY;
        }
      }

                  // Keep player inside central play lane horizontally
const laneLeft = PLAY_MIN_X + player.r;
const laneRight = PLAY_MAX_X - player.r;
player.x = Math.max(
    laneLeft,
    Math.min(laneRight, player.x)
);

// Keep player inside world vertically
player.y = Math.max(
    player.r,
    Math.min(WORLD_HEIGHT - player.r, player.y)
);




      const timeSinceDash = now - lastDashTime;
      if (timeSinceDash >= player.dashCooldown) {
        dashLabel.textContent = "Dash: ready";
      } else {
        const t = Math.max(0, (player.dashCooldown - timeSinceDash) / 1000).toFixed(1);
        dashLabel.textContent = "Dash: " + t + "s";
      }

      const worldMouseX = camera.x + mouseX;
      const worldMouseY = camera.y + mouseY;
      playerFacingAngle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);

      if (mouseDown) {
        const timeSinceLast = now - lastShotTime;
        if (timeSinceLast >= player.fireRate) {
          shootWeapon();
          lastShotTime = now;
        }
      }

      bullets.forEach(b => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
      });
      bullets = bullets.filter(b =>
        b.life > 0 &&
        b.x > 0 && b.y > 0 &&
        b.x < WORLD_WIDTH && b.y < WORLD_HEIGHT
      );

      enemyBullets.forEach(b => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
      });
      enemyBullets = enemyBullets.filter(b =>
        b.life > 0 &&
        b.x > 0 && b.y > 0 &&
        b.x < WORLD_WIDTH && b.y < WORLD_HEIGHT
      );

      enemies.forEach(e => {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.hypot(dx, dy) || 1;
        let targetDist = 0;
        if (e.type === "ranged" || e.isBoss) targetDist = 170;
        let dirX = dx / dist;
        let dirY = dy / dist;
        let speedE = e.speed;

        if (targetDist > 0) {
          if (dist > targetDist + 25) {
          } else if (dist < targetDist - 25) {
            dirX *= -1;
            dirY *= -1;
          } else {
            speedE = 0;
          }
        }

        const wobble = Math.sin(animTime * 0.18 + e.wobblePhase) * 0.4;
        const stepX = (dirX * speedE + wobble) * dt;
        const stepY = (dirY * speedE) * dt;

        const newX = e.x + stepX;
        const newY = e.y + stepY;

        if (!isSolidAt(newX - e.r, e.y) &&
            !isSolidAt(newX + e.r, e.y) &&
            !isSolidAt(newX, e.y - e.r) &&
            !isSolidAt(newX, e.y + e.r)) {
          e.x = newX;
        }
        if (!isSolidAt(e.x - e.r, newY) &&
            !isSolidAt(e.x + e.r, newY) &&
            !isSolidAt(e.x, newY - e.r) &&
            !isSolidAt(e.x, newY + e.r)) {
          e.y = newY;
        }
                
       
       // keep enemies inside full world horizontally & vertically
if (e.x < e.r)               e.x = e.r;
if (e.x > WORLD_WIDTH - e.r) e.x = WORLD_WIDTH - e.r;
if (e.y < e.r)               e.y = e.r;
if (e.y > WORLD_HEIGHT - e.r) e.y = WORLD_HEIGHT - e.r;


        // Disable enemy shooting: ranged enemies and bosses no longer fire bullets
if ((e.type === "ranged" || e.isBoss) && dist < 430) {
  // shooting disabled
}

      });

      powerups.forEach(p => p.ttl -= dt * 16.67);
      powerups = powerups.filter(p => p.ttl > 0);

      // PLAYER BULLETS → ENEMIES
      bullets.forEach((b) => {
        enemies.forEach((e) => {
          const d = distance(b.x, b.y, e.x, e.y);
          if (d < 4 + e.r) {
            const relY = b.y - e.y;
            const isHeadshot = relY < -4;
            const baseDmg = (player.bodyDamage ?? player.damage);
            const multiplier = isHeadshot ? (player.headshotMultiplier || 2) : 1;
            const dmg = baseDmg * multiplier;

            e.hp -= dmg;
            spawnDamagePopup(Math.round(dmg), b.x, b.y - 8, isHeadshot);

            if (b.pierce && b.pierce > 0) {
              b.pierce--;
            } else {
              b.life = 0;
            }
          }
        });
      });
      bullets = bullets.filter(b => b.life > 0);

     enemies = enemies.filter(e => {
  if (e.hp <= 0) {
    const nowKill = performance.now();

    // handle DOUBLE KILL as before
    if (nowKill - lastKillTime <= DOUBLE_KILL_WINDOW) {
      showToast("DOUBLE KILL!");
      playRewardChime();
    }
    lastKillTime = nowKill;

    // === ARC STREAK / MULTIPLIER UPDATE ===
    if (nowKill - arcStreakLastKillTime <= ARC_STREAK_WINDOW) {
      arcStreak += 1;
    } else {
      arcStreak = 1;
    }
    arcStreakLastKillTime = nowKill;

    // multiplier grows with streak but is capped
    const streakBonusSteps = Math.min(arcStreak - 1, 9); // 0..9
    arcMultiplier = 1 + streakBonusSteps * 0.15;        // 1.0 → 2.35 max

    // ARC gain uses multiplier
    const baseArc = e.pointsReward;
    const arcGain = Math.round(baseArc * arcMultiplier);
    points += arcGain;
    spawnArcPopup(arcGain, e.x, e.y);

    kills += 1;
    addXP(e.xpReward);

    // wave / rift kill tracking: only count non-boss enemies
    if (!e.isBoss) {
      if (inRift) {
        riftEnemiesKilled++;
      } else {
        waveEnemiesKilled++;
      }
    }

    if (Math.random() < 0.25 || e.isBoss) {
      spawnPowerup(e.x, e.y);
    }
    if (e.isBoss) bossAlive = false;
    return false;
  }
  return true;
});


      enemyBullets.forEach(b => {
        const d = distance(b.x, b.y, player.x, player.y);
        if (d < b.r + player.r) {
  player.hp -= 10;
  resetArcStreakOnHit();
  b.life = 0;
  shakeTime = 180;
  shakeIntensity = 7;
  playGlassBreak();
}
      });
      enemyBullets = enemyBullets.filter(b => b.life > 0);

      enemies.forEach(e => {
  const d = distance(e.x, e.y, player.x, player.y);
  if (d < e.r + player.r) {
    player.hp -= e.isBoss ? 0.45 * dt : 0.25 * dt;
    resetArcStreakOnHit();
    shakeTime = 120;
    shakeIntensity = 6;
  }
});

      if (player.hp <= 0) {
        player.hp = 0;
        handleGameOver();
      }

      powerups = powerups.filter(p => {
        const d = distance(p.x, p.y, player.x, player.y);
        if (d < p.r + player.r + 4) {
          if (p.kind === "health") {
            player.hp = Math.min(player.maxHp, player.hp + 30);
          } else if (p.kind === "damage") {
            player.damage += 5;
            player.bodyDamage = player.damage;
          } else if (p.kind === "speed") {
            baseMoveSpeed += 0.2;
            player.speed = baseMoveSpeed;
          } else if (p.kind === "xp") {
            xpMultiplier = 2;
            xpBoostActive = true;
            xpBoostEndTime = performance.now() + xpBoostDuration;
            xpBoostWrapper.style.display = "block";
            showToast("DOUBLE XP!");
            playRewardChime();
          } else if (p.kind === "speed2x") {
            speedBoostActive = true;
            speedBoostEndTime = performance.now() + speedBoostDuration;
            player.speed = baseMoveSpeed * 2.1;
            speedBoostWrapper.style.display = "block";
            showToast("SPEED BOOST!");
            playRewardChime();
                    } else if (p.kind === "gear_or_weapon") {
            if (Math.random() < 0.5) {
              const g = getRandomGear();
              equipGear(g);
            } else {
              const w = getRandomWeapon();
              player.weapon = w;
              recomputeStats();
              showToast("Looted weapon: " + w.name);
              playRewardChime();
            }
          }

          // ARC from pickups also respects multiplier
          const basePickupArc = 15;
          const pickupArcGain = Math.round(basePickupArc * arcMultiplier);
          points += pickupArcGain;
          spawnArcPopup(pickupArcGain, p.x, p.y);

          return false;
        }
        return true;
      });


      // wave- or rift-based enemy spawning & bosses
      if (inRift) {
        updateRiftSystem(dt, now);
      } else {
        updateWaveSystem(dt, now);
      }

      // floating damage popups
damagePopups.forEach(p => {
  p.ttl -= dt * 16.67;
  p.y -= (p.vy || 0.05) * dt * 60;
  if (p.vx) {
    p.x += p.vx * dt * 60;
  }
});
damagePopups = damagePopups.filter(p => p.ttl > 0);

// ARC magnet orbs (visual only; ARC already added to points elsewhere)
arcOrbs.forEach(o => {
  o.life -= dt * 16.67;
  if (o.life <= 0) return;

  const toPx = player.x - o.x;
  const toPy = player.y - o.y;
  const dist = Math.hypot(toPx, toPy) || 1;

  // pull strength increases as orb gets closer to player
  const pull = 0.08 + (1 - Math.min(dist / 320, 1)) * 0.18;
  const ax = (toPx / dist) * pull * dt * 60;
  const ay = (toPy / dist) * pull * dt * 60;

  o.vx = (o.vx + ax) * 0.9;
  o.vy = (o.vy + ay) * 0.9;

  o.x += o.vx;
  o.y += o.vy;

  // collected if close to player
  if (dist < 22) {
    o.life = 0;

    // tiny gold spark burst on collect
    for (let i = 0; i < 6; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 1.6;
      particles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 14 + Math.random() * 10,
        size: 1.4 + Math.random() * 1.6,
        color: ["#facc15", "#fde68a"][Math.floor(Math.random() * 2)],
        fadeType: "spark"
      });
    }
  }
});
arcOrbs = arcOrbs.filter(o => o.life > 0);

      // move wind lines
      windLines.forEach(w => {
        w.x += w.vx * dt * 60;
        if (w.x > WORLD_WIDTH / 2 + 520) {
          w.x = WORLD_WIDTH / 2 - 520;
          w.y = WORLD_WIDTH / 2 - 500 + Math.random() * 1000;
        }
      });

      camera.x = player.x - canvas.width / 2;
      camera.y = player.y - canvas.height / 2;
      camera.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, camera.x));
      camera.y = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, camera.y));
// === ARC STREAK TIMER (for the bar) ===
let streakRatio = 0;
if (arcStreak > 0) {
  const elapsed = now - arcStreakLastKillTime;
  const t = 1 - elapsed / ARC_STREAK_WINDOW;
  if (t <= 0) {
    // timer ran out → lose streak & reset multiplier
    arcStreak = 0;
    arcMultiplier = 1;
    streakRatio = 0;
  } else {
    streakRatio = Math.max(0, Math.min(1, t));
  }
}
      levelLabel.textContent = "LVL " + player.level;
pointsLabel.textContent = "ARC: " + points.toLocaleString();
killsLabel.textContent = "Kills: " + kills;

if (arcMultLabel) {
  if (arcStreak <= 1) {
    arcMultLabel.textContent = "ARC x" + arcMultiplier.toFixed(1);
  } else {
    arcMultLabel.textContent =
      "ARC x" + arcMultiplier.toFixed(1) + " (" + arcStreak + ")";
  }
}


      const hpRatio = player.hp / player.maxHp;
      hpBar.style.background = "linear-gradient(90deg, #f97373, #facc15)";
      hpBar.style.transform = "scaleX(" + Math.max(0, hpRatio) + ")";
      hpLabel.textContent = "HP " + Math.round(player.hp) + " / " + player.maxHp;

      const xpRatio = player.xp / player.nextLevelXp;
      xpBar.style.background = "linear-gradient(90deg, #22c55e, #38bdf8)";
      xpBar.style.transform = "scaleX(" + xpRatio + ")";
      xpLabel.textContent = "XP " + player.xp + " / " + player.nextLevelXp;
// ARC streak bar (shows time left to keep multiplier)
if (arcStreakBar && arcStreakLabel) {
  // color: green → yellow as it drains
  if (streakRatio > 0) {
    arcStreakBar.style.background =
      "linear-gradient(90deg, #22c55e, #eab308)";
  } else {
    arcStreakBar.style.background =
      "linear-gradient(90deg, #4b5563, #020617)";
  }

  arcStreakBar.style.transform = "scaleX(" + streakRatio + ")";

  if (arcStreak <= 0 || arcMultiplier <= 1) {
    arcStreakLabel.textContent = "STREAK x1.0";
  } else {
    arcStreakLabel.textContent =
      "STREAK x" + arcMultiplier.toFixed(1) + " (" + arcStreak + ")";
  }
}


      updateAchievements();

      // Removed farm animals; no update needed
    }

    // Helper to draw the battlefield tiles. We tile the loaded textures across the visible
// portion of the canvas based on the camera. If an image hasn't loaded yet, we skip.
function drawGround() {
  // Base fill to avoid blank bands on wide screens
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Determine visible tile range based on the camera position
  const startCol = Math.floor(camera.x / TILE_SIZE);
  const startRow = Math.floor(camera.y / TILE_SIZE);
  const endCol   = Math.ceil((camera.x + canvas.width)  / TILE_SIZE);
  const endRow   = Math.ceil((camera.y + canvas.height) / TILE_SIZE);

  // Precompute tileset source rect for the farm lane
  const middleSrcX = MIDDLE_TILE_COL * TILESET_TILE_SIZE;
  const middleSrcY = MIDDLE_TILE_ROW * TILESET_TILE_SIZE;
  const tilesetReady =
    TILESET_IMG.complete && TILESET_IMG.naturalWidth > 0;

  const useRiftTiles = inRift && riftTiles.length > 0;

  // Use worldRows/worldCols as a repeating pattern, so the field never “runs out”
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      // wrap indices into the valid groundMap range
      const wrappedRow = ((row % worldRows) + worldRows) % worldRows;
      const wrappedCol = ((col % worldCols) + worldCols) % worldCols;

      const worldX = col * TILE_SIZE;
      const worldY = row * TILE_SIZE;

      const sx = worldX - camera.x;
      const sy = worldY - camera.y;

      // Decide if this tile is inside the playable middle lane
      const inMiddleLane =
        (worldX + TILE_SIZE > PLAY_MIN_X) &&
        (worldX < PLAY_MAX_X);

      if (useRiftTiles) {
        // Inside SOLANA REALM: repaint everything with Dark Castle tiles
        const tileIndex = groundMap[wrappedRow][wrappedCol];
        const safeIndex = tileIndex % riftTiles.length;
        const img = riftTiles[safeIndex];
        if (!img || !img.complete || img.naturalWidth === 0) continue;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE);
        continue;
      }

      // Normal world: in the middle lane AND the Tileset.png is loaded → use that sheet
      if (inMiddleLane && tilesetReady) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          TILESET_IMG,
          middleSrcX, middleSrcY,                // source tile in Tileset.png
          TILESET_TILE_SIZE, TILESET_TILE_SIZE,  // source size
          sx, sy,
          TILE_SIZE, TILE_SIZE                   // draw upscaled to 32x32
        );
        continue;
      }

      // Otherwise: use the normal field tiles (existing behaviour)
      const tileIndex = groundMap[wrappedRow][wrappedCol];
      const img = fieldTiles[tileIndex];
      if (!img || !img.complete || img.naturalWidth === 0) continue;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE);
    }
  }
}
// Draw stone walls along the left & right edge of the playable lane.
// Purely visual: collision is still handled via PLAY_MIN_X / PLAY_MAX_X.
// Draw stone walls along the left & right edge of the playable lane.
// Purely visual: collision is still handled via PLAY_MIN_X / PLAY_MAX_X.


    // Render the wandering animals within the farm.  Each animal is drawn as a simple
    // colored circle with a dark outline.  If you wish to replace these with
    // actual sprites later, load your sprite and draw it here instead.
    function drawFarmAnimals() {
      farmAnimals.forEach(a => {
        const sx = a.x - camera.x;
        const sy = a.y - camera.y;
        // Only draw if on screen
        if (sx < -a.r || sy < -a.r || sx > canvas.width + a.r || sy > canvas.height + a.r) return;
        ctx.save();
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(sx, sy, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });
    }

    // Helper to draw the farm overlay.  We draw the farm image at its world position
    // offset by the camera.  The farm is drawn after the ground but before entities.
    function drawFarm() {
      if (!farmImg || !farmImg.complete || farmImg.naturalWidth === 0) return;
      const sx = farmX - camera.x;
      const sy = farmY - camera.y;
      const drawW = farmWidth;
      const drawH = farmHeight;
      ctx.drawImage(farmImg, sx, sy, drawW, drawH);
    }

    function handleGameOver() {
      if (gameOver) return;
      gameOver = true;
      gameOverStatsEl.textContent =
        "You reached level " + player.level +
        ", earned " + points.toLocaleString() + " ARC and " +
        kills + " kills.";
      gameOverEl.style.display = "flex";
    }

    function shootWeapon() {
      const worldMouseX = camera.x + mouseX;
      const worldMouseY = camera.y + mouseY;
      const dx = worldMouseX - player.x;
      const dy = worldMouseY - player.y;
      const baseAngle = Math.atan2(dy, dx) || 0;

      const w = player.weapon || getDefaultWeapon();
      const pellets = w.pellets || 1;
      const spread = w.spread || 0;

      for (let i = 0; i < pellets; i++) {
        const offset = (pellets === 1) ? 0 : (i - (pellets - 1) / 2) * spread;
        const angle = baseAngle + offset;
        const vx = Math.cos(angle) * player.bulletSpeed;
        const vy = Math.sin(angle) * player.bulletSpeed;

        bullets.push({
          x: player.x,
          y: player.y,
          vx,
          vy,
          angle,
          life: 600,
          pierce: w.pierce || 0
        });
      }
      playGunshot(1 + (pellets - 1) * 0.1);
    }

    // DRAW all
    function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the battlefield tiles across the entire viewport
  drawGround();

  // Scatter decorative objects on top of the ground
  drawDecorations();

  // Glowing Solana totem statue
  drawSolanaTotem();

  // Rift portal (if one is active)
  drawRiftPortal();

  ctx.save();
  if (shakeTime > 0) {
    const s = shakeIntensity * (shakeTime / 180);
    const dx = (Math.random() - 0.5) * s;
    const dy = (Math.random() - 0.5) * s;
    ctx.translate(dx, dy);
  }
  // wind streaks
      ctx.strokeStyle = "rgba(209,213,219,0.35)";
      ctx.lineWidth = 1;
      windLines.forEach(w => {
        const sx = w.x - camera.x;
        const sy = w.y - camera.y;
        if (sx < -20 || sy < -20 || sx > canvas.width + 20 || sy > canvas.height + 20) return;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 10, sy - 2);
        ctx.stroke();
      });

      // powerups
      powerups.forEach(p => {
        const sx = p.x - camera.x;
        const sy = p.y - camera.y;

        // shadow under the item
        ctx.fillStyle = "rgba(15,23,42,0.85)";
        ctx.beginPath();
        ctx.ellipse(sx, sy + 5, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // pick which tile from Treasure.png to use
        // (grid is 16x16 tiles, each 16x16 pixels)
        let tileCol = 0;
        let tileRow = 0;

        // HEALTH: cyan heart (col 9, row 12)
        if (p.kind === "health") {
          tileCol = 9;
          tileRow = 12;

        // XP: white diamond (col 12, row 9)
        } else if (p.kind === "xp") {
          tileCol = 12;
          tileRow = 9;

        // DAMAGE: golden sword (col 8, row 5)
        } else if (p.kind === "damage") {
          tileCol = 8;
          tileRow = 5;

        // SPEED / 2x SPEED: arrow (col 7, row 5)
        } else if (p.kind === "speed" || p.kind === "speed2x") {
          tileCol = 7;
          tileRow = 5;

        // gear_or_weapon or anything else: treasure chest (col 10, row 10)
        } else {
          tileCol = 10;
          tileRow = 10;
        }

        // draw the tile as a crisp pixel icon
        const iconSize = 26; // how big on screen
        const srcX = tileCol * POWERUP_TILE_SIZE;
        const srcY = tileRow * POWERUP_TILE_SIZE;

        ctx.save();
        ctx.imageSmoothingEnabled = false; // keep it pixel-sharp
        ctx.drawImage(
          powerupSheetImg,
          srcX, srcY,
          POWERUP_TILE_SIZE, POWERUP_TILE_SIZE,
          sx - iconSize / 2, sy - iconSize / 2,
          iconSize, iconSize
        );
        ctx.restore();
      });
// ARC magnet orbs
      arcOrbs.forEach(o => {
        const sx = o.x - camera.x;
        const sy = o.y - camera.y;
        if (sx < -20 || sy < -20 || sx > canvas.width + 20 || sy > canvas.height + 20) return;

        const t = Math.max(0, o.life / o.maxLife);
        const radius = 4 + o.size * (0.4 + 0.6 * t);

        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
        grad.addColorStop(0, "rgba(250,250,210,0.95)");
        grad.addColorStop(0.4, "rgba(250,204,21,0.9)");
        grad.addColorStop(1, "rgba(250,204,21,0.0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      });


      // enemy bullets
      enemyBullets.forEach(b => {
        const sx = b.x - camera.x;
        const sy = b.y - camera.y;
        ctx.fillStyle = "#fecaca";
        ctx.beginPath();
        ctx.arc(sx, sy, b.r+1, 0, Math.PI*2);
        ctx.fill();
      });

    
      // enemies
      enemies.forEach(e => {
        const sx = e.x - camera.x;
        const sy = e.y - camera.y;

        // Animate through all frames in the mushroom strip
        const frames = ENEMY_TOTAL || 1;
        const animSpeed = 6; // higher = faster animation
        const t = animTime * animSpeed + (e.wobblePhase || 0);
        const frameIndex = Math.floor(t) % frames;

        drawEnemySprite(sx, sy, e, frameIndex);


        const ratio = e.hp / e.maxHp;
        const barW = e.isBoss ? 48 : 26;
        const barX = sx - barW/2;
        const barY = sy - e.r - 10;
        ctx.fillStyle = "rgba(15,23,42,0.9)";
        ctx.fillRect(barX, barY, barW, 4);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(barX, barY, barW * ratio, 4);
      });

      // player bullets
      bullets.forEach(b => {
        const sx = b.x - camera.x;
        const sy = b.y - camera.y;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(b.angle);

        if (bulletImg.complete && bulletImg.naturalWidth > 0) {
          const scale = 1.2; // tweak this if the bullet looks too big/small
          const w = bulletImg.naturalWidth * scale;
          const h = bulletImg.naturalHeight * scale;

          // draw bullet centered on its position, pointing along b.angle
          ctx.drawImage(
            bulletImg,
            -w / 2,
            -h / 2,
            w,
            h
          );
        } else {
          // fallback: simple line if image isn't loaded yet
          const len = 10;
          ctx.fillStyle = "#e5e7eb";
          ctx.fillRect(-len / 2, -1, len, 2);
        }

        ctx.restore();
      });


      // floating damage numbers
      drawDamagePopups();

      // player
      const px = player.x - camera.x;
      const py = player.y - camera.y;
      const moving = (keys["w"] || keys["a"] || keys["s"] || keys["d"]);
      let frameIndex = 0;
      if (moving && gameState === "playing") {
        const t = (animTime * 16.67 / 150) % 2;
        frameIndex = t < 1 ? 1 : 2;
      }
      drawPlayerSprite(px, py, frameIndex);

      // cinematic leaf overlay
      // drawLeaves(); // Removed as per request

      

      

      // Rift visual overlay
      drawRiftOverlay();
// wave start flash overlay
      if (waveFlashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = waveFlashAlpha;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const grad = ctx.createRadialGradient(
          cx, cy, 0,
          cx, cy, Math.max(canvas.width, canvas.height)
        );
        grad.addColorStop(0, "rgba(250,204,21,0.35)");
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
ctx.restore();
    }

    // ===== MAIN LOOP =====
    function loop(now) {
      const dt = Math.min(2.5, (now - lastTime) / 16.67);
      lastTime = now;
      update(dt, now);
      draw();
      requestAnimationFrame(loop);
    }

    // init
    initSky();
    initWind();
    initLeaves();
    resetPlayer();
    // start at wave 1 instead of raw spawns
    startWave(1);
    requestAnimationFrame(loop);

    // +ARC popup + magnet orbs
function spawnArcPopup(amount, x, y) {
  const numericAmount = Math.round(amount);

  // popup text (value stays numeric, text is the pretty string)
  damagePopups.push({
    x,
    y: y - 20,
    value: numericAmount,
    text: "+" + numericAmount.toLocaleString() + " ARC",
    ttl: 900,
    baseTtl: 900,
    vy: 0.08,
    isArc: true
  });

  // visual ARC orbs (points are already applied elsewhere)
  const orbCount = Math.max(1, Math.min(7, Math.round(numericAmount / 12)));
  for (let i = 0; i < orbCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spread = 10 + Math.random() * 28;
    const ox = x + Math.cos(angle) * spread;
    const oy = y + Math.sin(angle) * spread;
    const life = 1600 + Math.random() * 600;

    arcOrbs.push({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      life,
      maxLife: life,
      size: 1 + Math.random() * 1.2
    });
  }
}

    function triggerShake(intensity = 10) {
      screenShake = intensity;
    }

        function spawnLightningBurst(x, y) {
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 25 + Math.random() * 20,
          color: ["#00ffea", "#ffaa00", "#ffff44", "#ff44ff"][Math.floor(Math.random() * 4)],
          size: 2 + Math.random() * 4,
          fadeType: "glow",
        });
      }
      triggerShake(15);
    }


        function spawnNova(x, y) {
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const speed = 4 + Math.random() * 5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 45,
          color: i % 3 === 0 ? "#00ffea" : (i % 3 === 1 ? "#ffaa00" : "#ff44ff"),
          size: 4 + Math.random() * 3,
        });
      }
      triggerShake(25);
    }

 
});