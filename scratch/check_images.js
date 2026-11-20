const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=80'
];

// Let's check headers or download first few bytes to see image dimensions
const sizeOf = require('buffer');
urls.forEach(u => {
  https.get(u, res => {
    let data = [];
    res.on('data', chunk => {
      data.push(chunk);
      if (Buffer.concat(data).length > 50000) {
        res.destroy();
        const buf = Buffer.concat(data);
        console.log(u.slice(0, 45), 'Status:', res.statusCode, 'Content-Length:', res.headers['content-length']);
      }
    });
  });
});
