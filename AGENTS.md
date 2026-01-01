# AGENTS.md for the blog

## General info

The repo is a blog deployed on Vercel.

Articles are written in md format. Articles are converted to HTML by @11ty/eleventy".

The API exists to satisfy the SEO.
The API integrates also with Supabase to count likes for articles (by article slugs).
The API integrates with Brevo (formerly SendinBlue) for newsletter subscriptions via the Contacts API.
The API is written is typescript.

The layout for the articles is located in layouts/articles.njk.
The layout for the pages is located in layouts/main.njk.

The blog pages are located in "pages" folder.

The articles are located in "articles" folder.
Icons and CSS are located in public/icons and public/css.
CSS variables are extracted into a separate file: public/css/colors.css.
The article images are located in public/articles.
The JS file is located in public/js/main.js, it contains three components that extend the ArticleImage:
- ArticleImage (<article-image>)
- LikeContainer (<like-container>)
- BigNumber (<big-number value="2">)

## Newsletter Integration

The blog has newsletter subscription functionality integrated with Brevo API:

- API endpoint: `api/newsletter.ts` - handles POST requests to subscribe emails to Brevo contacts
- Environment variable: `BREVO_KEY` - API key for Brevo authentication
- Two newsletter forms are available:
  - Navigation form: Located in `layouts/main.njk` within the `main-nav` element, visible only on screens >= 960px
  - Footer form: Located in `layouts/main.njk` within the footer, visible on all screen sizes
- JavaScript: Newsletter form handling is in `public/js/main.js` with the `initNewsletterForm` function
- Styling: Newsletter form styles are in `public/css/style.css` using the color palette from `public/css/colors.css`

## How to edit/format articles

- Fix typos
- Fix grammar
- Smooth sentences to make them sound more natural
- Wrap words in `` when the name is related to a keyword/programming (like a class, function name, etc.)
- Bold sentances that are important and sound like a summary
- Make words italic for proper names or more difficult names or for acronyms (like GDPR, CQRS, PII, etc.)
