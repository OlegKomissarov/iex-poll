FROM node:latest
WORKDIR /
ADD package.json ./
ADD app.js ./
COPY . /
EXPOSE 8070
RUN npm install
ENTRYPOINT [ "node", "app.js" ]