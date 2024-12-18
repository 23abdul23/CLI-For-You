import readline from "readline";
import keypress from "keypress";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

let timer;
let combatInProgress = true;
let inputLength = 0;

function startCombat(player, enemy) {
  if (!combatInProgress) return;

  console.log(`You are attacked by ${enemy.name}`);

  const targetString =
    enemy.stringList[Math.floor(Math.random() * enemy.stringList.length)];

  console.log(`\nType the following: "${chalk.cyan(targetString)}"`);

  console.log("");
  startTimer(enemy.timeLimit, player, enemy);

  keypress(process.stdin);
  process.stdin.on("keypress", () => {
    inputLength = rl.line.length;
  });

  rl.question("Your input: ", (input) => {
    clearInterval(timer);
    checkInput(input, targetString, player, enemy);
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

function displayHealth(player, enemy) {
  console.log(`\n${chalk.green("Player Health")}: ${player.hp}`);
  console.log(`\n${chalk.red("Enemy Health")}: ${enemy.hp}`);
}

function drawProgressBar(totalTime, timeLeft) {
  const barLength = 20;
  const filledLength = Math.floor((timeLeft / totalTime) * barLength);
  const emptyLength = barLength - filledLength;
  const bar = "█".repeat(filledLength) + "-".repeat(emptyLength);

  readline.moveCursor(process.stdout, 0, -1);
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`${chalk.yellow("Time left:")} [${bar}] ${timeLeft}s`);
  readline.clearLine(process.stdout, 1);
  process.stdout.write("\n");
  readline.cursorTo(process.stdout, 12 + inputLength); 
}

function checkInput(input, targetString, player, enemy) {
  if (input === targetString) {
    console.log(
      `${chalk.green("\nSuccess!")} You dealt ${chalk.red(
        `${player.attack}`
      )} damage to ${enemy.name}! ⚔️`
    );
    enemy.hp -= 20;
    enemy.hp = Math.max(enemy.hp, 0);
    if (enemy.hp <= 0) {
      console.log(
        `${chalk.green(
          `Congrats ${player.name}\nYou defeated the ${enemy.name}! 🎉`
        )}`
      );
      combatInProgress = false;
    }
  } else {
    console.log(
      `${chalk.red("\nMiss!")} ${enemy.name} strikes you for ${chalk.red(
        `${enemy.attack}`
      )} damage! 💥`
    );
    player.hp -= 15;
    player.hp = Math.max(player.hp, 0); // Use Math.max here
    if (player.hp <= 0) {
      console.log(
        `${chalk.red(`\nYou were defeated by the ${enemy.name}! 😞`)}`
      );
      combatInProgress = false;
    }
  }

  displayHealth(player, enemy);

  if (combatInProgress) {
    setTimeout(() => startCombat(player, enemy), 1000);
  } else {
    rl.close();
  }
}

function startTimer(totalTime, player, enemy) {
  let timeLeft = totalTime;

  drawProgressBar(totalTime, timeLeft);

  timer = setInterval(() => {
    timeLeft--;

    readline.cursorTo(process.stdout, 0);
    drawProgressBar(totalTime, timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timer);
      console.log(
        `${chalk.red(`\n\nTime's up ${player.name}!`)} ${
          enemy.name
        } strikes you for ${chalk.red(`${enemy.hp}`)} damage! 💥`
      );
      player.hp -= 15;
      player.hp = Math.max(player.hp, 0);
      displayHealth(player, enemy);
      if (player.hp <= 0) {
        console.log(
          `${chalk.red(`\nYou were defeated by the ${enemy.name}! 😞`)}`
        );
        combatInProgress = false;
      }
      if (combatInProgress) {
        setTimeout(() => startCombat(player, enemy), 1000);
      } else {
        rl.close();
      }
    }
  }, 1000);
}

let player = {
  name: "Vardaan",
  hp: 100,
  level: 1,
  attack: 15,
  inventory: [],
  itemInHand: "none",
};

let enemy = {
  name: "Goblin",
  hp: 100,
  timeLimit: 10,
  attack: 10,
  stringList: [
    "attack with fury",
    "defend your honor",
    "strike with precision",
    "take no prisoners",
  ],
};

startCombat(player, enemy);

export default startCombat;