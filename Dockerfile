FROM node:latest
WORKDIR /
ADD package.json ./
ADD app.js ./
COPY . /
EXPOSE 8070
RUN npm install
ENV SYSDIG_AGENT_CONF 'app_checks: [{name: node, check_module: prometheus, pattern: {comm: node}, conf: { url: "http://localhost:4000/metrics" }}]'
ENTRYPOINT [ "node", "app.js" ]