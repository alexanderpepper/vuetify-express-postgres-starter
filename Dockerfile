FROM node:14-alpine AS client-build
WORKDIR /client/src
COPY package.json package-lock.json ./
COPY client/src ./src/
RUN npm install
COPY . .
RUN cd client && cd src && npm run build

FROM node:14-alpine AS server-build
WORKDIR /
COPY --from=client-build /client/ ./client/
COPY package.json package-lock.json ./
RUN npm install
COPY server.js ./

EXPOSE 3000

CMD ["npm", "start"]
