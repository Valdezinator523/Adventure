const show = (element) => {
  element.style.display = "block";
};

const hide = (element) => {
  element.style.display = "none";
};

const game = {
  enemies: enemies,

  start: (name) => {
    game.heroes[0].name = name;
    game.log("Game Started");
    const battleManager = new BattleManager(game, game.heroes, game.enemies);
    battleManager.start();
  },
  log: (text, color) => {
    const gameText = document.getElementById("gameText");
    const textParagraph = document.createElement("p");
    textParagraph.innerHTML = text;
    textParagraph.style.color = color ?? null;
    gameText.appendChild(textParagraph);
    textParagraph.scrollIntoView();
  },

  localization: new Localization("en-US"),

  ui: {
    gameUi: document.getElementById("gameUi"),
    gameOverUi: document.getElementById("gameOverUi"),
  },
  heroes: heroes,
  // TODO: permanently display parties current gold
  party: new Party({
    gold: 100,
  }),
};
// TODO: Make an "action point" system where each turn they gain whatever their speed is in action points and can expend them to attack. Possibly attacking twice in one turn.
// TODO: Make the game text more smooth instead of just appearing
// TODO: Make an option for what the font of the games text should be
const beginAdventure = document.getElementById("beginAdventure");

const startButton = document.getElementById("startButton");
const onStartButtonClick = () => {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value;
  beginAdventure.style.display = "none";
  game.start(name);
};
startButton.addEventListener("click", onStartButtonClick);
