<div align="center">

<img src="https://github.com/FuturEvoLab.png" width="96" alt="FuturEvoLab">

# FuturEvoLab

**Heal the Mind. Evolve the Future.**

現場の課題を、使える AI ツールに · Turning real-world problems into AI tools you can use · 把现场的问题，做成能用的 AI 工具

[![Website](https://img.shields.io/badge/futurevolab.com-0B0B0F?style=flat&logo=googlechrome&logoColor=white)](https://futurevolab.com)
[![Weavely](https://img.shields.io/badge/織音_Weavely-Coming_soon-5B8DEF?style=flat)](https://weavely.futurevolab.com)
![Location](https://img.shields.io/badge/Tokyo-555?style=flat)

[日本語](#日本語) · [English](#english) · [中文](#中文)

</div>

---

## 日本語

👋 **FuturEvoLab** は東京の個人スタジオです。
実務の中で出会った課題を題材に、**Agent Skill・業務向け AI ツール**と、**声・配信・音声制作のためのツール**を作っています。
「作って、使われ方を見て、直して、育てる」を続けています。

### 🧩 Agent Skills・AI ツール

| プロジェクト | 内容 | ポイント |
|---|---|---|
| **[outfit-twin](https://github.com/FuturEvoLab/outfit-twin)** | 参考画像から衣装を再構成し、正面・背面を1枚の16:9画像にまとめる Agent Skill | 見えている部分と推定で補う部分を区別／できないことを README に明記／日・英・中 |
| **[claude-code-commands-i18n](https://github.com/FuturEvoLab/claude-code-commands-i18n)** | Claude Code のスラッシュコマンドを、やさしい言葉で解説する非公式ガイド | 14カテゴリ・「やりたいこと」から探せる表・初心者向け導線・安全ラベル／7言語／データから自動生成 |
| **keigo-tone-check**（近日公開） | 日本のビジネスメール・チャットの敬語とトーンを、相手との関係を踏まえて送信前にチェックする Agent Skill | ルール検出＋LLM判断の2段階／指摘のみで書き換えない／過剰敬語も指摘／回帰テスト同梱 |

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

---

## English

👋 **FuturEvoLab** is an independent studio in Tokyo.
We build **Agent Skills and AI tools for everyday work**, and **tools for voice acting, live streaming and audio creators**, starting from real problems met on the job. Build, watch how it's used, fix, grow.

### 🧩 Agent Skills & AI tools

- **[outfit-twin](https://github.com/FuturEvoLab/outfit-twin)** — An Agent Skill that reconstructs an outfit from reference images into one 16:9 image with front and back views. Separates what is visible from what is inferred; limits stated in the README.
- **[claude-code-commands-i18n](https://github.com/FuturEvoLab/claude-code-commands-i18n)** — An unofficial plain-language guide to Claude Code slash commands: 14 categories, a "what do you want to do" table, a beginner path and safety labels, in 7 languages, generated from data.
- **keigo-tone-check** (coming soon) — An Agent Skill that checks keigo and tone in Japanese business email before sending, based on the relationship with the recipient. Rule checks plus model judgement; suggests instead of rewriting; flags over-politeness; ships with regression tests.

### 🎧 Voice & streaming tools

- **VoiceAutoPlayer** (Windows): multi-track live player with auto-ducking, scenes, global hotkeys, loop detection and mix recording.
- **FuturEvo Weavely** (web): the same live player plus a multi-track timeline that exports WAV. Files never leave your computer. 👉 [weavely.futurevolab.com](https://weavely.futurevolab.com) (coming soon)

### 🔬 Exploring

AI speech with original designed voices ([Qwen3-TTS](https://github.com/FuturEvoLab/Qwen3-TTS-fork) · [VoxCPM](https://github.com/FuturEvoLab/VoxCPM-fork) · [IndexTTS](https://github.com/FuturEvoLab/index-tts-fork) · [GPT-SoVITS](https://github.com/FuturEvoLab/GPT-SoVITS-fork)) · word-timed karaoke subtitles ([whisperX](https://github.com/FuturEvoLab/whisperX-fork)) · AI companions and virtual streamers ([AIRI](https://github.com/FuturEvoLab/airi-fork))

### 💡 Principles & disclosure

**AI suggests, people decide · Limits are written down · Local first · Every model's license respected.**
Problems taken from work are generalised before use; no customer data, internal documents, contract terms, original hiring assignments or anything under NDA is published; examples and test data are fictional; when in doubt, it stays private.

---

## 中文

👋 **FuturEvoLab** 是位于东京的个人工作室。
以实务中遇到的问题为题材，制作 **Agent Skill 与工作用 AI 工具**，以及**面向配音、直播和声音创作的工具**。坚持“做出来、看怎么被使用、改进、培养”。

### 🧩 Agent Skills・AI 工具

- **[outfit-twin](https://github.com/FuturEvoLab/outfit-twin)**：根据参考图重建服装，把正面和背面整合成一张 16:9 图片的 Agent Skill。区分可见部分与推测部分，并在 README 写明限制。
- **[claude-code-commands-i18n](https://github.com/FuturEvoLab/claude-code-commands-i18n)**：用白话解说 Claude Code 斜杠命令的非官方指南。14 个分类、按“想做的事”查找、新手入门路线、安全标签，7 种语言，由数据自动生成。
- **keigo-tone-check**（即将公开）：结合与对方的关系，在发送前检查日本商务邮件敬语和语气的 Agent Skill。规则检测＋模型判断两段式；只提建议不改写；也会指出过度敬语；附带回归测试。

### 🎧 配音・直播工具

- **配音自动播放器 VoiceAutoPlayer**（Windows）：多轨现场播放器，自动压低背景音乐、场景切换、全局快捷键、自动找循环点、混音录制。
- **织音 FuturEvo Weavely**（网页）：浏览器里的现场播放器和多轨时间线，可导出 WAV，文件不上传 👉 [weavely.futurevolab.com](https://weavely.futurevolab.com)（即将上线）

### 🔬 正在研究

原创角色声音的 AI 语音合成（[Qwen3-TTS](https://github.com/FuturEvoLab/Qwen3-TTS-fork) · [VoxCPM](https://github.com/FuturEvoLab/VoxCPM-fork) · [IndexTTS](https://github.com/FuturEvoLab/index-tts-fork) · [GPT-SoVITS](https://github.com/FuturEvoLab/GPT-SoVITS-fork)）· 逐字卡拉 OK 字幕（[whisperX](https://github.com/FuturEvoLab/whisperX-fork)）· AI 伴侣与虚拟主播（[AIRI](https://github.com/FuturEvoLab/airi-fork)）

### 💡 原则与公开方针

**AI 提建议，人来决定 · 写明做不到的事 · 本地优先 · 尊重每个模型的许可。**
来自工作的问题会先一般化再作为题材；不公开客户数据、内部资料、合同条件、招聘课题原文及任何保密协议范围内的内容；示例和测试数据均为虚构；拿不准的内容只在私有仓库中验证。

---

### 🛠 技術スタック · Tech Stack · 技术栈

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
