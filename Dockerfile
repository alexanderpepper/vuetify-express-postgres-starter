FROM node:10.15.3-alpine AS client-build
WORKDIR /client/src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:10.15.3-alpine AS prod-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=client-build /client/src/build ./client/build
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
