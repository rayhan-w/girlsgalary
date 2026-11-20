const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'banners');

const ladiesBanners = [
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/07/1-scaled.webp',
    dest: 'banner-ladies-1.webp'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/07/MOBILE.webp',
    dest: 'banner-ladies-1-mobile.webp'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/12/3.jpg',
    dest: 'banner-ladies-2.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/12/3m.jpg',
    dest: 'banner-ladies-2-mobile.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/12/2.jpg',
    dest: 'banner-ladies-3.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/12/1m.jpg',
    dest: 'banner-ladies-3-mobile.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/11/11.jpg',
    dest: 'banner-ladies-4.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/11/1.jpg',
    dest: 'banner-ladies-4-mobile.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/01/Web-banner-durga-puja-25.jpg',
    dest: 'banner-ladies-5.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/01/mobile-banner-durga-puja-25.jpg',
    dest: 'banner-ladies-5-mobile.jpg'
  }
];

function downloadFile(item) {
  return new Promise((resolve) => {
    const fullDest = path.join(targetDir, item.dest);
    const file = fs.createWriteStream(fullDest);
    const urlObj = new URL(item.url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      headers: {
        'Referer': 'https://amirabd.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    https.get(options, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(fullDest);
          console.log(`Saved ${item.dest} (${stats.size} bytes)`);
          resolve(true);
        });
      } else {
        console.error(`Failed ${item.url}: ${res.statusCode}`);
        file.close();
        if (fs.existsSync(fullDest)) fs.unlinkSync(fullDest);
        resolve(false);
      }
    }).on('error', (e) => {
      console.error(e.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const b of ladiesBanners) {
    await downloadFile(b);
  }
  console.log("All ladies banners downloaded successfully!");
}

run();
