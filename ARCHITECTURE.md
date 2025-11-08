# Architecture Overview - FuelEU Compliance Dashboard

## 🏗️ Hexagonal Architecture (Ports & Adapters)

This project follows the **Hexagonal Architecture** pattern (also known as Ports & Adapters or Clean Architecture), ensuring a clear separation of concerns and making the codebase highly maintainable and testable.

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│                       (React Components)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │  Routes    │  │  Compare   │  │  Banking   │  │  Pooling   ││
│  │    Tab     │  │    Tab     │  │    Tab     │  │    Tab     ││
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘│
└────────┼────────────────┼────────────────┼────────────────┼──────┘
         │                │                │                │
         └────────────────┴────────────────┴────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │              INBOUND ADAPTERS                  │
         │            (React Hooks Layer)                 │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
         │  │useRoutes │  │useBanking│  │usePooling│   │
         │  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
         └───────┼─────────────┼─────────────┼──────────┘
                 │             │             │
         ┌───────┴─────────────┴─────────────┴──────────┐
         │              PORTS (Interfaces)               │
         │  IRoutesPort  IBankingPort  IPoolingPort      │
         └───────┬─────────────┬─────────────┬──────────┘
                 │             │             │
         ┌───────┴─────────────┴─────────────┴──────────┐
         │           CORE DOMAIN LAYER                   │
         │        (Business Logic & Entities)            │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
         │  │  Route   │  │BankEntry │  │   Pool   │   │
         │  │  Entity  │  │  Entity  │  │  Entity  │   │
         │  └──────────┘  └──────────┘  └──────────┘   │
         │                                               │
         │  ┌─────────────────────────────────────┐    │
         │  │      Domain Constants & Rules        │    │
         │  │  - Target Intensity: 89.3368         │    │
         │  │  - Banking Rules (Article 20)        │    │
         │  │  - Pooling Rules (Article 21)        │    │
         │  └─────────────────────────────────────┘    │
         └───────┬─────────────┬─────────────┬──────────┘
                 │             │             │
         ┌───────┴─────────────┴─────────────┴──────────┐
         │         OUTBOUND ADAPTERS                     │
         │       (Infrastructure Layer)                  │
         │  ┌────────────┐  ┌────────────┐  ┌─────────┐│
         │  │  Routes    │  │  Banking   │  │ Pooling ││
         │  │  Adapter   │  │  Adapter   │  │ Adapter ││
         │  └─────┬──────┘  └─────┬──────┘  └────┬────┘│
         └────────┼────────────────┼──────────────┼─────┘
                  │                │              │
         ┌────────┴────────────────┴──────────────┴─────┐
         │           API CLIENT (Axios)                  │
         │         HTTP Communication Layer              │
         └────────┬────────────────┬──────────────┬─────┘
                  │                │              │
         ┌────────┴────────────────┴──────────────┴─────┐
         │            BACKEND API                        │
         │      (Fuel-EU-Backend Server)                 │
         │         http://localhost:3001                 │
         └───────────────────────────────────────────────┘
```

## 📦 Layer Responsibilities

### 1. Presentation Layer (UI Components)
**Location**: `src/adapters/ui/components/`

**Responsibility**: 
- Render the user interface
- Handle user interactions
- Display data from hooks
- No business logic

**Components**:
```typescript
// Tab Components
- RoutesTab.tsx      → Display routes, filters, set baseline
- CompareTab.tsx     → Show comparison table and charts
- BankingTab.tsx     → Banking operations interface
- PoolingTab.tsx     → Pool creation and management

