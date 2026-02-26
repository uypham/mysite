import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const posts = (await getCollection("blog")).filter((p) => !p.data.draft);

  return rss({
    title: "Uy Pham Blog",
    description: "Chia sẻ web dev của Uy",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
