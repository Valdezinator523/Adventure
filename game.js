const show = (element) => {
  element.style.display = "block";
};

const hide = (element) => {
  element.style.display = "none";
};

const game = {
  enemies: enemies,

  start: (name, race) => {
    game.heroes[0].name = name;
    game.heroes[0].race.name = race;
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
  //Permanently display parties current gold
  party: new Party({
    gold: 100,
  }),
};
// TODO: Make an "action point" system where each turn they gain whatever their speed is in action points and can expend them to attack. Possibly attacking twice in one turn.
// TODO: Make the game text more smooth instead of just appearing
// TODO: Make an option for what the font of the games text should be
const beginAdventure = document.getElementById("beginAdventure");

//set up race input
const raceInput = document.getElementById("raceInput");
const raceOptions = Object.values(HeroRaceName).map((heroRaceName) => {
  const option = document.createElement("option");
  option.setAttribute("label", heroRaceName);
  option.setAttribute("value", heroRaceName);
  return option;
});

raceOptions.forEach((raceOption) => {
  raceInput.appendChild(raceOption);
});

const startButton = document.getElementById("startButton");
const onStartButtonClick = () => {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value;
  const raceInput = document.getElementById("raceInput");
  const race = raceInput.value;
  beginAdventure.style.display = "none";
  game.start(name, race);
};
startButton.addEventListener("click", onStartButtonClick);
