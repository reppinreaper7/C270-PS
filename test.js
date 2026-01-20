console.log("Running CI tests...");

// Example test
function add(a, b) {
  return a + b;
}

if (add(2, 2) !== 4) {
  console.error("❌ Test failed");
  process.exit(1);   // FAIL CI
}

console.log("✅ All tests passed");
