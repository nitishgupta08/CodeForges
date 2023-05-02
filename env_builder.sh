#! /bin/bash
cd backend
echo "PORT=8000">> .env
echo "MONGO_SERVER_URI=mongodb://nitishgupta:Nitish1729@ac-axpvmsl-shard-00-00.yzh6hmp.mongodb.net:27017,ac-axpvmsl-shard-00-01.yzh6hmp.mongodb.net:27017,ac-axpvmsl-shard-00-02.yzh6hmp.mongodb.net:27017/CodeForges?ssl=true&replicaSet=atlas-r3pgtf-shard-0&authSource=admin&retryWrites=true&w=majority">> .env
echo "JWT_SECRET=nitishgupta">> .env
npm install
cd ..
cd frontend
echo "REACT_APP_BACKEND_URL=http://localhost:8000">>.env
npm install


