// ====== DATA : LISTE DES 5 QUÊTES & SONS ======
const quests = [
  {
    id: 1,
    label: "Dragon sacrifice", // dragon bloque le chemin
    file: "Enchanted, Mystical Forest. relaxing music, deep sleep, 2 minutes MEDITATION music, SPA MUSIC, ZEN.mp3",
  },
  {
    id: 2,
    label: "Canyon scout", // canyon étroit, éclaireur
    file: "Cave Sound Effects - Royalty Free, Ambience Cave Sound Effects (2 Minutes).mp3",
  },
  {
    id: 3,
    label: "Night watch", // garde de nuit, animaux au loin
    file: "Jungle and Rainforest Sound Effects - Tropical Forest Ambiences from Costa Rica.mp3",
  },
  {
    id: 4,
    label: "Breaking bridge", // pont en bois qui casse
    file: "2min. of forest sounds.mp3",
  },
  {
    id: 5,
    label: "Food shortage", // rations faibles, pénalités par rôle
    file: "Campfire & River Night Ambience.mp3",
  },
];

// ====== RÉFÉRENCES DOM ======
const questListEl = document.getElementById("questList");
const volumeSlider = document.getElementById("volumeSlider");
const toggleButton = document.getElementById("toggleButton");
const currentInfo = document.getElementById("currentInfo");

// ====== ÉTAT AUDIO ======
let currentAudio = null;
let currentQuest = null;   // quest en cours
let lastQuest = null;      // dernière quest jouée
let questButtonsById = {}; // pour gérer les boutons actifs

// ====== UI HELPERS ======
function updateCurrentInfo() {
  if (currentAudio && currentQuest) {
    currentInfo.innerHTML = `Now playing: <span>${currentQuest.label}</span>`;
  } else if (lastQuest) {
    currentInfo.innerHTML = `Stopped. Last ambience: <span>${lastQuest.label}</span>`;
  } else {
    currentInfo.textContent = "No ambience playing.";
  }
}

function updateToggleLabel() {
  if (currentAudio) {
    // MODE STOP → rouge
    toggleButton.innerHTML = "<span>⏹</span> Stop ambience";
    toggleButton.classList.remove("btn-play");
  } else if (lastQuest) {
    // MODE PLAY → vert
    toggleButton.innerHTML = "<span>▶</span> Play last ambience";
    toggleButton.classList.add("btn-play");
  } else {
    toggleButton.innerHTML = "<span>⏹</span> Stop / Play";
    toggleButton.classList.remove("btn-play");
  }
}

function clearActiveButtons() {
  Object.values(questButtonsById).forEach((btn) =>
    btn.classList.remove("active")
  );
}

// ====== LOGIQUE AUDIO ======
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  currentQuest = null;
  clearActiveButtons();
  updateCurrentInfo();
  updateToggleLabel();
}

function playQuest(quest) {
  // stop l'ancienne ambiance si besoin
  stopCurrentAudio();

  const audio = new Audio("audio/" + quest.file);
  audio.loop = true; // la piste tourne en boucle
  audio.volume = parseFloat(volumeSlider.value);

  currentAudio = audio;
  currentQuest = quest;
  lastQuest = quest;

  const btn = questButtonsById[quest.id];
  if (btn) btn.classList.add("active");

  updateCurrentInfo();
  updateToggleLabel();

  audio.play().catch((err) => {
    console.error("Playback error:", err);
    currentInfo.textContent =
      "Unable to play audio. Check your file path or browser settings.";
    stopCurrentAudio();
  });
}

// ====== GÉNÉRATION DES BOUTONS ======
function createQuestButtons() {
  quests.forEach((quest) => {
    const btn = document.createElement("button");
    btn.className = "quest-btn";
    btn.dataset.id = quest.id;

    btn.innerHTML = `
      <div class="quest-number">${quest.id}</div>
      <div class="quest-content">
        <div class="quest-label">${quest.label}</div>
      </div>
    `;

    btn.addEventListener("click", () => {
      playQuest(quest);
    });

    questListEl.appendChild(btn);
    questButtonsById[quest.id] = btn;
  });
}

// ====== CONTROLES GLOBAUX ======
toggleButton.addEventListener("click", () => {
  if (currentAudio && currentQuest) {
    // si une ambiance est en cours -> STOP
    stopCurrentAudio();
  } else if (!currentAudio && lastQuest) {
    // si rien ne joue mais on a une dernière quest -> relance
    playQuest(lastQuest);
  }
  // si pas de lastQuest, le bouton ne fait rien (au tout début)
});

volumeSlider.addEventListener("input", () => {
  if (currentAudio) {
    currentAudio.volume = parseFloat(volumeSlider.value);
  }
});

// ====== INIT ======
createQuestButtons();
updateCurrentInfo();
updateToggleLabel();
