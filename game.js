const gameSection = document.getElementById("screenGame");
const thanksSection = document.getElementById("screenThanks");
const bgSource = document.getElementById("bgSource");
const backgroundVideoElement = document.getElementById("backgroundVideo");
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");

const finalTimeEl = document.getElementById("finalTime");
const finalMovesEl = document.getElementById("finalMoves");
const topScoresEl = document.getElementById("topScores");

const cols = 4;
const rows = 4;
const totalPairs = (cols * rows) / 2;
let selectedCards = [];
let matchedPairs = 0;
let cards = [];
let moveCount = 0;
let startTime;

const config = {
  type: Phaser.CANVAS,
  parent: "puzzleContainer",
  backgroundColor: "transparent",
  scene: {
    preload,
    create
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1080,
    height: 1080,
  }
};

function preload() {
  for (let i = 1; i <= totalPairs; i++) {
    this.load.image(`img${i}`, `assets/imagen.${i}.1.jpg`);
  }
  this.load.image("back", "assets/back.jpg");
}

function create() {
  selectedCards = [];
  matchedPairs = 0;
  moveCount = 0;
  cards = [];
  startTime = Date.now();

  const images = [];
  for (let i = 1; i <= totalPairs; i++) {
    images.push(`img${i}`);
    images.push(`img${i}`);
  }

  Phaser.Utils.Array.Shuffle(images);

  const cardSize = 215;
  const spacing = 1;
const totalWidth = cols * cardSize + (cols - 1) * spacing;
const totalHeight = rows * cardSize + (rows - 1) * spacing;

const offsetX = (this.scale.width - totalWidth) / 1;
const offsetY = (this.scale.height - totalHeight) / 1;


  for (let i = 0; i < cols * rows; i++) {
    const x = offsetX + (i % cols) * (cardSize + spacing);
    const y = offsetY + Math.floor(i / cols) * (cardSize + spacing);

    const card = this.add.image(x, y, "back")
      .setInteractive()
      .setDisplaySize(cardSize, cardSize);

    card.cardKey = images[i];
    card.isFlipped = false;

    card.on("pointerdown", () => {
      if (!card.isFlipped && selectedCards.length < 2) {
        flipCard(this, card);
      }
    });

    cards.push(card);
  }
}

function flipCard(scene, card) {
  card.setTexture(card.cardKey);
  card.isFlipped = true;
  selectedCards.push(card);

  if (selectedCards.length === 2) {
    moveCount++;
    moveSound?.play();

    scene.time.delayedCall(700, () => {
      const [card1, card2] = selectedCards;

      if (card1.cardKey === card2.cardKey) {
        matchedPairs++;
        if (matchedPairs === totalPairs) {
          winSound?.play();
          const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          const score = { time: elapsedTime, moves: moveCount };
          saveScore(score);

          scene.time.delayedCall(1500, () => {
            scene.scene.stop();
            scene.game.destroy(true);
            fadeToScreen("screenGame", "screenThanks");
            bgSource.src = "assets/fondo.mp4";
            backgroundVideoElement.load();

            finalTimeEl.textContent = `${elapsedTime} segundos`;
            finalMovesEl.textContent = moveCount;

            const topScores = getTopScores();
            topScoresEl.innerHTML = topScores
              .map((s, i) => `<li>${i + 1}. Tiempo: ${s.time}s, Movs: ${s.moves}</li>`)
              .join("");

const player = JSON.parse(localStorage.getItem("bam-player") || "{}");
document.getElementById("resultText").textContent =
  `¡Completado!\nPares encontrados: ${matchedPairs}\n` +
  `Jugador: ${player.name || "-"} ${player.last || "-"}\n` +
  `País: ${player.country || "Desconocido"}`;            startFireworks();
          });
        }
      } else {
        card1.setTexture("back");
        card2.setTexture("back");
        card1.isFlipped = false;
        card2.isFlipped = false;
      }

      selectedCards = [];
    });
  }
}

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem("bam-memory-scores") || "[]");
  scores.push(score);
  scores.sort((a, b) => a.time - b.time || a.moves - b.moves);
  localStorage.setItem("bam-memory-scores", JSON.stringify(scores.slice(0, 5)));
}

function getTopScores() {
  return JSON.parse(localStorage.getItem("bam-memory-scores") || "[]");
}

window.config = config;
