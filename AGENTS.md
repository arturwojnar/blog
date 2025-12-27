# AGENTS.md for the blog

## General info

The repo is a blog deployed on Vercel.

Articles are written in md format. Articles are converted to HTML by @11ty/eleventy".

The API exists to satisfy the SEO.
The API integrates also with Supabase to count likes for articles (by article slugs).
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

## How to edit/format articles

- Fix typos
- Fix grammar
- Smooth sentences to make them sound more natural
- Wrap words in `` when the name is related to a keyword/programming (like a class, function name, etc.)
- Bold sentances that are important and sound like a summary
- Make words italic for proper names or more difficult names or for acronyms (like GDPR, CQRS, PII, etc.)