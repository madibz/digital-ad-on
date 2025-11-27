// ====== DATA : LISTE DES QUÊTES & SONS ======
const quests = [
    {
      id: 1,
      label: "Forest fatigue",
      file: "Nighttime Forest Sounds.mp3",
    },
    {
      id: 2,
      label: "Magical creature",
      file: "Enchanted, Mystical Forest. relaxing music, deep sleep, 2 minutes MEDITATION music, SPA MUSIC, ZEN.mp3",
    },
    {
      id: 3,
      label: "Choosing leader",
      file: "2min. of forest sounds.mp3",
    },
    {
      id: 4,
      label: "Night watch",
      file: "Jungle and Rainforest Sound Effects - Tropical Forest Ambiences from Costa Rica.mp3",
    },
    {
      id: 5,
      label: "Campfire argument",
      file: "Campfire & River Night Ambience.mp3",
    },
    {
      id: 6,
      label: "Finding camp",
      file: "2min. of forest sounds.mp3",
    },
    {
      id: 7,
      label: "Low supplies",
      file: "[2-mins] Nature Sounds - Woods 1 - Forest Ambience - Crickets - Birds - Rustling Leaves - Relaxation.mp3",
    },
    {
      id: 8,
      label: "Uneven load",
      file: "2 Minutes of Calm  Nature Sounds 2 Mins  RelaxRelaxation  Birds Singing PeaceMeditation .mp3",
    },
    {
      id: 9,
      label: "Abandoned camp",
      file: "2 Minute Cozy Camping Timer (Owls, Birds, and Cricket Sounds Throughout).mp3",
    },
    {
      id: 10,
      label: "Lost path",
      file: "Rain Sound Effect Short (2 minutes) ♪.mp3",
    },
    {
      id: 11,
      label: "Narrow passage",
      file: "Wind Sound SOUND EFFECT - No Copyright[Download Free].mp3",
    },
    {
      id: 12,
      label: "Storm coming",
      file: "2 Minutes of Calm  Nature Sounds 2 Mins  RelaxRelaxation  Birds Singing PeaceMeditation .mp3",
    },
  ];
  
  // ====== RÉFÉRENCES DOM ======
  const questListEl = document.getElementById("questList");
  const volumeSlider = document.getElementById("volumeSlider");
  const toggleButton = document.getElementById("toggleButton");
  const currentInfo = document.getElementById("currentInfo");
  
  // ====== ÉTAT AUDIO ======
  let currentAudio = null;
  let currentQuest = null; // quest en cours
  let lastQuest = null; // dernière quest jouée
  let questButtonsById = {}; // pour gérer .active
  
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
      toggleButton.innerHTML = "<span>⏹</span> Stop ambience";
    } else if (lastQuest) {
      toggleButton.innerHTML = "<span>▶</span> Play last ambience";
    } else {
      toggleButton.innerHTML = "<span>⏹</span> Stop / Play";
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
    audio.loop = true; // boucle en continu
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
  