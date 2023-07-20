class Character {
  attackCall = "";
  attackPower = 0;
  controlledBy = null;
  defense = 0;
  deathCall = "";
  health = 0;
  maxHealth = 0;
  isDead = false;
  name = "";
  party = null;
  speed = 0;
  type = null;
  indefiniteArticle = "a ";
  gold = 0;
  race = null;

  constructor(attributes) {
    this.type = attributes.type;
    this.name = attributes.name;
    this.party = attributes.party;
    this.health = attributes.health;
    this.maxHealth = attributes.maxHealth;
    this.attackPower = attributes.attackPower;
    this.defense = attributes.defense;
    this.attackCall = attributes.attackCall;
    this.deathCall = attributes.deathCall;
    this.speed = attributes.speed;
    this.isDead = attributes.isDead;
    this.controlledBy = attributes.controlledBy;
    this.initiative = attributes.initiative;
    this.gold = attributes.gold;
    this.race = new Race(attributes.race);

    if (attributes.indefiniteArticle) {
      this.indefiniteArticle = attributes.indefiniteArticle;
    }
  }

  dodge() {
    console.log(this.name + " dodges");
  }
}
