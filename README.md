# TrackFlow - Job Application Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)

**TrackFlow** is a modern, responsive, and privacy-focused job application tracker built to help you organize your job search. Visualize your progress with a Kanban board, manage details in a List view, and track your success with Analytics.

## 🚀 Features

- **Kanban Board Workflow**:
  - Drag-and-drop style visualization (Wishlist -> Applied -> Interview -> Offer -> Closed).
  - Color-coded stages for easy status recognition.
- **Detailed List View**:
  - Sortable columns (Company, Status, Salary, Date).
  - Quick links to job descriptions.
  - "LPA" (Lakhs Per Annum) salary formatting support.
- **Analytics Dashboard**:
  - Visual progress bars for each pipeline stage.
  - Total opportunities and success goal tracking.
- **Dark Mode Support**:
  - Fully integrated dark theme with a manual toggle.
  - System-independent preference persistence.
- **Mobile First Design**:
  - Responsive layout with a dedicated bottom navigation bar for mobile devices.
  - Touch-friendly interfaces and clear typography.
- **Local Privacy**:
  - All data is stored locally in your browser (`localStorage`).
  - No external database or account required.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) (v18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📦 Components Overview

The application is modular and built with reusability in mind:

- **`KanbanBoard`**: Renders the column-based workflow.
- **`SolidCard`**: A core UI component ensuring consistent styling (glassmorphism/neumorphism hybrid).
- **`AnalyticsView`**: Dynamic charts and summary statistics.
- **`IconButton`**: Adaptive navigation components.

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trackflow.git
   cd trackflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🧠 State Management

TrackFlow uses React's native hooks for state management, keeping the architecture lightweight and fast.

- **`useState`**: Manages local state for jobs, view modes, and form data.
- **`useEffect`**: Handles side-effects like persisting data to `localStorage` and toggling document classes for Dark Mode.
- **`useMemo`**: Optimizes sorting and filtering operations to ensure smooth performance even with large datasets.

## 📱 Mobile Responsiveness

The application adapts to any screen size. On mobile devices, the sidebar automatically transforms into a fixed bottom navigation bar, ensuring that core actions like switching views or adding a new job are always within thumb's reach.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
