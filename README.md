<div align="center">

<img src="https://github.com/FuturEvoLab.png" width="96" alt="FuturEvoLab">

# FuturEvoLab

**Heal the Mind. Evolve the Future.**

Turning real-world problems into AI tools you can use · 現場の課題を、使える AI ツールに · 把现场的问题，做成能用的 AI 工具

[![Website](https://img.shields.io/badge/futurevolab.com-0B0B0F?style=flat&logo=googlechrome&logoColor=white)](https://futurevolab.com)
[![Weavely](https://img.shields.io/badge/織音_Weavely-Coming_soon-5B8DEF?style=flat)](https://weavely.futurevolab.com)
![Location](https://img.shields.io/badge/Tokyo-555?style=flat)

[English](#english) · [日本語](#日本語) · [中文](#中文)

</div>

---

## English

👋 **FuturEvoLab** is an independent studio in Tokyo.
Starting from real problems met on the job, we build **Agent Skills and AI tools for everyday work**, and **tools for voice acting, live streaming and audio creators**.
Our loop: build it, watch how it's used, fix it, grow it.

### 🧩 Agent Skills & AI tools

| Project | What it does | Highlights |
|---|---|---|
| **[outfit-twin](https://github.com/FuturEvoLab/outfit-twin)** | An Agent Skill that reconstructs an outfit from reference images into one 16:9 image with front and back views | Separates what is visible from what is inferred · limits stated in the README · EN/JA/ZH |
| **[claude-code-commands-i18n](https://github.com/FuturEvoLab/claude-code-commands-i18n)** | An unofficial plain-language guide to Claude Code slash commands | 14 categories · "what do you want to do" table · beginner path · safety labels · 7 languages · generated from data |
| **keigo-tone-check** (coming soon) | An Agent Skill that checks keigo and tone in Japanese business email and chat before sending, based on the relationship with the recipient | Rule checks + model judgement · suggests instead of rewriting · flags over-politeness · regression tests included |

### 📊 Local research dashboards

Repositories are private for now; the demos run in the browser from recorded sample data.

| Project | What it does | Highlights |
|---|---|---|
| **Quant Stock God** · [demo](https://futurevolab.github.io/quant-stock-god/?lang=en) | A local monitor for US/HK stocks, indices, rates and commodities: market overview, watchlist alerts, insider buying and 13F changes (SEC EDGAR), CFTC positioning, EIA inventories, rule-based news tagging with an after-the-fact check | Python standard library only · data and keys stay local · EN/JA/ZH · 35 offline tests in CI |
| **Block Detective** · [demo](https://futurevolab.github.io/block-detective/?lang=en) | A local multi-chain fund-flow investigator: flow graph, risk score propagated over hops, path tracing, whale alerts, smart-money wallet analysis, and a simulated copy-trading ledger for research | Zero dependencies · 10+ APIs with per-API rate limiting and caching · CSRF/XSS/CSP hardening · tests in CI |

> Research and learning tools. Outputs are generated from public data and rules and may be wrong or delayed. **Not investment advice**; the copy-trading feature is simulation only and never places real orders.

### 🎧 Voice & streaming tools

- **VoiceAutoPlayer** (Windows): a multi-track live player — voice lines, sound effects and music together, auto-ducking, scene switching, global hotkeys, reading character and tone from AI voice file names, loop-point detection and mix recording
- **FuturEvo Weavely** (web): the same live player in the browser plus a multi-track timeline that exports WAV. Files never leave your computer 👉 [weavely.futurevolab.com](https://weavely.futurevolab.com) (coming soon)

### 🔬 Exploring

- AI speech with original designed voices: [Qwen3-TTS](https://github.com/FuturEvoLab/Qwen3-TTS-fork) · [VoxCPM](https://github.com/FuturEvoLab/VoxCPM-fork) · [IndexTTS](https://github.com/FuturEvoLab/index-tts-fork) · [GPT-SoVITS](https://github.com/FuturEvoLab/GPT-SoVITS-fork)
- Karaoke subtitles timed word by word: [whisperX](https://github.com/FuturEvoLab/whisperX-fork)
- AI companions and virtual streamers: [AIRI](https://github.com/FuturEvoLab/airi-fork)

### 💡 Principles

- **AI suggests, people decide** — decisions that need judgement stay with people
- **Limits are written down** — every README says what the tool cannot do; no overstated claims
- **Local first** — voices, assets and personal data are processed on your own machine where possible
- **Licenses respected** — commercially usable models first, and every model's license honored

### 📜 Disclosure policy

Projects are built from problems met in work and job hunting. Before anything is published:

1. **Problems are generalised first** — nothing that identifies a specific company or engagement
2. **No confidential material** — no customer data, internal documents, contract terms, original hiring assignments, or anything under NDA
3. **Fictional examples only** — no real companies, people or deal details
4. **When in doubt, keep it private** — uncertain items stay in private repositories for testing
5. **External transmission is stated** — tools that may handle personal data say so in their README

🌐 [futurevolab.com](https://futurevolab.com)

---

<details>
<summary><h2>日本語</h2></summary>

👋 **FuturEvoLab** は東京の個人スタジオです。
実務の中で出会った課題を題材に、**Agent Skill・業務向け AI ツール**と、**声・配信・音声制作のためのツール**を作っています。
「作って、使われ方を見て、直して、育てる」を続けています。

### 🧩 Agent Skills・AI ツール

| プロジェクト | 内容 | ポイント |
|---|---|---|
| **[outfit-twin](https://github.com/FuturEvoLab/outfit-twin)** | 参考画像から衣装を再構成し、正面・背面を1枚の16:9画像にまとめる Agent Skill | 見えている部分と推定で補う部分を区別／できないことを README に明記／日・英・中 |
| **[claude-code-commands-i18n](https://github.com/FuturEvoLab/claude-code-commands-i18n)** | Claude Code のスラッシュコマンドを、やさしい言葉で解説する非公式ガイド | 14カテゴリ・「やりたいこと」から探せる表・初心者向け導線・安全ラベル／7言語／データから自動生成 |
| **keigo-tone-check**（近日公開） | 日本のビジネスメール・チャットの敬語とトーンを、相手との関係を踏まえて送信前にチェックする Agent Skill | ルール検出＋LLM判断の2段階／指摘のみで書き換えない／過剰敬語も指摘／回帰テスト同梱 |

### 📊 ローカル分析ダッシュボード

リポジトリは現在非公開です。デモは記録済みのサンプルデータでブラウザ上で動きます。

| プロジェクト | 内容 | ポイント |
|---|---|---|
| **量化股神 Quant Stock God** · [デモ](https://futurevolab.github.io/quant-stock-god/?lang=ja) | 米国・香港株、指数、金利、商品先物をまとめて見るローカルモニター。市場概況、ウォッチリストのアラート、インサイダー買い・13F の変化（SEC EDGAR）、CFTC ポジション、EIA 在庫、ルールベースのニュース分類と事後検証 | Python 標準ライブラリのみ・データとキーは手元に保存・日英中・オフラインテスト35件を CI で実行 |
| **区块侦探 Block Detective** · [デモ](https://futurevolab.github.io/block-detective/?lang=ja) | ローカルで動くマルチチェーンの資金フロー調査ツール。資金フローグラフ、ホップをまたいで伝播するリスクスコア、経路追跡、クジラ監視、スマートマネー分析、研究用のコピートレード・シミュレーター | 依存ライブラリなし・10以上の API を個別のレート制限とキャッシュで統合・CSRF/XSS/CSP 対策・CI でテスト |

> 学習・研究用のツールです。表示内容は公開データとルールから自動生成しており、誤りや遅延がありえます。**投資助言ではありません**。コピートレードはシミュレーションのみで、実際の注文は行いません。

### 🎧 音声・配信ツール

- **VoiceAutoPlayer**（Windows）：ライブ向けマルチトラックプレイヤー。セリフ・効果音・BGM の同時再生、BGM の自動ダッキング、シーン切替、グローバルショートカット、AI 音声ファイル名の読み取り、ループ点の自動検出、ミックス録音
- **織音 FuturEvo Weavely**（Web）：ブラウザで動くライブプレイヤーとマルチトラックのタイムライン。ファイルはアップロードされません 👉 [weavely.futurevolab.com](https://weavely.futurevolab.com)（近日公開）

### 🔬 研究中

- オリジナル音声による AI 音声合成：[Qwen3-TTS](https://github.com/FuturEvoLab/Qwen3-TTS-fork) · [VoxCPM](https://github.com/FuturEvoLab/VoxCPM-fork) · [IndexTTS](https://github.com/FuturEvoLab/index-tts-fork) · [GPT-SoVITS](https://github.com/FuturEvoLab/GPT-SoVITS-fork)
- 一文字ずつタイミングを合わせるカラオケ字幕：[whisperX](https://github.com/FuturEvoLab/whisperX-fork)
- AI コンパニオンとバーチャル配信者：[AIRI](https://github.com/FuturEvoLab/airi-fork)

### 💡 大切にしていること

- **AI は提案し、人が決める**：判断が必要なところは人に残す設計
- **限界を書く**：各 README に「できないこと」を明記し、性能を誇張しない
- **ローカル優先**：声や素材、個人情報はできるだけ手元の PC で処理する
- **ライセンスを尊重**：商用利用できるモデルを優先し、各モデルのライセンスを守る

### 📜 公開方針

実務や求職活動の中で出会った課題を題材にしています。公開にあたっては次のルールを守っています。

1. **課題は一般化してから題材にする**：特定の企業・案件が識別できない形に抽象化する
2. **機密情報は含めない**：顧客データ・社内資料・契約条件・選考課題の原文など、守秘義務や NDA の対象は含めない
3. **例文・テストデータは架空**：実在の企業名・人名・取引内容は使わない
4. **迷うものは公開しない**：判断に迷うものは非公開リポジトリでの検証にとどめる
5. **外部送信の有無を明記する**：個人情報を扱いうるツールは README に記載する

🌐 [futurevolab.com](https://futurevolab.com)

</details>

<details>
<summary><h2>中文</h2></summary>

👋 **FuturEvoLab** 是位于东京的个人工作室。
以实务中遇到的问题为题材，制作 **Agent Skill 与工作用 AI 工具**，以及**面向配音、直播和声音创作的工具**。
坚持“做出来、看怎么被使用、改进、培养”。

### 🧩 Agent Skills・AI 工具

| 项目 | 内容 | 亮点 |
|---|---|---|
| **[outfit-twin](https://github.com/FuturEvoLab/outfit-twin)** | 根据参考图重建服装，把正面与背面整合成一张 16:9 图片的 Agent Skill | 区分可见部分与推测部分 · README 写明限制 · 中日英 |
| **[claude-code-commands-i18n](https://github.com/FuturEvoLab/claude-code-commands-i18n)** | 用白话解说 Claude Code 斜杠命令的非官方指南 | 14 个分类 · 按“想做的事”查找的表格 · 新手入门路线 · 安全标签 · 7 种语言 · 由数据自动生成 |
| **keigo-tone-check**（即将公开） | 结合与对方的关系，在发送前检查日本商务邮件和聊天中敬语与语气的 Agent Skill | 规则检测＋模型判断两段式 · 只提建议不改写 · 也会指出过度敬语 · 附带回归测试 |

### 📊 本地分析看板

仓库目前为私有；演示版用录制的样本数据在浏览器中运行。

| 项目 | 内容 | 亮点 |
|---|---|---|
| **量化股神 Quant Stock God** · [演示](https://futurevolab.github.io/quant-stock-god/?lang=zh) | 在本地一屏查看美股、港股、指数、利率和大宗商品。市场概况、自选股提醒、内部人买入与 13F 变化（SEC EDGAR）、CFTC 持仓、EIA 库存、基于规则的新闻分类与事后检验 | 仅用 Python 标准库 · 数据和密钥留在本机 · 中日英 · 35 个离线测试在 CI 运行 |
| **区块侦探 Block Detective** · [演示](https://futurevolab.github.io/block-detective/?lang=zh) | 本地运行的多链资金流调查工具。资金流向图、跨多跳传播的风险评分、路径追踪、巨鲸监控、聪明钱钱包分析、研究用的跟单模拟器 | 零依赖 · 整合 10 多个 API 并分别限流与缓存 · CSRF/XSS/CSP 防护 · CI 自动测试 |

> 学习与研究用工具。结果由公开数据和规则自动生成，可能有误或延迟。**不构成投资建议**；跟单功能仅为模拟，不会真实下单。

### 🎧 配音・直播工具

- **配音自动播放器 VoiceAutoPlayer**（Windows）：面向直播的多轨播放器。台词、音效、BGM 同时播放，BGM 自动压低，场景切换，全局快捷键，从 AI 语音文件名读取角色与语气，自动检测循环点，混音录制
- **织音 FuturEvo Weavely**（网页）：在浏览器中运行的同一套现场播放器，加上可导出 WAV 的多轨时间线。文件不会离开你的电脑 👉 [weavely.futurevolab.com](https://weavely.futurevolab.com)（即将上线）

### 🔬 正在研究

- 原创角色声音的 AI 语音合成：[Qwen3-TTS](https://github.com/FuturEvoLab/Qwen3-TTS-fork) · [VoxCPM](https://github.com/FuturEvoLab/VoxCPM-fork) · [IndexTTS](https://github.com/FuturEvoLab/index-tts-fork) · [GPT-SoVITS](https://github.com/FuturEvoLab/GPT-SoVITS-fork)
- 逐字对齐时间轴的卡拉 OK 字幕：[whisperX](https://github.com/FuturEvoLab/whisperX-fork)
- AI 伴侣与虚拟主播：[AIRI](https://github.com/FuturEvoLab/airi-fork)

### 💡 原则

- **AI 提建议，人来决定**：需要判断的地方留给人
- **写明做不到的事**：每个 README 都写清工具的限制，不夸大性能
- **本地优先**：声音、素材和个人信息尽量在自己的电脑上处理
- **尊重许可**：优先选择可商用的模型，并遵守每个模型的许可条款

### 📜 公开方针

项目题材来自工作和求职中遇到的问题。公开前遵守以下规则：

1. **问题先一般化**：抽象到无法识别具体公司或项目
2. **不含保密内容**：不公开客户数据、内部资料、合同条件、招聘课题原文及任何保密协议范围内的内容
3. **示例和测试数据均为虚构**：不使用真实的公司、人名或交易细节
4. **拿不准的不公开**：有疑问的内容只在私有仓库中验证
5. **写明是否向外部发送数据**：可能处理个人信息的工具会在 README 中说明

🌐 [futurevolab.com](https://futurevolab.com)

</details>

---

### 🛠 Tech Stack · 技術スタック · 技术栈

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![C#](https://img.shields.io/badge/C%23-239120?logo=csharp&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?logo=dotnet&logoColor=white)
![WPF](https://img.shields.io/badge/WPF-0C54C2)
![NAudio](https://img.shields.io/badge/NAudio-555)
![Web Audio](https://img.shields.io/badge/Web%20Audio%20API-FF6F00)
![Astro](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=white)
![Claude Code](https://img.shields.io/badge/Claude%20Code-D97757?logo=anthropic&logoColor=white)
![Agent Skills](https://img.shields.io/badge/Agent%20Skills-SKILL.md-444)
