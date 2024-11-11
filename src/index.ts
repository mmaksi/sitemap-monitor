import { app } from './app';
import http from 'http';

const hostname = '0.0.0.0';
const port = 80;

http.createServer(app).listen(port, hostname, () => {
  console.log('Server running on port 3000');
});
