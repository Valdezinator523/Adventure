class BattleManager {
  badGuys = [];
  game = null;
  goodGuys = [];
  isDone = false;
  queue = [];
  ui = {
    actions: {
      attack: {},
    },
    element: document.getElementById("battleUI"),
  };

  constructor(game, heroes, enemies) {
    this.game = game;
    this.goodGuys = [...heroes];
    this.badGuys = [...enemies];
  }

  attack(attacker, target, message) {
    const rawDamage = Math.round(attacker.attackPower - attacker.attackPower * 0.25 * Math.random()) - target.defense;
    const damage = Math.max(rawDamage, 1);
    const targetNewHealth = target.health - damage;
    const targetIsDead = targetNewHealth <= 0;
    const messageStart = message ?? attacker.name + " attacks " + target.name;
    const textColor = target.party === "Good" ? "#cc1414" : "rgb(30, 144, 255, 0.87)";

    this.game.log(messageStart + " for " + damage + " damage ", textColor);

    if (targetIsDead) {
      let isDeathBlow = false;
      if (Math.random() <= 0.01) {
        isDeathBlow = true;
        const deathBlowMessage = this.getDeathBlowAttackMessage(target, attacker);
        this.attack(target, attacker, deathBlowMessage);
      }
      // TODO Consider implementing a "instant death" message of sorts that displays when something dies in one hit
      // TODO Add a critical hit system that displays that the character had a moment of sheer display of skill
      target.health = 0;
      if (!isDeathBlow) {
        this.game.log(target.name + " cries " + target.deathCall);
      }
      this.game.log(target.name + " is dead");
    } else {
      target.health = targetNewHealth;
    }
  }

  // Each AI character attacks
  continue() {
    const areAllGoodGuysDead = this.goodGuys.every((goodGuy) => {
      return goodGuy.isDead;
    });
    const areAllBadGuysDead = this.badGuys.every((badGuy) => {
      return badGuy.isDead;
    });

    // continue battle
    if (!this.isDone && !areAllGoodGuysDead) {
      this.executeRound();
    }
    // end battle due to player death
    if (this.isDone && areAllGoodGuysDead) {
      hide(this.game.ui.gameUi);
      show(this.game.ui.gameOverUi);
      setTimeout(() => {
        this.game.ui.gameOverUi.classList.add("game-over--animate");
      }, 500);
    }
    // end battle due to player victory
    if (this.isDone && areAllBadGuysDead) {
      this.victory();
      hide(this.ui.actions.attack.element);
      hide(this.ui.actions.run.element);
    }
  }

  async executeRound() {
    // iterate over the queue
    for (let i = 0; i < this.queue.length; i++) {
      const character = this.queue[i];
      const areAllGoodGuysDead = this.goodGuys.every((goodGuy) => {
        return goodGuy.isDead;
      });

      // Exit loop because party ran
      if (this.isDone) {
        break;
      }

      if (character.isDead || areAllGoodGuysDead) {
        continue;
      }

      // if the character is ai then it will attack a good guy
      if (character.controlledBy === "ai") {
        const attacker = character;
        const target = this.getTarget(attacker.party);
        this.attack(attacker, target);
        this.update();
      }
      // if the character is player controlled we have to wait for the user to perform an action
      else {
        this.initializeActions();
        await new Promise((resolve) => {
          const onFight = () => {
            const attacker = character;
            const target = this.getTarget(attacker.party);
            this.attack(attacker, target);
            this.update();
            resolve();
          };

          const onRun = () => {
            this.isDone = true;
            this.game.log("The Party Ran");
            resolve();
          };

          // listen for click on fight button to continue
          this.ui.actions.attack.element.addEventListener("click", onFight);

          // listen for click on run button to continue
          this.ui.actions.run.element.addEventListener("click", onRun);
        });

        this.destroyActions();
      }
    }

    this.continue();
  }

  getDeathBlowAttackMessage(attacker, target) {
    const chance = Math.random();

    if (chance >= 0.66) {
      return "During " + attacker.name + "'s final breath he quickly stabs " + target.name;
    } else if (chance >= 0.33) {
      return "As " + attacker.name + " was falling to the ground he makes a swift jab at " + target.name;
    } else {
      return "Before " + attacker.name + " succumbs to darkness, he lashes out once more";
    }
  }

  // finds the first character in the queue who is not in the same party
  getTarget(party) {
    const target = this.queue.find((character) => {
      return character.party !== party && !character.isDead;
    });
    // TODO: Have a system where certain races ex. orcs might fight goblins of enemies might fight eachother occasionally
    return target;
  }

  destroyActions() {
    this.ui.actions.attack.element.remove();
    this.ui.actions.run.element.remove();
    this.ui.actions.attack = null;
    this.ui.actions.run = null;
  }

  initializeActions() {
    const attackAction = new Button("Attack");
    this.ui.actions.attack = attackAction;
    this.ui.element.appendChild(attackAction.element);

    const runAction = new Button("Run");
    this.ui.actions.run = runAction;
    this.ui.element.appendChild(runAction.element);
  }

  initializeQueue() {
    this.queue = [...this.goodGuys, ...this.badGuys];
    this.queue.sort((current, next) => {
      return current.initiative - next.initiative || -current.speed - -next.speed;
    });
  }

  start() {
    this.initializeQueue();
    show(this.ui.element);
    this.updateText(this.game.party.gold, document.getElementById("battleRiches"));

    if (this.badGuys.length === 1) {
      this.game.log("The Party encountered " + this.badGuys[0].indefiniteArticle + this.badGuys[0].type);
    } else {
      const allButLastEnemy = [...this.badGuys];
      allButLastEnemy.splice(this.badGuys.length - 1, 1);
      const lastEnemy = this.badGuys[this.badGuys.length - 1];
      this.game.log(
        "The Party encountered " +
          allButLastEnemy
            .map((enemy) => {
              return enemy.indefiniteArticle + enemy.type;
            })
            .join(", ") +
          " and " +
          lastEnemy.indefiniteArticle +
          lastEnemy.type
      );
    }

    this.executeRound();
  }

  // Updates battle state
  update() {
    this.queue.forEach((character) => {
      if (character.party === "Good") {
        this.updateText(character.name, document.getElementById("battleHeroName"));
        this.updateText(character.health, document.getElementById("battleHeroHp"));
        this.updateText(character.maxHealth, document.getElementById("battleHeroMaxHp"));
        this.updateText(character.race.name, document.getElementById("battleHeroRace"));
      }

      let partyIsDead = false;

      if (character.health === 0) {
        character.isDead = true;

        // Handle bad guy death
        if (character.party === "Bad") {
          partyIsDead = this.badGuys.every((badGuy) => {
            return badGuy.health === 0;
          });
        }
        // Handle good guy death
        else {
          partyIsDead = this.goodGuys.every((goodGuy) => {
            return goodGuy.health === 0;
          });
        }
      }

      if (partyIsDead) {
        this.isDone = true;
      }
    });
  }

  updateText(text, element) {
    element.innerHTML = text;
  }

  victory() {
    const gold = this.badGuys.reduce((goldValue, badGuy) => {
      return goldValue + badGuy.gold;
    }, 0);
    this.game.party.gold = this.game.party.gold + gold;
    this.updateText(this.game.party.gold, document.getElementById("battleRiches"));
    this.game.log("Enemies Defeated");
    this.game.log("The party found " + this.game.localization.formatNumber(gold) + " gold");
  }
}
