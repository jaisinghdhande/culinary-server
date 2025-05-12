const http = require('http');
const config = require('./src/config/config');
const app = require('./src/app');

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
});
