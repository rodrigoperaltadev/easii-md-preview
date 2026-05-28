import sanitizeHtml from "sanitize-html";

const allowedTags = Array.from(
	new Set([
		...sanitizeHtml.defaults.allowedTags,
		"article",
		"input",
		"table",
		"thead",
		"tbody",
		"tr",
		"th",
		"td",
	]),
);

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
	...sanitizeHtml.defaults.allowedAttributes,
	"*": ["class", "id", "title"],
	a: ["href", "name", "target", "rel"],
	input: ["type", "checked", "disabled", "class"],
	th: ["align"],
	td: ["align"],
	code: ["class"],
	pre: ["class"],
};

export function sanitizeRenderedHtml(html: string): string {
	return sanitizeHtml(html, {
		allowedTags,
		allowedAttributes,
		allowedSchemes: ["http", "https", "mailto"],
		allowedSchemesByTag: {
			img: ["http", "https"],
		},
		allowProtocolRelative: false,
		disallowedTagsMode: "discard",
		transformTags: {
			a: sanitizeHtml.simpleTransform("a", {
				rel: "noopener noreferrer",
			}),
			input: (tagName, attribs) => ({
				tagName,
				attribs: {
					...attribs,
					type: attribs.type === "checkbox" ? "checkbox" : "checkbox",
					disabled: "disabled",
				},
			}),
		},
	});
}
