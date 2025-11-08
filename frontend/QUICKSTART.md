# FuelEU Frontend - Quick Start Guide

## 🚀 Quick Start (3 steps)

### 1. Install Dependencies
```bash
cd FRONTEND
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at: **http://localhost:3000**

### 3. Ensure Backend is Running
The frontend expects the backend API at: **http://localhost:3001**

Start the backend first:
```bash
cd ../Fuel-EU-Backend
npm run dev
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |

## 🎯 Using the Dashboard

### Routes Tab
1. View all routes in the table
2. Filter by vessel type, fuel type, or year
3. Click "Set Baseline" to set a route as baseline
4. The baseline route will show a green "Baseline" badge

### Compare Tab
1. Requires a baseline route to be set first
2. View comparison table showing % difference
3. Green checkmark (✅) = compliant, Red X (❌) = non-compliant
4. View bar chart comparing GHG intensities
5. Target line shows the 2025 target (89.3368 gCO₂e/MJ)

### Banking Tab
1. Enter Ship ID and Year
2. Click "Fetch Compliance Balance"
3. View CB Before, Applied, and CB After
4. **Bank Surplus**: Save positive CB for future (requires CB > 0)
5. **Apply Banked**: Use saved CB to offset deficit (requires CB < 0)

### Pooling Tab
1. Enter Year for the pool
2. Add multiple ships using "+ Add Member"
3. For each ship:
   - Enter Ship ID
   - Click "Fetch CB" to get current CB
   - Or manually enter CB Before value
4. View Pool Summary showing:
   - Total Members
   - Total CB (must be ≥ 0)
   - Status (Valid/Invalid)
5. Click "Create Pool" when valid
6. View allocation results showing CB before and after for each ship

## 🐛 Troubleshooting

### Backend Connection Error
**Problem**: API calls fail with network error

**Solution**:
1. Ensure backend is running: `cd ../Fuel-EU-Backend && npm run dev`
2. Check backend is on port 3001: `http://localhost:3001`
3. Check proxy in vite.config.ts

### Port Already in Use
**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in vite.config.ts
server: {
  port: 3002,  # Use different port
}
```

### Build Errors
**Problem**: TypeScript errors during build

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npx tsc --version

# Run type check
npx tsc --noEmit
```

## 📁 Project Structure

```
FRONTEND/
├── src/
│   ├── core/                    # Core domain logic
│   │   ├── domain/entities/     # Domain entities
│   │   └── ports/               # Interface definitions
│   ├── adapters/
│   │   ├── ui/                  # React components
│   │   │   ├── components/      # UI components
│   │   │   │   ├── tabs/        # Tab components
│   │   │   │   └── common/      # Reusable UI components
│   │   │   └── hooks/           # Custom React hooks
│   │   └── infrastructure/      # External adapters
│   │       └── api/             # API clients
│   ├── shared/                  # Shared utilities
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── dist/                        # Build output
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── README.md
├── AGENT_WORKFLOW.md           # AI agent usage documentation
└── REFLECTION.md               # Development reflection

```

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these colors
        500: '#3b82f6',
        600: '#2563eb',
        // ...
      },
    },
  },
}
```

### Change API URL
Edit `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url',
      changeOrigin: true,
    },
  },
}
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Recharts Documentation](https://recharts.org/)

## ✅ Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Development server starts without errors
- [ ] Backend API is accessible
- [ ] All tabs load correctly
- [ ] No console errors
- [ ] Routes can be fetched and filtered
- [ ] Baseline can be set
- [ ] Comparison chart displays
- [ ] Banking operations work
- [ ] Pooling validation works

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review `README.md` for detailed documentation
3. Check `AGENT_WORKFLOW.md` for implementation details
4. Verify backend is running and accessible

---

**Ready?** Run `npm run dev` and start exploring! 🚀
