class Goblin extends Character {
  healthRange = { min: 5, max: 13 };
  attackPowerRange = { min: 1, max: 2 };
  defenseRange = { min: 0, max: 1 };
  speedRange = { min: 8, max: 15 };
  goldRange = { min: 10, max: 20 };

  constructor() {
    //TODO: pass in attributes to super for the randomness of certain stats
    super();
  }

  static getRandomAttributes() {
    //TODO: return an object with randomized attributes
  }
}
