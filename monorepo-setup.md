# Driver Delivery App Monorepo Setup Guide

## 1. Project Structure
```
driver-delivery/
├── package.json
├── turbo.json
├── yarn.lock
├── .gitignore
├── tsconfig.base.json
├── apps/
│   ├── mobile/              # React Native app
│   │   ├── package.json
│   │   ├── App.tsx
│   │   └── src/
│   └── api/                 # Node.js backend
│       ├── package.json
│       ├── src/
│       └── tsconfig.json
├── packages/
│   ├── tsconfig/           # Shared TypeScript configs
│   │   ├── package.json
│   │   ├── base.json
│   │   ├── react-native.json
│   │   └── node.json
│   ├── eslint-config/      # Shared ESLint configs
│   │   ├── package.json
│   │   └── index.js
│   ├── shared-types/       # Shared TypeScript types
│   │   ├── package.json
│   │   └── src/
│   └── ui/                 # Shared UI components
│       ├── package.json
│       └── src/
└── tools/                  # Development tools and scripts
    └── scripts/
```

## 2. Initial Setup

### 2.1 Root Configuration

```json
// package.json
{
  "name": "driver-delivery",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^1.12.4",
    "@changesets/cli": "^2.27.1",
    "prettier": "^3.2.5"
  }
}
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 2.2 Shared TypeScript Configuration

```json
// packages/tsconfig/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "moduleResolution": "node",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true
  },
  "exclude": ["node_modules"]
}
```

### 2.3 Shared Types Package

```typescript
// packages/shared-types/src/index.ts
export interface Driver {
  id: string;
  vehicleNumber: string;
  name: string;
}

export interface Route {
  id: string;
  driverId: string;
  pickupPoints: PickupPoint[];
  destinations: Destination[];
}

export interface Location {
  latitude: number;
  longitude: number;
}
```

### 2.4 Shared UI Components

```typescript
// packages/ui/src/components/DeliveryCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Destination } from '@driver-delivery/shared-types';

interface Props {
  destination: Destination;
  onPress: () => void;
}

export const DeliveryCard: React.FC<Props> = ({ destination, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.address}>{destination.address}</Text>
    </View>
  );
};
```

## 3. App Configurations

### 3.1 Mobile App Setup

```json
// apps/mobile/package.json
{
  "name": "@driver-delivery/mobile",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@driver-delivery/shared-types": "*",
    "@driver-delivery/ui": "*",
    "react-native": "0.78.0"
  },
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios"
  }
}
```

### 3.2 Backend API Setup

```json
// apps/api/package.json
{
  "name": "@driver-delivery/api",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@driver-delivery/shared-types": "*",
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 4. Development Workflow

### 4.1 Installing Dependencies
```bash
# At root directory
yarn install
```

### 4.2 Running Development Servers
```bash
# Start all services
yarn dev

# Start specific service
yarn workspace @driver-delivery/mobile start
yarn workspace @driver-delivery/api dev
```

### 4.3 Building for Production
```bash
# Build all packages
yarn build

# Build specific package
yarn workspace @driver-delivery/mobile build
yarn workspace @driver-delivery/api build
```

## 5. CI/CD Setup

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Lint
        run: yarn lint
      
      - name: Type check
        run: yarn tsc
      
      - name: Test
        run: yarn test
      
      - name: Build
        run: yarn build
```

## 6. Docker Setup

```dockerfile
# Docker Compose for development
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@postgres:5432/db
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=db

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

## 7. Benefits of This Structure

1. **Shared Code**:
   - Common types between frontend and backend
   - Shared UI components
   - Consistent configurations

2. **Development Experience**:
   - Single command to start all services
   - Parallel task execution
   - Cached builds with Turborepo

3. **Code Quality**:
   - Shared ESLint and TypeScript configs
   - Consistent code style
   - Type safety across packages

4. **Deployment**:
   - Independent deployment capability
   - Shared CI/CD pipeline
   - Docker support
