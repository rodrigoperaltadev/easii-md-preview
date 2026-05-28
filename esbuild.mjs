import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const githubCssSource = join(
	__dirname,
	"node_modules",
	"github-markdown-css",
	"github-markdown.css",
);
const githubCssTarget = join(__dirname, "media", "github-markdown.css");

function copyGithubCss() {
	mkdirSync(join(__dirname, "media"), { recursive: true });
	copyFileSync(githubCssSource, githubCssTarget);
}

const buildOptions = {
	entryPoints: [join(__dirname, "src", "extension.ts")],
	bundle: true,
	outfile: join(__dirname, "dist", "extension.js"),
	external: ["vscode"],
	format: "cjs",
	platform: "node",
	target: "node18",
	sourcemap: !production,
	minify: production,
	logLevel: "info",
};

async function run() {
	copyGithubCss();

	if (watch) {
		const context = await esbuild.context(buildOptions);
		await context.watch();
		console.log("[esbuild] watching…");
		return;
	}

	await esbuild.build(buildOptions);
	console.log("[esbuild] bundle complete → dist/extension.js");
}

run().catch((error) => {
	console.error(error);
	process.exit(1);
});
