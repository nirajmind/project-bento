# 🍱 Project Bento

> **A Desktop-First "Covenant Command Center" for the modern Loan Market.**
> *Built for the LMA Edge Hackathon (Category: Keeping Loans on Track)*

## 📖 Overview

**Project Bento** is a commercially viable desktop application designed to modernize how Loan Agency Officers monitor portfolio health.

Instead of reactive, manual spreadsheet checks, Bento provides a **proactive monitoring system**. It creates a secure, local-first environment where agents can stress-test their loan portfolios against complex macro-economic shocks in real-time.

---

## 🧠 Deep Dive: The Multivariate Risk Engine

We moved beyond simple linear calculations. Bento features a **Weighted Risk Algorithm** that calculates a composite "Credit Score" (0-100) for every borrower based on 10+ interacting factors:

1.  **Macro-Economic Inputs:**
    * **Interest Rates:** Direct impact on Debt Service Coverage Ratio (DSCR).
    * **GDP Growth:** Triggers sector-specific logic (e.g., a recession penalizes "Retail" borrowers more heavily than "Energy" borrowers).
    * **Inflation:** Erosive impact on borrower margins.
2.  **Micro-Economic Inputs:**
    * **Revenue Shock:** Simulates varying degrees of global sales contraction (0-30%).
3.  **The Scoring Logic:**
    * `Risk Score = Base Health - (Rate Impact + Revenue Shock + Sector Penalty)`
    * The engine updates in milliseconds using **Pinia** state management, allowing for instant visual feedback.

---

## 🛠️ Built With

* **Core:** [Electron](https://www.electronjs.org/), [Vue.js 3](https://vuejs.org/)
* **Language:** JavaScript / Node.js
* **Database:** SQLite (via `better-sqlite3`)
* **State Management:** Pinia
* **Visualization:** Chart.js
* **Styling:** Tailwind CSS

---

## 🧗 Challenges We Overcame

Building a "Modern Hybrid" desktop app came with specific low-level challenges:

### 1. The "Native Module" Trap (Electron vs. Node)
We chose **SQLite** for local privacy, but using the `better-sqlite3` C++ module caused a critical version mismatch:
> *"Module was compiled against Node v127, but Electron requires v140."*

**Solution:** We had to implement a specific rebuild step using `electron-rebuild` to compile the C++ binaries specifically for the Chromium engine inside Electron, rather than the system's Node version.

### 2. The Bleeding Edge Conflict
We initially attempted to use the latest **Tailwind CSS v4**, which caused major PostCSS configuration conflicts with our Vite build pipeline.
**Solution:** We learned that stability beats novelty in a hackathon. We rolled back to a stable v3 configuration to ensure consistent cross-platform styling without build errors.

---

## ⚡ Getting Started

### Prerequisites
* Node.js (v16+ recommended)
* npm

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/yourusername/project-bento.git](https://github.com/yourusername/project-bento.git)
    cd project-bento
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Rebuild SQLite for Electron** (Critical Step)
    ```bash
    npm run rebuild
    # Or: npm install -D electron-rebuild && npx electron-rebuild -f -w better-sqlite3
    ```

4.  **Run in Development Mode**
    ```bash
    npm run dev
    ```

---

## 🧪 How to Test the Simulator
1.  Launch the app.
2.  Use the **Interest Rate Slider** to hike rates to 2%. Watch "Alpha Retail" turn **RED**.
3.  Use the **GDP Slider** to simulate a recession (-2%). Notice how the "Retail" sector score drops faster than "Energy".

## 📄 License
This project is licensed under the MIT License.