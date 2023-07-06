FROM node:lts
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3000
CMD [ "node", "index.js" ]

