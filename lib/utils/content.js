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
// TODO: support URLs without `http[s]://`?
export const urlToMarkdownLink = (content) =>
  content.replace(URL_MATCH, (_, value) => `[${value}](${value})`);

// Replace operation using the named capture group "url"
// const str = "Visit [my site](https://example.com) or directly go to https://example.org";
// urlToClickableAnchor(str) == `Visit [my site](https://example.com) or directly go to <a href="https://example.org">https://example.org</a>`

// DEPRECATED
// export const urlToClickableAnchor = (content) => {
//   const url_match_results = linkify.match(content);
//   const url_matches = url_match_results !== null ? [...new Set(url_match_results.map(umr => umr.url))] : [];
//   const replace_consecutively = (matches, string) => {
//     const [match, ...rest] = matches;
//     return matches.length == 0 ? 
//         string 
//         // Use a global RegExp to ensure all unique replacements are made together at once
//       : replace_consecutively(rest, string.replace(new RegExp(match, 'g'), `<a href="${match}">${match}</a>`));
//   };
//   return replace_consecutively(url_matches, content);
// };
// export const urlToClickableAnchor = (string) => {
//   const matches = linkify.match(string);

//   if (!matches) {
//     return string; // No links found, return the original string
//   }

//   // Start from the end to not mess up the indices
//   for (let i = matches.length - 1; i >= 0; i--) {
//     const match = matches[i];
//     string = string.slice(0, match.index) +
//              `<a href="${match.url}">${formatEscapeHTML(match.text)}</a>` +
//              string.slice(match.index + match.text.length);
//   }

//   return string;
// };

export const urlToClickableAnchor = (string) => {
  // Use linkify to find all URLs in the string
  const matches = linkify.match(string);

  // If no URLs found, return the original string
  if (!matches) {
    return string;
  }

  // Create a set of unique URLs to avoid duplicate replacements
  const uniqueMatches = [...new Set(matches.map(match => match.url))];

  // Replace all occurrences of each unique URL with an anchor tag
  uniqueMatches.forEach((url) => {
    // Escape the URL to safely create a regex pattern
    const escapedURL = escapeHTML(url);
    // Create a global regular expression to match all occurrences of the URL
    const regex = new RegExp(escapedURL.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    // Replace the URL with an anchor tag in the string
    string = string.replace(regex, `<a href="${escapedURL}">${escapedURL}</a>`);
  });

  return string;
};

/* Renderer */

const MARKDOWN_RENDER = (content) => md.render(content);

// export the function using our customized markdown parser only
export const renderContent = (content) => MARKDOWN_RENDER(content);
