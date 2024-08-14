import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HEADERS } from './header.js';

/**
 * Fetches proxies from the specified URL.
 * @param {string} url - The URL to fetch the proxies from.
 * @returns {Array<string>} - Array of fetched proxies.
 */
const fetchProxies = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data.split('\n').filter((proxy) => proxy.trim() !== '');
  } catch (error) {
    console.error('❌ Error fetching proxies:', error.message);
    return [];
  }
};

/**
 * Retrieves from the faucet using the specified address and proxy.
 * @param {string} address - The address to use for faucet retrieval.
 * @param {string} proxy - The proxy to be used for the request.
 * @returns {Object} - Object containing the fetched data and the used proxy.
 * @throws {Error} - Throws an error if request fails.
 */
const getFaucet = async (address, proxy) => {
  try {
    const axiosInstance = axios.create({
      httpsAgent: new HttpsProxyAgent(proxy),
      headers: HEADERS,
      timeout: 5000,
    });
    const { data } = await axiosInstance({
      url: `https://faucet.ping.pub/symphony/send/${address}`,
      method: 'GET',
    });
    return { data, proxy };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(`❌ Timeout error with proxy ${proxy}`);
    } else {
      console.error(`❌ Error with proxy ${proxy}: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Shuffles the elements of the provided array.
 * @param {Array<any>} array - The array to be shuffled.
 * @returns {Array<any>} - The shuffled array.
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { fetchProxies, getFaucet, shuffleArray };
