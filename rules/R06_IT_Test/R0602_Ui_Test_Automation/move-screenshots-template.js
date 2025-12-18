#!/usr/bin/env node

// Minimal template script.
// Replace placeholders (%%FROM_DIR%%, %%TO_DIR%%) when generating a temporary script.
// Assumptions:
// - Node.js runtime only (no external packages, no shell-specific commands)
// - Moves all .png files directly under FROM_DIR (non-recursive) to TO_DIR

const fs = require('fs');
const path = require('path');

const FROM_DIR = '%%FROM_DIR%%';
const TO_DIR = '%%TO_DIR%%';

function ensureDirSync(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function main() {
	const fromAbs = path.resolve(FROM_DIR);
	const toAbs = path.resolve(TO_DIR);

	if (!fs.existsSync(fromAbs)) {
		console.error(`Source not found: ${fromAbs}`);
		process.exit(1);
	}
	ensureDirSync(toAbs);

	const entries = fs.readdirSync(fromAbs, { withFileTypes: true });
	let moved = 0;
	for (const ent of entries) {
		if (!ent.isFile()) continue;
		if (!ent.name.toLowerCase().endsWith('.png')) continue;
		const src = path.join(fromAbs, ent.name);
		const dst = path.join(toAbs, ent.name);
		try {
			try {
				fs.renameSync(src, dst);
			} catch (_) {
				fs.copyFileSync(src, dst);
				fs.unlinkSync(src);
			}
			moved++;
			console.log(`moved: ${src} -> ${dst}`);
		} catch (e) {
			console.error(`failed: ${ent.name}: ${e.message}`);
		}
	}
	console.log(`done: ${moved} file(s)`);
}

main();