// Common Components
- Button.tsx         → Reusable button with variants
- Card.tsx           → Container component
- Badge.tsx          → Status indicators
- LoadingSpinner.tsx → Loading states
- ErrorMessage.tsx   → Error display
```

**Key Principle**: Components should be "dumb" - they receive data via props/hooks and render, that's it.

### 2. Inbound Adapters (React Hooks)
**Location**: `src/adapters/ui/hooks/`

**Responsibility**:
- Connect UI to domain logic
- Manage component state
- Handle async operations
- Call outbound port methods

**Hooks**:
```typescript
useRoutes()       → Manage routes data and operations
useComparison()   → Handle comparison logic
useCompliance()   → Fetch compliance balance
useBanking()      → Banking operations
usePooling()      → Pooling operations
```

**Pattern**:
```typescript
export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use outbound port (adapter)
  const adapter = routesAdapter; // implements IRoutesPort

  const fetchRoutes = async () => {
    try {
      const data = await adapter.getAllRoutes();
      setRoutes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return { routes, loading, error, refetch: fetchRoutes };
};
```

### 3. Ports (Interfaces)
**Location**: `src/core/ports/outbound.ts`

**Responsibility**:
- Define contracts for external dependencies
- Enable dependency inversion
- Make testing easier (can mock)

**Interfaces**:
```typescript
export interface IRoutesPort {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<RouteComparison[]>;
}

export interface IBankingPort {
  getBankingRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(operation: BankingOperation): Promise<BankingResult>;
  applyBanked(operation: BankingOperation): Promise<BankingResult>;
}

// ... more ports
```

**Key Principle**: Core domain depends on ports (abstractions), not on concrete implementations.

### 4. Core Domain Layer
**Location**: `src/core/domain/`

**Responsibility**:
- Define domain entities
- Business rules and constants
- Pure TypeScript (no framework dependencies)

**Entities**:
```typescript
// Route.ts
export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
}

// BankEntry.ts
export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt: string;
}

// Pool.ts
export interface Pool {
  id: string;
  year: number;
  createdAt: string;
}
```

**Constants**:
```typescript
// src/shared/constants.ts
export const FUEL_EU_CONSTANTS = {
  TARGET_INTENSITY_2025: 89.3368, // gCO₂e/MJ
  ENERGY_CONVERSION_FACTOR: 41000, // MJ per ton
  BASE_INTENSITY: 91.16,
  REDUCTION_2025: 0.02, // 2%
} as const;
```

**Key Principle**: Core domain should have ZERO dependencies on frameworks or libraries. Pure business logic only.

### 5. Outbound Adapters (Infrastructure)
**Location**: `src/adapters/infrastructure/api/`

**Responsibility**:
- Implement outbound port interfaces
- Handle external communication (HTTP, DB, etc.)
- Transform data between external and internal formats

**Adapters**:
```typescript
// RoutesAdapter.ts
export class RoutesAdapter implements IRoutesPort {
  async getAllRoutes(): Promise<Route[]> {
    return apiClient.get<Route[]>('/routes');
  }

  async setBaseline(routeId: string): Promise<void> {
    await apiClient.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<RouteComparison[]> {
    return apiClient.get<RouteComparison[]>('/routes/comparison');
  }
}
```

**API Client**:
```typescript
// ApiClient.ts
export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  // ... post, put, delete methods
}
```

**Key Principle**: Adapters are swappable. We can replace HTTP with GraphQL, or mock API for testing, without changing core logic.

## 🔄 Data Flow

### Example: Fetching Routes

```
1. User visits Routes Tab
   ↓
2. RoutesTab component renders
   ↓
3. useRoutes() hook is called
   ↓
4. Hook calls routesAdapter.getAllRoutes()
   ↓
5. Adapter makes HTTP call via ApiClient
   ↓
6. ApiClient sends GET /api/routes
   ↓
7. Backend responds with routes data
   ↓
8. Adapter returns Route[] to hook
   ↓
9. Hook updates state
   ↓
10. Component re-renders with data
```

### Example: Setting Baseline

```
1. User clicks "Set Baseline" button
   ↓
2. handleSetBaseline() in RoutesTab
   ↓
3. Calls setBaseline(routeId) from useRoutes
   ↓
4. Hook calls routesAdapter.setBaseline(routeId)
   ↓
5. Adapter makes POST /api/routes/:id/baseline
   ↓
6. Backend updates database
   ↓
7. Success response
   ↓
8. Hook calls fetchRoutes() to refresh
   ↓
