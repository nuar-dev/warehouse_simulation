# 🏭 Warehouse Simulation

A desktop application for simulating and visualizing warehouse layouts, built with **Tauri**, **Rust**, and **React**.  
Supports dynamic warehouse grid creation, layout loading, and real-time UI interaction.

---

## 📐 Features

- Interactive warehouse grid UI (React + MUI)
- Load layouts from file or use default layout
- Real-time layout visualization
- Context-based state management
- Notification and Snackbar system
- Full Tauri integration with Rust backend (planned: simulation logic)

---

## 🚀 Quickstart

### 🧰 Prerequisites

- [Rust](https://rust-lang.org) (nightly toolchain recommended)
- [Node.js](https://nodejs.org/) ≥ 18
- [npm](https://www.npmjs.com/) ≥ 9
- [Tauri CLI](https://tauri.app/)  
  → `cargo install tauri-cli`

### 🛠 Development

```bash
# Clone and install dependencies
git clone https://github.com/nuar-dev/warehouse_simulation.git
cd warehouse_simulation

# Install JS deps and start dev server
npm install
npm run tauri dev

Maintained by nuar-dev
