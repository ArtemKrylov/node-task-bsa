import React from "react";

import { getFighters } from "../../services/domainRequest/fightersRequest";
import NewFighter from "../newFighter";
import Fighter from "../fighter";
import { Button } from "@material-ui/core";

import "./fight.css";
import createElement from "../../helpers/domHelper";
import controls from "../../constants/controls";

class Fight extends React.Component {
  state = {
    fighters: [],
    fighter1: null,
    fighter2: null,
  };

  async componentDidMount() {
    const fighters = await getFighters();
    if (fighters && !fighters.error) {
      this.setState({ fighters });
    }
  }

  onFightStart = async (firstFighter, secondFighter) => {
    const reqBody = { fighter1: firstFighter.id, fighter2: secondFighter.id };
    const currentFight = await fetch("/api/fights", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const root = document.getElementById("root");
    const arena = this.createArena([firstFighter, secondFighter]);

    root.innerHTML = "";
    root.append(arena);

    //todo
    const winner = await new Promise((resolve) => {
      // resolve the promise with the winner when fight is over
      let firstFighterHealth = firstFighter.health;
      let secondFighterHealth = secondFighter.health;

      const playerOneCritSequence = [];
      const playerTwoCritSequence = [];
      const endTime = { firstFighter: null, secondFighter: null };
      const block = {
        isPlayerOneInBlock: false,
        isPlayerTwoInBlock: false,
      };

      // eslint-disable-next-line prefer-arrow-callback
      document.addEventListener("keyup", function onBlockListener(event) {
        switch (event.code) {
          case controls.PlayerOneBlock:
            block.isPlayerOneInBlock = false;
            break;
          case controls.PlayerTwoBlock:
            block.isPlayerTwoInBlock = false;
            break;
          default:
            break;
        }
      });

      document.addEventListener("keydown", function onFightKeyDown(event) {
        const result = Fight.countKeyDownResult(
          event,
          firstFighter,
          secondFighter,
          playerOneCritSequence,
          playerTwoCritSequence,
          endTime,
          block
        );
        if (!result) return;

        if (result.has(firstFighter)) {
          const damage = result.get(firstFighter);
          if (!damage) return;
          const prevHealth = firstFighterHealth;

          if (firstFighterHealth - damage <= 0) {
            firstFighterHealth -= damage;
            document.removeEventListener("keydown", onFightKeyDown);
          } else {
            firstFighterHealth -= damage;
            Fight.reduceHealthBar(
              prevHealth,
              firstFighterHealth,
              firstFighter,
              "left"
            );
          }
        } else {
          const damage = result.get(secondFighter);
          if (!damage) return;
          const prevHealth = secondFighterHealth;
          if (secondFighterHealth - damage <= 0) {
            secondFighterHealth -= damage;
            document.removeEventListener("keydown", onFightKeyDown);
          } else {
            secondFighterHealth -= damage;
            Fight.reduceHealthBar(
              prevHealth,
              secondFighterHealth,
              firstFighter,
              "right"
            );
          }
        }
        if (secondFighterHealth <= 0 || firstFighterHealth <= 0) {
          resolve(firstFighterHealth <= 0 ? secondFighter : firstFighter);
        }
      });
    });
    console.log(winner);
    const winnerEl = createElement({
      tagName: "div",
      className: "winner",
    });
    winnerEl.innerHTML = `Winner: ${winner.name}`;
    const arenaRoot = document.querySelector(".arena___root");
    arenaRoot.appendChild(winnerEl);
    const response = await currentFight.json();
    await fetch(`/api/fights/${response.id}`, {
      method: "POST",
      body: JSON.stringify(winner),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  onCreate = (fighter) => {
    this.setState({ fighters: [...this.state.fighters, fighter] });
  };

  onFighter1Select = (fighter1) => {
    this.setState({ fighter1 });
  };

  onFighter2Select = (fighter2) => {
    this.setState({ fighter2 });
  };

  getFighter1List = () => {
    const { fighter2, fighters } = this.state;
    if (!fighter2) {
      return fighters;
    }

    return fighters.filter((it) => it.id !== fighter2.id);
  };

  getFighter2List = () => {
    const { fighter1, fighters } = this.state;
    if (!fighter1) {
      return fighters;
    }

    return fighters.filter((it) => it.id !== fighter1.id);
  };

  createHealthIndicator(fighter, position) {
    const { name } = fighter;
    const container = createElement({
      tagName: "div",
      className: "arena___fighter-indicator",
    });
    const fighterName = createElement({
      tagName: "span",
      className: "arena___fighter-name",
    });
    const indicator = createElement({
      tagName: "div",
      className: "arena___health-indicator",
    });
    const bar = createElement({
      tagName: "div",
      className: "arena___health-bar",
      attributes: { id: `${position}-fighter-indicator` },
    });

    fighterName.innerText = name;
    indicator.append(bar);
    container.append(fighterName, indicator);

    return container;
  }

  createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({
      tagName: "div",
      className: "arena___fight-status",
    });
    const versusSign = createElement({
      tagName: "div",
      className: "arena___versus-sign",
    });
    const leftFighterIndicator = this.createHealthIndicator(
      leftFighter,
      "left"
    );
    const rightFighterIndicator = this.createHealthIndicator(
      rightFighter,
      "right"
    );

    healthIndicators.append(
      leftFighterIndicator,
      versusSign,
      rightFighterIndicator
    );
    return healthIndicators;
  }

  createArena(selectedFighters) {
    const arena = createElement({ tagName: "div", className: "arena___root" });
    const battleField = createElement({
      tagName: "div",
      className: `arena___battlefield`,
    });

    const healthIndicators = this.createHealthIndicators(...selectedFighters);

    arena.append(healthIndicators, battleField);
    return arena;
  }

  static getHitPower(fighter) {
    // return hit power
    return Number(fighter.power) * (Math.random() + 1);
  }

  static getBlockPower(fighter) {
    // return block power
    return Number(fighter.defense) * (Math.random() + 1);
  }

  static getDamage(attacker, defender) {
    // return damage
    const damage = Fight.getHitPower(attacker) - Fight.getBlockPower(defender);
    return damage > 0 ? damage : 0;
  }

  static getCritDamage(attacker, defender, isBlocking) {
    // return crit damage
    const damage = isBlocking
      ? 2 * Fight.getHitPower(attacker) - Fight.getBlockPower(defender)
      : 2 * Fight.getHitPower(attacker);
    return damage > 0 ? damage : 0;
  }

  static setTimer(duration) {
    // setting timer
    const timerId = setTimeout(() => {}, duration);
    return { endTime: Date.now() + duration, timerId };
  }

  static countKeyDownResult(
    event,
    firstFighter,
    secondFighter,
    playerOneCritSequence,
    playerTwoCritSequence,
    endTime,
    block
  ) {
    // processing event.code
    const {
      PlayerOneAttack,
      PlayerOneBlock,
      PlayerTwoAttack,
      PlayerTwoBlock,
      PlayerOneCriticalHitCombination,
      PlayerTwoCriticalHitCombination,
    } = controls;
    switch (event.code) {
      // first fighter`s crit
      case PlayerOneCriticalHitCombination[0]:
      case PlayerOneCriticalHitCombination[1]:
      case PlayerOneCriticalHitCombination[2]:
        playerOneCritSequence.push(event.code);
        if (
          playerOneCritSequence.length === 3 &&
          playerOneCritSequence.includes("KeyQ") &&
          playerOneCritSequence.includes("KeyW") &&
          playerOneCritSequence.includes("KeyE")
        ) {
          // eslint-disable-next-line no-param-reassign
          playerOneCritSequence.length = 0;

          if (Date.now() < endTime.firstFighter) {
            // eslint-disable-next-line no-param-reassign
            playerOneCritSequence.length = 0;
            return null;
          }
          const { endTime: nextEndTime } = Fight.setTimer(10000);
          // eslint-disable-next-line no-param-reassign
          endTime.firstFighter = nextEndTime;
          return new Map([
            [
              secondFighter,
              Fight.getCritDamage(
                firstFighter,
                secondFighter,
                block.isPlayerTwoInBlock
              ),
            ],
          ]);
        }
        if (playerOneCritSequence.length >= 3) {
          // eslint-disable-next-line no-param-reassign
          playerOneCritSequence.length = 0;
        }
        return null;
      // second fighter`s crit
      case PlayerTwoCriticalHitCombination[0]:
      case PlayerTwoCriticalHitCombination[1]:
      case PlayerTwoCriticalHitCombination[2]:
        playerTwoCritSequence.push(event.code);
        if (
          playerTwoCritSequence.length === 3 &&
          playerTwoCritSequence.includes("KeyU") &&
          playerTwoCritSequence.includes("KeyI") &&
          playerTwoCritSequence.includes("KeyO")
        ) {
          // eslint-disable-next-line no-param-reassign
          playerTwoCritSequence.length = 0;

          if (Date.now() < endTime.secondFighter) {
            // eslint-disable-next-line no-param-reassign
            playerTwoCritSequence.length = 0;
            return null;
          }
          const { endTime: nextEndTime } = Fight.setTimer(10000);
          // eslint-disable-next-line no-param-reassign
          endTime.secondFighter = nextEndTime;
          return new Map([
            [
              firstFighter,
              Fight.getCritDamage(
                secondFighter,
                firstFighter,
                block.isPlayerOneInBlock
              ),
            ],
          ]);
        }
        if (playerTwoCritSequence.length >= 3) {
          // eslint-disable-next-line no-param-reassign
          playerTwoCritSequence.length = 0;
        }
        return null;
      case PlayerOneBlock:
        // eslint-disable-next-line no-param-reassign
        block.isPlayerOneInBlock = true;
        return new Map([[firstFighter, 0]]);
      case PlayerTwoBlock:
        // eslint-disable-next-line no-param-reassign
        block.isPlayerTwoInBlock = true;
        return new Map([[secondFighter, 0]]);
      case PlayerOneAttack:
        if (block.isPlayerOneInBlock || block.isPlayerTwoInBlock) return null;
        return new Map([
          [secondFighter, Fight.getDamage(firstFighter, secondFighter)],
        ]);
      case PlayerTwoAttack:
        if (block.isPlayerOneInBlock || block.isPlayerTwoInBlock) return null;
        return new Map([
          [firstFighter, Fight.getDamage(secondFighter, firstFighter)],
        ]);

      default:
        return null;
    }
  }

  static reduceHealthBar(prevHealth, currentHealth, toFighter, side) {
    // reducing fighter`s health bar on damage
    const healthBarEl =
      side === "left"
        ? document.querySelector(".arena___health-bar#left-fighter-indicator")
        : document.querySelector(".arena___health-bar#right-fighter-indicator");
    const onePercentageHealthBarElLength =
      healthBarEl.offsetWidth / (prevHealth / toFighter.health);
    healthBarEl.style.width = `${
      onePercentageHealthBarElLength * (currentHealth / toFighter.health)
    }px`;
  }

  render() {
    const { fighter1, fighter2 } = this.state;
    return (
      <div id="wrapper">
        <NewFighter onCreated={this.onCreate} />
        <div id="figh-wrapper">
          <Fighter
            selectedFighter={fighter1}
            onFighterSelect={this.onFighter1Select}
            fightersList={this.getFighter1List() || []}
          />
          <div className="btn-wrapper">
            <Button
              onClick={() => this.onFightStart(fighter1, fighter2)}
              variant="contained"
              color="primary"
            >
              Start Fight
            </Button>
          </div>
          <Fighter
            selectedFighter={fighter2}
            onFighterSelect={this.onFighter2Select}
            fightersList={this.getFighter2List() || []}
          />
        </div>
      </div>
    );
  }
}

export default Fight;
