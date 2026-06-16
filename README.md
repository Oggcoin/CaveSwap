<div align="center">

# 🪨 CaveSwap 🔥

### The native DEX of Oggchain — *and it can see.* 👁️

**No middlemen. No outside chains. No permission needed. Just the tribe, the stone, and the fire.**

![Chain](https://img.shields.io/badge/chain-Oggchain-orange)
![ChainID](https://img.shields.io/badge/chainId-70088-blueviolet)
![Native Coin](https://img.shields.io/badge/coin-OGG-yellow)
![Build](https://img.shields.io/badge/build-LIVE-success)
![Open Source](https://img.shields.io/badge/source-open-brightgreen)
![No Build Step](https://img.shields.io/badge/build_step-none-lightgrey)

🌐 [caveswap.oggcoin.org](https://caveswap.oggcoin.org) &nbsp;·&nbsp; 🔎 [scan.oggcoin.org](https://scan.oggcoin.org)

**Prove you OGG.** 🦴

</div>

---

## 🪨 What is CaveSwap?

CaveSwap is a fully on-chain **decentralized exchange built natively for Oggchain** (ChainID `70088`, native coin **OGG**). It's a complete trading platform — swaps, liquidity, locks, burns, vesting — with a built-in **token terminal** (think DexScreener, but native to the cave).

Everything runs trustless and on-chain. The whole cave is out in the light: **read it, audit it, fork it, build on it.** No black boxes.

> 🔮 This is the **foundation, not the finish line.** The swap, the pools, the locks, the burns, the Watch terminal — it's the base layer the rest of the OGG ecosystem gets built on.

---

## 🔥 What You Can Do

| Feature | What it does |
|---|---|
| 🔄 **Swap freely** | Trade OGG and any token on Oggchain with **live price impact** — always see exactly what you get. |
| 🪙 **Wrap / Unwrap** | OGG ↔ wOGG, built in, **1:1**, no surprises. |
| 👛 **Bring your own wallet** | Connect with **MetaMask**, **Trust Wallet**, or **SafePal** — no new tools, no friction. |
| 📈 **Live price charts** | Every pool has its own chart, multiple timeframes (1m → 24h), real on-chain history, updating live. |
| 💧 **Add liquidity / be an LP** | Drop tokens into a pool and earn from every trade that flows through it. |
| ⏳ **Lock liquidity** | Time-lock your LP to prove you're not going anywhere. Claimable only after the unlock date. |
| 🔒 **Vesting** | Put tokens on a release schedule that unlocks over time, not all at once. No quiet dumps. |
| 🔥 **Burn liquidity** | Send LP to the fire forever. Permanent. Trustless. The strongest signal there is. |
| 🗺️ **Cave Pools explorer** | See every pool, how much LP is locked or burned in each, and add liquidity to any of them. |

> 🪨 **The golden rule of the cave:** you can only ever touch the LP *you* hold — never anyone else's. Your share is yours, the owner's is theirs.

---

## 👁️ The Watch Terminal

One click in the header opens the cave into a full token terminal — your DexScreener, native to Oggchain.

- 📜 **Live token list** — every OGG pair, ranked by liquidity, each showing price and LP locked/burned at a glance.
- 🔄 **Trade right there** — built-in Buy/Sell panel runs the same trustless swap engine. Spot it, act on it, no screen-jumping.
- 🧾 **Trade history in the open** — every Buy and Sell: how much, in OGG, which wallet, when. Nothing hidden in the dark.
- 👤 **My Trades** · 🐋 **Holders** · 🏆 **Top Traders**
- 📊 **Full project info** — price, market cap, liquidity, 24h volume, circulating / total / pooled supply, lock status, pool birth date, and socials — all in one card.
- 👍👎 **Community Score** — the tribe votes a project up or down.
- 🔎 **One-tap OGGSCAN** — jump to any token on the explorer to verify before you trade.
- 📱 **Mobile-ready** — the cave fits in your pocket.

---

## 🗂️ Project Structure

```
caveswap-ui/
├── index.html          # Self-contained front-end — opens standalone
│                       # (font + background + mascot + icons embedded)
└── assets/             # Full-res originals for production
    ├── bg-video.mp4    # Animated cave background (auto-used if present)
    ├── cave-bg.png     # Full-res still (fallback / swap-in)
    ├── RiverAdventurer.ttf
    ├── ogg-alone.png   # Mascot
    ├── x.png
    ├── telegram.png
    └── discord.png
```

🎨 Styled to the Figma mockup — **River Adventurer** font, cave background, Swap / Bridge / Tokens layout.
`index.html` references `assets/bg-video.mp4`: hosted with the `assets/` folder the video plays; with no video it falls back to the embedded still. Nothing else to wire for visuals.

---

## 🚀 Host It

Pure static — **no build step.** Drop the folder anywhere (nginx, Bluehost, IPFS, GitHub Pages):

```
caveswap-ui/index.html + caveswap-ui/assets/
```

That's it. The fire lights itself. 🔥

---

## ⚙️ Live Config

Already baked into `index.html` (the `CONFIG` block):

| Key | Value |
|---|---|
| `chainId` | `70088` |
| `rpc` | `https://rpc.oggcoin.org` |
| `factory` | `0xeDD3931022b29F1d2EB226E978A775eE05891866` |
| `router` | `0x63bF06B97B6764699715A1421F65F5DBdED54008` |
| `wogg` | `0x481c52Fc0394943d3A1190e5121F63a67C072ABb` |

---

## 🛠️ What's Wired vs. Stubbed

<details>
<summary><b>✅ WIRED (front-end) — click to expand</b></summary>

- Tabs (Swap / Bridge / Tokens)
- Token-select modal
- Paste-any-address (permissionless — any token, any time)
- Settings (slippage / deadline)
- Flip
- Search + empty state
- Footer
- Responsive layout
- Keyboard / Esc handling

</details>

<details>
<summary><b>🔌 STUBBED (chain hooks — TODO) — click to expand</b></summary>

Clearly marked `CHAIN HOOKS - TODO` in the script. These are the **only** blockchain integration points:

- `connectWallet()`
- `updateQuote()`
- `doSwap()`

**Next step:** ethers.js + `Router.getAmountsOut` / `swapExact*` calls.

</details>

---

## 🌉 The Bridge — OGG ↔ Solana Land

The bridge tab is intentionally **"coming soon."** The OGG ↔ Solana bridge is **already built** — but we don't rush the fire across the water.


> 🪨 We move careful. We move solid.

---

## 🤝 Contributing

The cave is open. Fork it, read it, build on it, open a PR. Bring your stone to the fire.

1. Fork the repo
2. Branch it (`git checkout -b feature/your-thing`)
3. Commit and push
4. Open a Pull Request

---

## 📜 License

Open source — see [`LICENSE`](LICENSE).

---

<div align="center">

**Based is built. The cave is open. The code is open. The eyes are watching. The tribe is growing.** 🪨👁️🔥

### Prove you OGG. 🦴

</div>
