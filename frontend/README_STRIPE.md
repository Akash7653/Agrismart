Stripe integration (local dev)

Overview
- The Marketplace component now calls POST /api/create-checkout-session with items: [{id, qty}].
- A minimal Express server is provided at `server/index.js` which creates a Stripe Checkout Session and returns `url`.

Setup (local)
1. Install dependencies in project root:

```powershell
npm install
```

2. Set environment variables (in your shell or .env file):

```powershell
$env:STRIPE_SECRET_KEY = "sk_test_..."
$env:STRIPE_PUBLISHABLE_KEY = "pk_test_..."
```

3. Run the server (separate terminal):

```powershell
npm run start:server
```

4. Run the app as usual:

```powershell
npm run dev
```

Notes
- The server uses a small in-memory PRODUCTS map; in production you must validate product IDs and prices server-side and store product data in a trusted DB.
- Do not commit secrets to source control.
- You can deploy the server as a small serverless function or an Express service. Adjust `success_url` and `cancel_url` as needed.
