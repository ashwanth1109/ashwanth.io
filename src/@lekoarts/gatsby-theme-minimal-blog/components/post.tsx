/** @jsx jsx */
import * as React from "react";
import { jsx, Heading } from "theme-ui";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout";
import ItemTags from "@lekoarts/gatsby-theme-minimal-blog/src/components/item-tags";
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo";
import { useEffect, useState } from "react";
import { useClientDimensions } from "react-client-dimensions";
import { VIDEO_RATIO } from "../../../constants";

type PostProps = {
  data: {
    post: {
      slug: string;
      title: string;
      date: string;
      tags?: {
        name: string;
        slug: string;
      }[];
      description?: string;
      canonicalUrl?: string;
      body: string;
      excerpt: string;
      timeToRead?: number;
      banner?: {
        childImageSharp: {
          resize: {
            src: string;
          };
        };
      };
    };
  };
};

const px = [`32px`, `16px`, `8px`, `4px`];
const shadow = px.map((v) => `rgba(0, 0, 0, 0.15) 0px ${v} ${v} 0px`);

const Post = ({ data: { post } }: PostProps) => {
  const [prevVw, setPrevVw] = useState(0);
  const { vw } = useClientDimensions();

  useEffect(() => {
    if (prevVw === vw) {
      return;
    }
    setPrevVw(vw);
    const videoFrameClass = document.getElementsByClassName(
      "embedVideo-iframe"
    ) as HTMLCollectionOf<HTMLElement>;
    if (videoFrameClass?.length !== 0) {
      if (vw < 1000) {
        videoFrameClass[0].style.width = `calc(100% - 1rem)`;
        videoFrameClass[0].style.height = `${vw / VIDEO_RATIO}px`;
      } else {
        videoFrameClass[0].style.width = `1000px`;
        videoFrameClass[0].style.height = `${1000 / VIDEO_RATIO}px`;
      }
    }
  }, [vw]);

  return (
    <Layout>
      <Seo
        title={post.title}
        description={post.description ? post.description : post.excerpt}
        image={post.banner ? post.banner.childImageSharp.resize.src : undefined}
        pathname={post.slug}
        canonicalUrl={post.canonicalUrl}
      />
      <Heading as="h1" variant="styles.h1">
        {post.title}
      </Heading>
      <p
        sx={{
          color: `secondary`,
          mt: 3,
          a: { color: `secondary` },
          fontSize: [1, 1, 2],
        }}
      >
        <time>{post.date}</time>
        {post.tags && (
          <React.Fragment>
            {` — `}
            <ItemTags tags={post.tags} />
          </React.Fragment>
        )}
        {post.timeToRead && ` — `}
        {post.timeToRead && <span>{post.timeToRead} min read</span>}
      </p>
      <section
        sx={{
          my: 5,
          ".gatsby-resp-image-wrapper": {
            my: [4, 4, 5],
            boxShadow: shadow.join(`, `),
          },
          variant: `layout.content`,
        }}
      >
        <MDXRenderer>{post.body}</MDXRenderer>
      </section>
    </Layout>
  );
};

export default Post;
