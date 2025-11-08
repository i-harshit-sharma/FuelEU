# FuelEU Maritime Compliance Dashboard - Frontend

A modern React + TypeScript dashboard for managing FuelEU Maritime compliance, implementing Regulation (EU) 2023/1805.

## 🚀 Features

- **Routes Management**: View, filter, and set baseline routes
- **Comparison Analysis**: Compare routes against baseline with visual charts
- **Banking System**: Implement Article 20 - bank surplus and apply to deficits
- **Pooling System**: Implement Article 21 - combine compliance balances across ships
- **Hexagonal Architecture**: Clean separation of concerns (Core → Ports → Adapters)
- **Modern UI**: Responsive design with TailwindCSS

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:3000`

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

## 🏗️ Architecture

The project follows **Hexagonal Architecture (Ports & Adapters)**:

```
src/
├── core/
│   ├── domain/          # Domain entities (Route, BankEntry, Pool, etc.)
│   ├── application/     # Use cases (not used in this simple app)
│   └── ports/           # Interface definitions for adapters
├── adapters/
│   ├── ui/              # React components, hooks
│   │   ├── components/  # UI components (tabs, common)
│   │   └── hooks/       # React hooks for data fetching
│   └── infrastructure/  # API clients, HTTP adapters
│       └── api/         # Backend API communication
└── shared/              # Constants, utilities
```

### Layer Responsibilities

- **Core/Domain**: Pure TypeScript entities and types, no framework dependencies
- **Core/Ports**: Interface contracts that adapters must implement
- **Adapters/UI**: React components implementing the user interface
- **Adapters/Infrastructure**: HTTP clients implementing outbound ports
- **Shared**: Constants and utilities used across layers

## 📊 Tabs & Features

### 1. Routes Tab
- Display all routes with filtering (vessel type, fuel type, year)
- Set baseline route for comparisons
- View GHG intensity, fuel consumption, distance, emissions

### 2. Compare Tab
- Compare all routes against the baseline
- Display % difference and compliance status
- Visual chart showing baseline vs comparison
- Target intensity: 89.3368 gCO₂e/MJ (2% below 91.16)

### 3. Banking Tab
- Fetch compliance balance for a ship
- Bank positive CB for future use
- Apply banked surplus to offset deficits
- KPIs: CB Before, Applied, CB After

### 4. Pooling Tab
- Add multiple ships to a pool
- Fetch adjusted CB for each ship
- Validate pool (total CB ≥ 0)
- Create pool and view allocation results

## 🔌 API Integration

The frontend connects to the backend via `/api` proxy:

```typescript
// Configured in vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### API Endpoints Used

- `GET /routes` - Fetch all routes
- `POST /routes/:id/baseline` - Set baseline route
- `GET /routes/comparison` - Get comparison data
- `GET /compliance/cb?shipId&year` - Get compliance balance
- `GET /compliance/adjusted-cb?shipId&year` - Get adjusted CB
- `POST /banking/bank` - Bank surplus
- `POST /banking/apply` - Apply banked surplus
- `POST /pools` - Create pool

## 🎨 UI Components

### Common Components
- **Button**: Multi-variant button with loading states
- **Card**: Container with optional title and actions
- **Badge**: Status indicators (success, danger, warning, info)
- **LoadingSpinner**: Loading indicator
- **ErrorMessage**: Error display with retry option

### Tab Components
- **RoutesTab**: Routes management interface
- **CompareTab**: Comparison and chart visualization
- **BankingTab**: Banking operations interface
- **PoolingTab**: Pool creation and management

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full multi-column layouts
- **Tablet**: 2-column grid layouts
- **Mobile**: Single column with stacked elements

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
```

### TailwindCSS Customization

Customize colors and theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Custom color palette
      },
    },
  },
}
```

## 📝 Code Quality

- **TypeScript Strict Mode**: Full type safety
- **ESLint**: Code linting with React hooks rules
- **Prettier**: Code formatting (optional)
- **Clean Code**: Following SOLID principles

## 🚦 Development Workflow

1. Start backend server (port 3001)
2. Run `npm run dev` (frontend on port 3000)
3. Access dashboard at `http://localhost:3000`
4. Make changes with hot reload enabled

## 📚 Key Technologies

- **React 18**: UI library
- **TypeScript 5**: Type-safe development
- **Vite**: Fast build tool and dev server
- **TailwindCSS 3**: Utility-first CSS framework
- **Recharts**: Chart visualization
- **Axios**: HTTP client

## 🎯 FuelEU Maritime Compliance

This dashboard implements:

- **Article 20 - Banking**: Ships can bank positive CB for future use
- **Article 21 - Pooling**: Ships can pool their CB together
- **Target Intensity**: 89.3368 gCO₂e/MJ for 2025 (2% reduction)
- **CB Calculation**: (Target - Actual) × Energy in scope

## 📖 References

- [FuelEU Maritime Regulation (EU) 2023/1805](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1805)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

## 👨‍💻 Development Notes

### AI Agent Usage
See `AGENT_WORKFLOW.md` for detailed documentation on how AI agents were used in this project.

### Architecture Decisions
See `REFLECTION.md` for insights on architectural choices and lessons learned.

## 📄 License

This project is part of the FuelEU Maritime compliance assignment.

## 🤝 Contributing

This is an assignment project. See instructor guidelines for contribution rules.

---

Built with ❤️ using AI-assisted development (GitHub Copilot)
