# Development Dockerfile for React app

FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose React dev server port (default 3000)
EXPOSE 3000

CMD ["npm", "run", "dev"]

