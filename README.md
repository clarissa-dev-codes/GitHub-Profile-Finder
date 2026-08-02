# GitHub Profile Finder

A sleek, responsive web application that fetches real-time developer profiles and statistics using the official GitHub REST API. Users can view profile biographies, core statistics, automated language usage distributions, and top-performing repositories with full dark mode integration.

![HTML5](https://shields.io)
![CSS3](https://shields.io)
![JavaScript](https://shields.io)

## 🚀 Features

- **Real-Time Data Retrieval**: Asynchronously queries the GitHub REST API for dynamic user information.
- **Native Language Distribution Graphic**: Analyzes the user's top 100 repositories to calculate and draw an exact language utilization breakdown bar.
- **Top Repositories Spotlight**: Automatically sorts user repositories by star counts to showcase their top 3 most popular projects.
- **Persistent Theme Configuration**: Features a responsive Light/Dark mode toggle switch that preserves user theme selection across refreshes using browser `localStorage`.
- **Robust Error Contingencies**: Handles edge-case states gracefully, including custom fallbacks for accounts with missing bios, zero public repositories, or absent language indicators.
- **Fluid User Interface**: Optimized with an asynchronous loading spinner animation to handle network request latency seamlessly.

## 🛠️ Built With

- **HTML5**: Semantic document layout structure.
- **CSS3 (Custom Properties)**: Styled variables for instant theme shifting and animation parameters.
- **Vanilla JavaScript (ES6+)**: Handles multi-endpoint fetch synchronization (`Promise.all`), runtime string parsing, and asynchronous DOM mutation logic.

## 📦 Getting Started

Follow these steps to run the application locally on your computer:

### Prerequisites
You only need a modern web browser (such as Google Chrome, Mozilla Firefox, or Microsoft Edge).

### Installation & Execution
1. Clone or download this project folder to your local machine.
2. Ensure your directory contains the three primary application files:
   ```text
   ├── index.html
   ├── style.css
   └── app.js
   ```
3. Open your browser and launch the `index.html` file directly, or serve it using an extension like **Live Server** in Visual Studio Code.

## 💡 How It Works

The application uses asynchronous JavaScript to communicate concurrently with two different GitHub REST API endpoints:
- **Profile Endpoint**: `https://github.com{username}` retrieves name, avatar, bio, and tracking stats.
- **Repositories Endpoint**: `https://github.com{username}/repos?per_page=100` retrieves up to 100 public repositories.

The language calculation module maps out all found programming languages, drops empty entries, and determines a rounded percentage representation that feeds into the multi-colored bar legend element dynamically.

## 📝 License

No license
