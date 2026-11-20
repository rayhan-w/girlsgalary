const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'banners');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const bannerDownloads = [
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/01/Web-banner-intermix-25.jpg',
    dest: 'banner-1.webp'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/01/MOBILE-banner-intermix-25-420-x-480-px.jpg',
    dest: 'banner-1-mobile.webp'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/01/Web-banner-durga-puja-25.jpg',
    dest: 'banner-2.webp'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/01/mobile-banner-durga-puja-25.jpg',
    dest: 'banner-2-mobile.webp'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2025/07/Web-banner-eidul-adha-EDIT-25.jpg',
    dest: 'banner-3.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/05/2.1.jpg',
    dest: 'banner-3-mobile.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/05/2.jpg',
    dest: 'banner-4.jpg'
  },
  {
    url: 'https://amirabd.com/wp-content/uploads/2026/07/MOBILE.webp',
    dest: 'banner-4-mobile.webp'
  }
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const fullDest = path.join(targetDir, item.dest);
    const file = fs.createWriteStream(fullDest);
    
    // We send Referer: https://amirabd.com/ so amira's server allows the download
    const urlObj = new URL(item.url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      headers: {
        'Referer': 'https://amirabd.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    https.get(options, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(fullDest);
          console.log(`Downloaded ${item.dest} (${stats.size} bytes)`);
          resolve(true);
        });
      } else {
        console.error(`Failed ${item.url} Status: ${res.statusCode}`);
        file.close();
        fs.unlinkSync(fullDest);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${item.url}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const b of bannerDownloads) {
    await downloadFile(b);
  }
  console.log("All banner downloads completed!");
}

run();
