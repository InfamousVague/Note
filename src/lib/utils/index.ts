export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function stripMarkdown(text: string): string {
    return text
        .replace(/(\*\*|__)(.*?)\1/g, '$2')          // bold
        .replace(/(\*|_)(.*?)\1/g, '$2')             // italic
        .replace(/~~(.*?)~~/g, '$1')                 // strikethrough (double ~)
        .replace(/~(.*?)~/g, '$1')                   // strikethrough (single ~)
        .replace(/`([^`]+)`/g, '$1')                 // inline code
        // .replace(/^\s*[-*+] /, '')                   // unordered list marker
        // .replace(/^\s*\d+\.\s/, '')                  // ordered list marker
        // .replace(/\[(x|\s)\]/gi, '')                 // checkboxes
        .replace(/^(#{1,6})\s*/, '')                 // heading markers
        .replace(/<[^>]*>/g, '')                     // HTML tags
        .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, '$1') // escaped markdown chars
        .trim();
}

export function getTitle(note: string): string {
    const lines = note.split("\n").map(line => line.trim());

    // Regex to match Markdown headings
    const headingRegex = /^(#{1,6})\s+(.*)/;

    // Try to find the first heading line
    for (const line of lines) {
        const match = line.match(headingRegex);
        if (match) {
            return stripMarkdown(match[2]);
        }
    }

    // Fallback: first non-empty line
    const fallback = lines.find(line => line.length > 0);
    return fallback ? stripMarkdown(fallback) : "";
}


export function highlightMarkdown(line: string): string {
    let escaped = escapeHtml(line);

    // Headings (prioritized first)
    escaped = escaped.replace(/^(###### )(.*)/, '<span class="heading heading-6">$1$2</span>');
    escaped = escaped.replace(/^(##### )(.*)/, '<span class="heading heading-5">$1$2</span>');
    escaped = escaped.replace(/^(#### )(.*)/, '<span class="heading heading-4">$1$2</span>');
    escaped = escaped.replace(/^(### )(.*)/, '<span class="heading heading-3">$1$2</span>');
    escaped = escaped.replace(/^(## )(.*)/, '<span class="heading heading-2">$1$2</span>');
    escaped = escaped.replace(/^(# )(.*)/, '<span class="heading heading-1">$1$2</span>');

    // Horizontal rule (must be before list detection)
    escaped = escaped.replace(/^(\*\*\*|___|---)\s*$/, '<span class="horizontal-rule">$1</span>');

    // Inline styles
    escaped = escaped.replace(/(\*\*[^*]+\*\*)/g, '<span class="bold">$1</span>');
    escaped = escaped.replace(/(\*[^*]+\*)/g, '<span class="italic">$1</span>');
    escaped = escaped.replace(/(_[^_]+_)/g, '<span class="italic">$1</span>');
    escaped = escaped.replace(/(~[^~]+~)/g, '<span class="strike">$1</span>');
    escaped = escaped.replace(/(`[^`]+`)/g, '<span class="code">$1</span>');

    // Block quote
    escaped = escaped.replace(/(&gt; .*)/g, '<span class="quote">$1</span>');

    // Lists (after horizontal rule)
    // escaped = escaped.replace(/^(\d+\.\s)(.*)/g, '<span class="ordered-list-item">$1$2</span>');
    // escaped = escaped.replace(/^(-|\*|\+)\s(.*)/g, '<span class="list-item">$1 $2</span>');

    // Checkboxes
    // escaped = escaped.replace(/\[x\](\s.*)/gi, '<span class="checkbox" data-checked="true">[x]$1</span>');
    // escaped = escaped.replace(/\[\s\](\s.*)/g, '<span class="checkbox" data-checked="false">[ ]$1</span>');

    return escaped;
}


export function timeAgo(timestamp: number): string {
	const now = Date.now();
	const diff = Math.floor((now - timestamp) / 1000); // in seconds

	if (diff < 5) return "just now";
	if (diff < 60) return `${diff} second(s) ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)} day(s) ago`;

	const date = new Date(timestamp);
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}