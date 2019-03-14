FROM node:latest
WORKDIR /endpoint
ADD package.json ./
RUN npm install
ENV SYSDIG_AGENT_CONF 'app_checks: [{name: node, check_module: prometheus, pattern: {comm: node}, conf: { url: "http://localhost:8081/api/metrics" }}]'
ADD app.js ./
ENTRYPOINT [ "node", "app.js" ]
