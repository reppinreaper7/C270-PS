const http = require("http");

function testEndpoint(path, expectedStatus) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      if (res.statusCode === expectedStatus) {
        console.log(`✅ ${path} passed`);
        resolve();
      } else {
        reject(`❌ ${path} failed`);
      }
    }).on("error", (err) => reject(err));
  });
}

(async () => {
  try {
    await testEndpoint("/", 200);
    await testEndpoint("/health", 200);
    console.log("🎉 Pi Testing successful");
    process.exit(0);
  } catch (err) {
    console.error("🚨 Pi Testing failed:", err);
    process.exit(1);
  }
})();
