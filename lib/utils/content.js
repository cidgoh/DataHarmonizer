import MarkdownIt from 'markdown-it';
import linkifyIt from 'linkify-it';
import { formatEscapeHTML } from './fields';

const linkify = linkifyIt();
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  breaks: true,
});

// These parsers are used on modal content to render markdown and sanitize inputs.
// Support for custom HTML markup based on contents is also performed here using render rules.

// This URL-matching regex has the most positives with the least false negatives, and is compact
// See @Stephanay https://mathiasbynens.be/demo/url-regex
// I've modified it to ensure that it doesn't duplicate work from already annotated markdown URLs.
// const URL_MATCH = new RegExp("(?<url>@^(https?|ftp)://[^\s/$.?#].[^\s]*$@iS)");
const URL_MATCH = /(?<!\]\()(?<url>@^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$@iS)/g;

/* Operations */

// Convert matched raw URLs to a markdown link, to guarantee the conversion of links to anchored HTML hrefs
// e.g. "https://sfu.ca" -> "[https://sfu.ca](https://sfu.ca)"
// NOTE: doesn't support URLs without `http[s]://` or `ftp`
export const urlToMarkdownLink = (content) =>
  content.replace(URL_MATCH, (_, value) => `[${value}](${value})`);

// Replace operation using the named capture group "url"
// const str = "Visit [my site](https://example.com) or directly go to https://example.org";
// urlToClickableAnchor(str) == `Visit [my site](https://example.com) or directly go to <a href="https://example.org">https://example.org</a>`

export const urlToClickableAnchor = (string) => {
  // Use linkify to find all URLs in the string
  if (!string) return ''; // Occurs when passed an undefined attribute.

  const matches = linkify.match(string);

  // If no URLs found, return the original string
  if (!matches) return string;

  // Create a set of unique URLs to avoid duplicate replacements
  const uniqueMatches = [...new Set(matches.map((match) => match.url))];

  // Replace all occurrences of each unique URL with an anchor tag
  uniqueMatches.forEach((url) => {
    // Escape the URL to safely create a regex pattern
    const escapedURL = formatEscapeHTML(url);
    // Create a global regular expression to match all occurrences of the URL
    const regex = new RegExp(
      escapedURL.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
      'g'
    );
    // Replace the URL with an anchor tag in the string
    string = string.replace(
      regex,
      `<a href="${escapedURL}" target="_blank">${escapedURL}</a>`
    );
  });

  return string;
};

/* Renderer */

const MARKDOWN_RENDER = (content) => md.renderInline(content);

// export the function using our customized markdown parser only
export const renderContent = (content) => MARKDOWN_RENDER(content);
