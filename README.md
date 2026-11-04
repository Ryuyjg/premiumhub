# ⚡ PremiumHub (StreamVault) — Digital Subscription SaaS

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</div>

<p align="center">
  A production-grade, full-stack digital subscription SaaS ecosystem engineered with Next.js 15 App Router, Firebase Server SDK, AES encrypted credential vaults, and an administrative ERP dashboard.
</p>

---

## 🏗️ Architectural Overview

`
   ┌───────────────────────────────────────────────────────────────┐
   │                       CLIENT LAYER                            │
   │  Next.js 15 App Router • Framer Motion • Tailwind CSS Glass   │
   └───────────────────────────────┬───────────────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
   ┌───────────────────────┐               ┌───────────────────────┐
   │    CUSTOMER PORTAL    │               │    ADMIN WORKSPACE    │
   │ Catalog • Dynamic Plan│               │ Analytics • Products  │
   │ Selection • Checkout  │               │ Fulfillment • Vault   │
   └───────────┬───────────┘               └───────────┬───────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                       BACKEND & SECURITY                      │
   │ Firebase Admin SDK • AES Credential Encryption • Server Auth  │
   └───────────────────────────────┬───────────────────────────────┘
                                   ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                      PERSISTENCE ENGINE                       │
   │ Firestore Database • Firebase Storage • Security Rule Guards  │
   └───────────────────────────────────────────────────────────────┘
`

---

## ✨ Features

- **🛡️ AES Encrypted Credential Vault**: Secure storage and decryption of digital subscription credentials (master email, password, profile pins) with zero client-side credential exposure.
- **⚡ Next.js 15 App Router**: Server-side rendering (SSR), streaming suspense, and cookie-based server session verification.
- **📊 Real-time Admin ERP Workspace**:
  - Live order tracking and manual or automated fulfillment pipelines.
  - Granular inventory tracking and catalog adjustments.
  - Analytics dashboards for revenue metrics, active subscriptions, and churn rates.
- **🔐 Role-Based Access Control (RBAC)**: Secure Firestore rules separating general user capabilities from elevated administrator rights.
- **🏷️ Dynamic Coupon & Promo Rules**: Tiered promotional logic with automated expiry calculation and percentage discounts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Auth, Cloud Firestore, Cloud Storage, Admin SDK)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Validation**: [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- Firebase project configuration

### 2. Installation

`ash
# Clone the repository
git clone https://github.com/Ryuyjg/premiumhub.git
cd premiumhub

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
`

### 3. Development Server

`ash
npm run dev
`
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 👨‍💻 Author

- **Muhammad Ansif** ([@Ryuyjg](https://github.com/Ryuyjg))
