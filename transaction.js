import chalk from 'chalk';
import { coin, coins } from '@cosmjs/proto-signing';
import {
  assertIsDeliverTxSuccess,
  GasPrice,
  SigningStargateClient,
} from '@cosmjs/stargate';

const RPC = 'https://symphony-api.kleomedes.network/';
const GAS_PRICE = GasPrice.fromString('0.003note');

// Function to create and connect the Stargate client
async function connectClient(sender) {
  return SigningStargateClient.connectWithSigner(RPC, sender, { gasPrice: GAS_PRICE });
}

// Function to log transaction details
function logTransaction(type, amount, from, to) {
  console.log(
    chalk.yellow(`Send 0.00000${amount} $MLD from ${from} to ${to} for ${type}`)
  );
}

// Function to handle successful transactions
function logSuccess(transaction) {
  assertIsDeliverTxSuccess(transaction);
  console.log(chalk.green('Successfully broadcasted!'));
  console.log(
    chalk.green(`Hash: https://testnet.ping.pub/symphony/tx/${transaction.transactionHash}`)
  );
  console.log('');
}

// Function to handle errors gracefully
function handleError(error) {
  console.error(chalk.red('Transaction failed!'), error);
}

// Function to perform a token transaction
export async function sendTransaction(sender, receiver) {
  try {
    const client = await connectClient(sender);
    const [firstAccount] = await sender.getAccounts();
    const amount = coins(Math.floor(Math.random() * 10) + 1, 'note');

    logTransaction('sending', amount[0].amount, firstAccount.address, receiver);

    const transaction = await client.sendTokens(
      firstAccount.address,
      receiver,
      amount,
      'auto'
    );

    logSuccess(transaction);
  } catch (error) {
    handleError(error);
  }
}

// Function to perform a staking transaction
export async function stakeTransaction(sender, validator) {
  try {
    const client = await connectClient(sender);
    const [firstAccount] = await sender.getAccounts();
    const amount = coin(Math.floor(Math.random() * 10) + 1, 'note');

    logTransaction('staking', amount.amount, firstAccount.address, validator);

    const transaction = await client.delegateTokens(
      firstAccount.address,
      validator,
      amount,
      'auto'
    );

    logSuccess(transaction);
  } catch (error) {
    handleError(error);
  }
}
