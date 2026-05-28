import puppeteer from "puppeteer-core";
import {
	PDF_CONTENT_WIDTH_PX,
	PDF_VIEWPORT_HEIGHT_PX,
} from "./pdfLayout";

const BLOCKED_REQUEST_SCHEMES = ["http:", "https:", "file:", "ftp:"];

function shouldBlockRequest(url: string): boolean {
	if (url === "about:blank") {
		return false;
	}

	if (url.startsWith("data:")) {
		return false;
	}

	try {
		const parsed = new URL(url);
		return BLOCKED_REQUEST_SCHEMES.includes(parsed.protocol);
	} catch {
		return true;
	}
}

/**
 * Renders sanitized export HTML to PDF with network and script execution disabled.
 */
export async function generatePdf(
	html: string,
	outputPath: string,
	executablePath: string,
): Promise<void> {
	const browser = await puppeteer.launch({
		executablePath,
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();

		// Match layout width to A4 printable area so long code lines wrap instead of clipping.
		await page.setViewport({
			width: PDF_CONTENT_WIDTH_PX,
			height: PDF_VIEWPORT_HEIGHT_PX,
			deviceScaleFactor: 1,
		});
		await page.emulateMediaType("print");

		await page.setJavaScriptEnabled(false);
		await page.setRequestInterception(true);

		page.on("request", (request) => {
			if (shouldBlockRequest(request.url())) {
				void request.abort();
				return;
			}

			void request.continue();
		});

		await page.setContent(html, {
			waitUntil: "domcontentloaded",
			timeout: 30_000,
		});

		await page.pdf({
			path: outputPath,
			format: "A4",
			printBackground: true,
			preferCSSPageSize: false,
			margin: {
				top: "12mm",
				right: "12mm",
				bottom: "12mm",
				left: "12mm",
			},
		});
	} finally {
		await browser.close();
	}
}
