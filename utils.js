import axios from 'axios';
import chalk from 'chalk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import readlineSync from 'readline-sync';
import cron from 'node-cron';
import fs from 'fs';

// Fetch proxies from a given URL
export const fetchProxies = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data.split('\n').filter((proxy) => proxy.trim() !== '');
  } catch (error) {
    console.error(chalk.red('❌ Error fetching proxies:'), error.message);
    return [];
  }
};

// Shuffle an array in place
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Display the header
export function displayHeader() {
  process.stdout.write('\x1Bc');
  console.log(chalk.green('================================================================'));
  console.log(chalk.green('=                   Symphony Testnet Bot                       ='));
  console.log(chalk.green('=               Created by AnonymousAirdrop                    ='));
  console.log(chalk.green('=    https://whatsapp.com/channel/0029ValGKarHLHQVpDZIr50X     ='));
  console.log(chalk.green('================================================================'));
  console.log();
}

// Get tokens from the faucet using a proxy
export const getFaucet = async (address, proxy) => {
  try {
    const axiosInstance = axios.create({
      httpsAgent: new HttpsProxyAgent(proxy),
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const { data } = await axiosInstance({
      url: `https://faucet.ping.pub/symphony/send/${address}`,
      method: 'GET',
    });
    return { data, proxy };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(chalk.red(`❌ Timeout error with proxy ${proxy}`));
    } else {
      console.error(chalk.red(`❌ Error with proxy ${proxy}:`), error.message);
    }
    throw error;
  }
};

// Prompt user to choose when to run the script
export const getUserChoice = () => {
  return readlineSync.keyInSelect(
    ['Run once', 'Run every 24 hours'],
    'Do you want to run the script?'
  );
};

// Asynchronous sleep function
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Set up a cron job to execute transactions
export function setupCronJob(executeTransactions) {
  cron.schedule('0 0 * * *', async () => {
    const { txCount } = JSON.parse(fs.readFileSync('txCount.json', 'utf-8'));
    await executeTransactions(txCount);
  });
}

// Set up a cron job to execute stake-related transactions
export function setupStakeCronJob(executeTransactions) {
  cron.schedule('0 0 * * *', async () => {
    const { txCount } = JSON.parse(
      fs.readFileSync('txStakeCount.json', 'utf-8')
    );
    const { valoper } = JSON.parse(
      fs.readFileSync('valoperAddress.json', 'utf-8')
    );
    await executeTransactions(txCount, valoper);
  });
}
