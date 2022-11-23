FROM node:10.15.3-alpine AS client-build
WORKDIR /client/src
COPY package.json package-lock.json ./
COPY client/src ./src/
RUN npm install
COPY . .
RUN cd client && cd src && npm run build

FROM node:10.15.3-alpine AS server-build
WORKDIR /
COPY --from=client-build /client/dist ./client/dist
COPY package.json package-lock.json ./
RUN npm install
COPY server.js ./


FROM node:10.15.3-alpine AS prod-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=client-build /client/src/build ./client/build
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
