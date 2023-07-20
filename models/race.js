const HeroRaceName = {
  Elf: "Elf",
  Human: "Human",
  Dwarf: "Dwarf",
  Halfling: "Halfling",
  Orc: "Orc",
  Goblin: "Goblin",
};
//NEXT ON AGENDA assign chosen race to heroes attributes
const RaceName = {
  ...HeroRaceName,
  Troll: "Troll",
  Rodent: "Rodent",
};

class Race {
  name = null;

  constructor(attributes) {
    this.name = attributes.name;
  }
}