9. Updated data displayed with baseline badge
```

## 🎯 Benefits of This Architecture

### 1. **Testability** ✅
- Can test domain logic without UI
- Can mock adapters for hook testing
- Can test components in isolation

### 2. **Maintainability** ✅
- Clear separation of concerns
- Easy to locate and fix bugs
- Changes in one layer don't affect others

### 3. **Flexibility** ✅
- Swap React for Vue without changing core
- Change API from REST to GraphQL easily
- Add new adapters (e.g., WebSocket) seamlessly

### 4. **Scalability** ✅
- Easy to add new features
- Team members can work on different layers
- Code organization stays clean as app grows

### 5. **Reusability** ✅
- Domain entities shared across features
- Hooks can be reused in multiple components
- Adapters can be used in different contexts

## 📚 Dependency Rules

```
Presentation → Inbound Adapters → Ports → Core Domain
                                            ↑
                                            |
                              Outbound Adapters
```

**Rules**:
1. ✅ Outer layers CAN depend on inner layers
2. ❌ Inner layers CANNOT depend on outer layers
3. ✅ Core domain has NO dependencies on adapters or UI
4. ✅ All dependencies point INWARD toward core

**Example of Good Dependency**:
```typescript
// RoutesTab.tsx (outer) depends on useRoutes (inner) ✅
import { useRoutes } from '../../hooks/useRoutes';
```

**Example of Bad Dependency**:
```typescript
// Route.ts (core) depends on axios (adapter) ❌
import axios from 'axios'; // NO! Core should not know about HTTP
```

## 🛠️ How to Add a New Feature

### Example: Adding a "Ships" Tab

**Step 1: Create Domain Entity**
```typescript
// src/core/domain/entities/Ship.ts
export interface Ship {
  id: string;
  name: string;
  imo: string;
  vesselType: string;
}
```

**Step 2: Define Port**
```typescript
// src/core/ports/outbound.ts
export interface IShipsPort {
  getAllShips(): Promise<Ship[]>;
  getShipById(id: string): Promise<Ship>;
}
```

**Step 3: Create Adapter**
```typescript
// src/adapters/infrastructure/api/ShipsAdapter.ts
export class ShipsAdapter implements IShipsPort {
  async getAllShips(): Promise<Ship[]> {
    return apiClient.get<Ship[]>('/ships');
  }
  // ... implement interface methods
}
```

**Step 4: Create Hook**
```typescript
// src/adapters/ui/hooks/useShips.ts
export const useShips = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  // ... state management
  const fetchShips = async () => {
    const data = await shipsAdapter.getAllShips();
    setShips(data);
  };
  return { ships, loading, error, refetch: fetchShips };
};
```

**Step 5: Create Component**
```typescript
// src/adapters/ui/components/tabs/ShipsTab.tsx
export const ShipsTab: React.FC = () => {
  const { ships, loading, error } = useShips();
  // ... render ships table
};
```

**Step 6: Add to App**
```typescript
// src/App.tsx
import { ShipsTab } from './adapters/ui/components/tabs/ShipsTab';

const tabs = [
  // ... existing tabs
  { id: 'ships', label: 'Ships' },
];

// In render:
{activeTab === 'ships' && <ShipsTab />}
```

Done! ✅

## 🎨 Visual Component Hierarchy

```
App
├── Header
│   └── Title + Version Badge
├── Tab Navigation
│   ├── Routes Tab
│   ├── Compare Tab
│   ├── Banking Tab
│   └── Pooling Tab
├── Tab Content
│   └── [Active Tab Component]
│       ├── Card (container)
│       │   ├── Filters / Inputs
│       │   ├── Data Table
│       │   └── Actions (Buttons)
│       └── Additional Cards
│           ├── Charts (Compare Tab)
│           ├── KPIs (Banking Tab)
│           └── Results (Pooling Tab)
└── Footer
    └── Copyright + Regulation Info
```

## 🔐 Type Safety Flow

```typescript
// 1. Backend API Response (unknown)
const response = await axios.get('/routes');

// 2. Typed in Adapter (Route[])
const routes: Route[] = response.data;

// 3. Typed in Hook
const [routes, setRoutes] = useState<Route[]>([]);

// 4. Typed in Component Props
interface RoutesTableProps {
  routes: Route[];
}

// 5. Typed in Component State
const [filter, setFilter] = useState<string>('all');

// Result: Full type safety from API → UI ✅
```

## 📖 Further Reading

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Ports and Adapters Pattern](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)

---

This architecture ensures that the FuelEU Compliance Dashboard is **maintainable**, **testable**, **flexible**, and **scalable**. 🚀
