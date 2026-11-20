const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all links to stylesheets
    const links = [...data.matchAll(/<link[^>]+rel=['"]stylesheet['"][^>]+href=['"]([^'"]+)['"]/gi)].map(m => m[1]);
    console.log("Found stylesheets:", links.length);
    
    // Check which one is elementor post css
    const postCss = links.filter(l => l.includes('post-21327') || l.includes('elementor/css'));
    console.log("Elementor CSS files:", postCss);
    
    if (postCss.length > 0) {
      https.get(postCss[0], r2 => {
        let cssData = '';
        r2.on('data', c => cssData += c);
        r2.on('end', () => {
          const bgMatches = [...cssData.matchAll(/\.elementor-repeater-item-[a-f0-9]+\s*\{[^}]*background-image:[^;]+;/gi)];
          console.log("Found repeater background images in CSS:", bgMatches.length);
          bgMatches.forEach(m => console.log(m[0]));
        });
      });
    }
  });
});
