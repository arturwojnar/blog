export const useSeo = () => {
  const route = useRoute();

  const setPageSeo = (options: {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    type?: "website" | "article";
    publishedTime?: string;
    author?: string;
  }) => {
    const {
      title,
      description,
      image,
      canonical,
      type = "website",
      publishedTime,
      author = "Artur Wojnar",
    } = options;

    const baseUrl = "https://www.knowhowcode.dev";
    const fullUrl = `${baseUrl}${route.path}`;
    const pageTitle = title
      ? `${title} | Know-How Code`
      : "Know-How Code by Artur Wojnar";

    const metaTags = [
      { name: "description", content: description },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonical || fullUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@arturwojnar" },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: description },
    ];

    const linkTags = [{ rel: "canonical", href: canonical || fullUrl }];

    if (image) {
      metaTags.push(
        { property: "og:image", content: image },
        { name: "twitter:image", content: image }
      );
    }

    if (type === "article" && publishedTime) {
      metaTags.push(
        { property: "article:published_time", content: publishedTime },
        { property: "article:author", content: author }
      );
    }

    // Performance: Add preconnect links for external resources
    linkTags.push(
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "dns-prefetch", href: "https://plausible.io" }
    );

    useHead({
      title: pageTitle,
      meta: metaTags,
      link: linkTags,
    });
  };

  const setArticleSeo = (article: {
    title: string;
    description: string;
    date?: string;
    cover?: string;
    canonical?: string;
  }) => {
    setPageSeo({
      title: article.title,
      description: article.description,
      image: article.cover,
      canonical: article.canonical,
      type: "article",
      publishedTime: article.date
        ? new Date(article.date).toISOString()
        : undefined,
    });
  };

  return {
    setPageSeo,
    setArticleSeo,
  };
};
