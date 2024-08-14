import chalk from 'chalk';
import bip39 from 'bip39';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

const WALLET_PREFIX = 'symphony';

// Function to generate a new wallet
export async function generateWallet() {
  try {
    // Generate a random mnemonic
    const mnemonic = bip39.generateMnemonic();

    // Create a wallet from the mnemonic
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: WALLET_PREFIX,
    });

    // Get the first account's address from the wallet
    const accounts = await wallet.getAccounts();
    const firstAccount = accounts[0];

    return firstAccount.address;
  } catch (error) {
    // Handle errors and provide clear error messages
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(chalk.red(`Error in generating wallet: ${errorMessage}`));
    return null; // Return null to indicate failure
  }
}
