import { marked } from "marked"    // TODO: use nano-markdown instead?
import DOMPurify from "isomorphic-dompurify"  // TODO: other sanitizers smaller, quicker?

// These parsers are used on modal content to render markdown and sanitize inputs.
// Support for custom HTML markup based on contents is also performed here using render rules.

// This URL-matching regex has the most positives with the least false negatives, and is compact
// See @Stephanay https://mathiasbynens.be/demo/url-regex
// I've modified it to ensure that it doesn't duplicate work from already annotated markdown URLs.
// const URL_MATCH = new RegExp("(?<url>@^(https?|ftp)://[^\s/$.?#].[^\s]*$@iS)");
const URL_MATCH = /(?<!\]\()(?<url>@^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$@iS)/g;

// Rendering helpers
// Pipe implementation to chain steps we might add to the content renderer
// https://www.freecodecamp.org/news/pipe-and-compose-in-javascript-5b04004ac937/
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

/* Operations */

// Convert matched raw URLs to a markdown link, to guarantee the conversion of links to anchored HTML hrefs
// e.g. "https://sfu.ca" -> "[https://sfu.ca](https://sfu.ca)"
// TODO: support URLs without `http[s]://`?
export const urlToMarkdownLink = (content) => content.replace(URL_MATCH, (_, value) => `[${value}](${value})`)

// Replace operation using the named capture group "url"
// const str = "Visit [my site](https://example.com) or directly go to https://example.org";
// urlToClickableAnchor(str) == `Visit [my site](https://example.com) or directly go to <a href="https://example.org">https://example.org</a>`
export const urlToClickableAnchor = content => content.replace(URL_MATCH, (_, url) => `<a href="${url}">${url}</a>`);

// Put the renderers and the sanitizers on the pre- or post-process pipes
const preprocess = content => pipe(
    urlToMarkdownLink
)(content)
const postprocess = content => pipe(
    // urlToClickableAnchor,
    DOMPurify.sanitize  // NOTE: make keep this as the last command in the pipe for safety!
)(content)

const MARKDOWN_RENDER = marked.use({
    hooks: { 
        preprocess,
        postprocess
     }
})

// export the function using our customized markdown parser only
export const renderContent = content => MARKDOWN_RENDER.parse(content)