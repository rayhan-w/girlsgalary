const https = require('https');

function getJpegDimensions(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let buffer = Buffer.alloc(0);
      res.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        // Search for SOF0 marker (0xFF, 0xC0) or SOF2 (0xFF, 0xC2)
        for (let i = 0; i < buffer.length - 8; i++) {
          if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            res.destroy();
            return resolve({ url, width, height, aspect: (width / height).toFixed(2) });
          }
        }
      });
      res.on('end', () => resolve({ url, error: 'not found' }));
      res.on('error', reject);
    });
  });
}

const urls = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=80',
  'https://amirabd.com/wp-content/uploads/2025/07/Web-banner-eidul-adha-EDIT-25.jpg'
];

Promise.all(urls.map(getJpegDimensions)).then(console.log).catch(console.error);
