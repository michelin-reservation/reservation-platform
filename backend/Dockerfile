FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && \
    npm ci && \
    npm rebuild bcrypt --build-from-source
COPY . .
EXPOSE 8000
CMD ["npm", "start"] 