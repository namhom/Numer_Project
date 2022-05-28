# เลือก engine ที่ต้องการ
FROM node:18

# กำหนด working directory สำหรับการ run
WORKDIR /app

COPY package*.json ./

# install dependencies
RUN npm install
RUN npm install -g nodemon

COPY . ./
