// ====== DATA : LISTE DES 5 QUÊTES & SONS ======
const quests = [
  {
    id: 1,
    label: "Dragon sacrifice",
    file: "Enchanted, Mystical Forest. relaxing music, deep sleep, 2 minutes MEDITATION music, SPA MUSIC, ZEN.mp3",
  },
  {
    id: 2,
    label: "Canyon scout",
    file: "Cave Sound Effects - Royalty Free, Ambience Cave Sound Effects (2 Minutes).mp3",
  },
  {
    id: 3,
    label: "Night watch",
    file: "Jungle and Rainforest Sound Effects - Tropical Forest Ambiences from Costa Rica.mp3",
  },
  {
    id: 4,
    label: "Breaking bridge",
    file: "2min. of forest sounds.mp3",
  },
  {
    id: 5,
    label: "Food shortage",
    file: "Campfire & River Night Ambience.mp3",
  },
];

// ====== RÉFÉRENCES DOM ======
const questListEl = document.getElementById("questList");
const volumeSlider = document.getElementById("volumeSlider");
const toggleButton = document.getElementById("toggleButton");
const currentInfo = document.getElementById("currentInfo");

// ====== ÉTAT AUDIO ======
let currentAudio = null;   // objet Audio chargé (même en pause)
let currentQuest = null;   // quest en cours de lecture
let lastQuest = null;      // dernière quest utilisée
let questButtonsById = {}; // pour gérer .active
let isPlaying = false;     // true si le son est en train de jouer

// ====== UI HELPERS ======
function updateCurrentInfo() {
  if (isPlaying && currentQuest) {
    currentInfo.innerHTML = `Now playing: <span>${currentQuest.label}</span>`;
  } else if (currentAudio && lastQuest) {
    currentInfo.innerHTML = `Stopped. Last ambience: <span>${lastQuest.label}</span>`;
  } else {
    currentInfo.textContent = "No ambience playing.";
  }
}

function updateToggleLabel() {
  if (isPlaying) {
    // MODE STOP (rouge)
    toggleButton.innerHTML = "<span>⏹</span> Stop ambience";
    toggleButton.classList.remove("btn-play");
  } else if (currentAudio && lastQuest) {
    // MODE PLAY LAST (vert)
    toggleButton.innerHTML = "<span>▶</span> Play last ambience";
    toggleButton.classList.add("btn-play");
  } else {
    // Aucun son chargé
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

// STOP = juste pause (on garde la position)
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
  }
  isPlaying = false;
  currentQuest = null;
  clearActiveButtons();
  updateCurrentInfo();
  updateToggleLabel();
}

// Play une nouvelle quête (reset au début)
function playQuest(quest) {
  // si un audio était déjà chargé, on le coupe
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  isPlaying = false;
  clearActiveButtons();

  const audio = new Audio("audio/" + quest.file);

  const vol = parseFloat(volumeSlider.value);
  audio.loop = true;
  audio.volume = vol;
  audio.muted = vol === 0; // 0 = mute total (utile sur mobile)

  currentAudio = audio;
  currentQuest = quest;
  lastQuest = quest;
  isPlaying = true;

  const btn = questButtonsById[quest.id];
  if (btn) btn.classList.add("active");

  updateCurrentInfo();
  updateToggleLabel();

  audio.play().catch((err) => {
    console.error("Playback error:", err);
    currentInfo.textContent =
      "Unable to play audio. Check your file path or browser settings.";
    isPlaying = false;
    clearActiveButtons();
    updateToggleLabel();
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

// Bouton Stop / Play last
toggleButton.addEventListener("click", () => {
  if (isPlaying && currentAudio) {
    // STOP → pause (sans reset)
    stopCurrentAudio();
  } else if (!isPlaying && currentAudio && lastQuest) {
    // PLAY LAST → reprend là où on s'était arrêté
    currentAudio
      .play()
      .then(() => {
        isPlaying = true;
        currentQuest = lastQuest;

        const btn = questButtonsById[lastQuest.id];
        if (btn) btn.classList.add("active");

        updateCurrentInfo();
        updateToggleLabel();
      })
      .catch((err) => {
        console.error("Playback error:", err);
        currentInfo.textContent =
          "Unable to play audio. Check your file path or browser settings.";
      });
  }
});

// Volume (inclut mute quand slider à 0)
volumeSlider.addEventListener("input", () => {
  if (currentAudio) {
    const vol = parseFloat(volumeSlider.value);
    currentAudio.volume = vol;
    currentAudio.muted = vol === 0;
  }
});

// ====== INIT ======
createQuestButtons();
updateCurrentInfo();
updateToggleLabel();
