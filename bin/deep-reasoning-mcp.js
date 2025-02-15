#!/usr/bin/env node

async function main() {
  const { run } = await import("../dist/index.js");

  try {
    run();
  } catch (err) {
    console.error(err);
  }
}

main();
