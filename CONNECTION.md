# E-Audit App ↔ Backend Connection

The E-audit Android app is connected to this Node.js backend.

## Backend (this folder)

1. **Database**: MySQL database `e_audit_system` with tables: `users`, `transactions`, `fraud_alerts`.
2. **Run server**: `npm start` (runs on port 3000).
3. **API base**: `http://localhost:3000`

## Android app (Eaudit folder)

- **Emulator**: The app uses `http://10.0.2.2:3000` so the emulator can reach your PC’s localhost.
- **Real device**: Change `ApiClient.BASE_URL` in  
  `Eaudit/app/src/main/java/com/example/eaudit/api/ApiClient.java`  
  to your PC’s IP, e.g. `http://192.168.1.100:3000`. Keep the backend and phone on the same Wi‑Fi.

## Flow

- **Login**: Demo login (any username/password). The app uses the stored user id as `firebase_uid` for all API calls.
- **Transactions**: Add → `POST /api/transactions/add`. List → `GET /api/transactions/user/:uid`.
- **Fraud alerts**: `GET /api/fraud/alerts/:uid`.
- **Tax report**: `GET /api/reports/tax/:uid`.

No AI or blockchain; backend and app only.
