## Key Components

Frontend Stack:
- Vite + Deno + React + TypeScript
- Tailwind CSS for styling
- Service worker for offline capabilities

Core Architecture:
- **Entry Point:** main.tsx → App.tsx (minimal 8 LOC root component)
- **Device Discovery:** DiscoverDevices.ts with network timeout handling
- **System Monitoring:** FetchSystemStats.ts (58 LOC) for collecting device metrics
- **Error Handling:** ErrorBoundary.tsx class component with proper error catching

## Main UI Components

Dashboard Views:
- Dashboards.tsx - Main dashboard interface
- DevicePage.tsx (109 LOC) - Individual device details
- Networks.tsx - Network overview

Data Visualization:
- Graph.tsx (122 LOC) - Primary charting component
- Graphs.tsx - Multiple graph container
- Flashcard.tsx - Device status cards

User Input:
- IPInput.tsx (129 LOC) - Device IP configuration
- DiscoveryWrapper.tsx (109 LOC) - Device discovery with local storage

## Architecture Patterns

- **Component-based React architecture** with TypeScript
- **Service worker integration** for offline monitoring
- **Local storage** for device persistence
- **Network discovery** with timeout handling for device detection
- **Error boundaries** for graceful failure handling

The app appears designed to discover and monitor a fleet of networked devices (Pi's based on README context), displaying system stats through graphs and dashboards with offline capability