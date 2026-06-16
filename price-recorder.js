#!/usr/bin/env node
/*
 * CaveSwap price-history recorder
 * --------------------------------
 * Polls every OGG-paired pool's reserves on a timer and appends
 *   { t: <unix seconds>, p: <OGG per 1 token> }
 * to  <WEB_ROOT>/data/history-<pairAddress>.json
 *
 * The CaveSwap frontend fetches data/history-<pair>.json and (because it is
 * served from the same nginx root) gets real persistent price history with no
 * extra API. If the file is missing it falls back to on-chain Sync events.
 *
 * Run on Node4 (the box that serves caveswap.oggcoin.org):
 *   cd /root/caveswap
 *   npm init -y && npm install ethers@5
 *   mkdir -p /root/caveswap/data
 *   pm2 start price-recorder.js --name ogg-price-recorder
 *   pm2 save
 *
 * Env overrides (optional):
 *   OGG_RPC          default https://rpc.oggcoin.org
 *   CAVESWAP_ROOT    default /root/caveswap  (must be the nginx web root)
 *   POLL_SECONDS     default 30
 */
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const RPC        = process.env.OGG_RPC || 'https://rpc.oggcoin.org';
const FACTORY    = '0xeDD3931022b29F1d2EB226E978A775eE05891866';
const WOGG       = '0x481c52Fc0394943d3A1190e5121F63a67C072ABb';
const WEB_ROOT   = process.env.CAVESWAP_ROOT || '/root/caveswap';
const DATA_DIR   = path.join(WEB_ROOT, 'data');
const INTERVAL   = (parseInt(process.env.POLL_SECONDS, 10) || 30) * 1000;
const MAX_POINTS = 40000;            // hard cap per file
const MAX_AGE    = 30 * 86400;       // keep 30 days of history

const FACTORY_ABI = [
  'function allPairsLength() view returns (uint256)',
  'function allPairs(uint256) view returns (address)',
];
const PAIR_ABI = [
  'function getReserves() view returns (uint112,uint112,uint32)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
];
const ERC20_ABI = ['function decimals() view returns (uint8)'];

const provider = new ethers.providers.JsonRpcProvider(RPC);
const decCache = {};

async function decimalsOf(addr) {
  const k = addr.toLowerCase();
  if (decCache[k] !== undefined) return decCache[k];
  try { decCache[k] = await new ethers.Contract(addr, ERC20_ABI, provider).decimals(); }
  catch (e) { decCache[k] = 18; }
  return decCache[k];
}

const fileFor = (pair) => path.join(DATA_DIR, 'history-' + pair.toLowerCase() + '.json');

function loadHist(pair) {
  try { return JSON.parse(fs.readFileSync(fileFor(pair), 'utf8')); }
  catch (e) { return []; }
}
function saveHist(pair, arr) {
  const now = Math.floor(Date.now() / 1000);
  let a = arr.filter((d) => d && typeof d.t === 'number' && d.t >= now - MAX_AGE);
  if (a.length > MAX_POINTS) a = a.slice(a.length - MAX_POINTS);
  const tmp = fileFor(pair) + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(a));
  fs.renameSync(tmp, fileFor(pair)); // atomic swap so the frontend never reads a half-written file
}

async function tick() {
  try {
    const factory = new ethers.Contract(FACTORY, FACTORY_ABI, provider);
    const n = (await factory.allPairsLength()).toNumber();
    const t = Math.floor(Date.now() / 1000);
    let recorded = 0;
    for (let i = 0; i < n; i++) {
      try {
        const pair = await factory.allPairs(i);
        const c = new ethers.Contract(pair, PAIR_ABI, provider);
        const t0 = await c.token0();
        const t1 = await c.token1();
        const oggIs0 = t0.toLowerCase() === WOGG.toLowerCase();
        const oggIs1 = t1.toLowerCase() === WOGG.toLowerCase();
        if (!oggIs0 && !oggIs1) continue;                 // only OGG-paired pools
        const [r0, r1] = await c.getReserves();
        const tokenAddr = oggIs0 ? t1 : t0;
        const dec = await decimalsOf(tokenAddr);
        const rOGG = parseFloat(ethers.utils.formatUnits(oggIs0 ? r0 : r1, 18));
        const rTok = parseFloat(ethers.utils.formatUnits(oggIs0 ? r1 : r0, dec));
        if (!(rOGG > 0) || !(rTok > 0)) continue;
        const p = rOGG / rTok;                            // OGG per 1 token
        const hist = loadHist(pair);
        const last = hist[hist.length - 1];
        // skip near-duplicate points (no swap happened) but keep at least 1/5min
        if (last && Math.abs(last.p - p) / p < 1e-9 && t - last.t < 300) continue;
        hist.push({ t, p });
        saveHist(pair, hist);
        recorded++;
      } catch (e) { /* skip this pair */ }
    }
    console.log(new Date().toISOString(), `scanned ${n} pairs, recorded ${recorded}`);
  } catch (e) {
    console.error(new Date().toISOString(), 'tick error:', e.message);
  }
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
console.log('CaveSwap price recorder starting | RPC', RPC, '| data', DATA_DIR, '| every', INTERVAL / 1000 + 's');
tick();
setInterval(tick, INTERVAL);
