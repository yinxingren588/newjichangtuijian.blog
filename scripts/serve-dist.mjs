import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

// 端口列表：包括 8888, 16666(Chrome不拦截的6666升级版), 80, 4321
const PORTS = [8888, 16666, 80, 4321];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function handleRequest(req, res) {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') {
    reqPath = '/index.html';
  } else if (!path.extname(reqPath)) {
    if (fs.existsSync(path.join(DIST_DIR, reqPath, 'index.html'))) {
      reqPath = path.join(reqPath, 'index.html');
    } else if (fs.existsSync(path.join(DIST_DIR, `${reqPath}.html`))) {
      reqPath = `${reqPath}.html`;
    }
  }

  const filePath = path.join(DIST_DIR, reqPath);

  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(DIST_DIR, '404.html');
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });

    fs.createReadStream(filePath).pipe(res);
  });
}

for (const port of PORTS) {
  try {
    const s = http.createServer(handleRequest);
    s.on('error', (err) => {
      console.log(`Port ${port} skipped: ${err.message}`);
    });
    s.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  } catch (err) {
    console.log(`Failed port ${port}: ${err.message}`);
  }
}

// 永不退出保活
setInterval(() => {}, 1000 * 60 * 60);
