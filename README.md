# Getting Started

## Requirements

```bash
# NodeJS v16 required
$ node -v

# Install Turborepo globally (v1.8 required)
$ npm install turbo --global

# Check npm version (v9 required)
$ npm -v

# Check Java is installed
$ java -version
```

## Backend configuration

1. Create environment file `.env.development.local`

```bash
$ cd packages/backend
$ cp .env.sample .env.development.local
```

2. Replace `MARKETPLACE_TWITTER_AUTH_BEARER_TOKEN` value

3. Copy the `firebase-credentials.json` into the `packages/backend` directory

### Frontend configuration

1. Copy `.env` configuration

```bash
$ cd packages/frontend
$ cp .env.sample .env
```

2. In the Browser console set the LocalStorage `auth_token` item to be able to access the Backend API

```js
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE')
```

## Bootstrap

```bash
$ turbo run bootstrap
$ turbo run dev # runs both frontend and backend dev servers
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
