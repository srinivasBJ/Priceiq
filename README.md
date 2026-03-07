# priceiq-

# Terminal 1 - start database
cd ~/Desktop/priceiq && docker compose up -d postgres redis

# Terminal 2 - start backend
cd ~/Desktop/priceiq/backend && npx ts-node src/index.ts

# Terminal 3 - start frontend
cd ~/Desktop/priceiq/frontend && npm run dev
