import readlineSync from 'readline-sync';
import { displayHeader } from './src/lib/utils.js';
import chalk from 'chalk';

const displayMenu = () => {
  displayHeader();

  console.log(chalk.magenta('1. Auto claim faucet'));
  console.log(chalk.magenta('2. Auto transfer'));
  console.log(chalk.magenta('3. Auto stake'));
  console.log('');

  const choice = getInput('Please select an option (a, b, or c): ');

  handleChoice(choice);
  showSubscriptionLink();
};

const getInput = (message) => {
  return readlineSync.question(message);
};

const handleChoice = (choice) => {
  switch (choice) {
    case 'a':
      console.log(chalk.yellowBright('Please run: npm faucet'));
      break;
    case 'b':
      console.log(chalk.yellowBright('Please run: npm transfer'));
      break;
    case 'c':
      console.log(chalk.yellowBright('Please run: npm stake'));
      break;
    default:
      console.log(chalk.red('Invalid choice. Please select a valid option.'));
  }
};

const showSubscriptionLink = () => {
  console.log('');
  console.log(chalk.green('Subscribe: https://whatsapp.com/channel/0029ValGKarHLHQVpDZIr50X'));
};

displayMenu();
