import Head from "next/head";
import BlogCard from "../components/BlogCard";
import styles from "../styles/Home.module.css";
import { GraphQLClient, gql } from "graphql-request";

const hygraph = new GraphQLClient(process.env.HYGRAPH_CONTENT_API);

const QUERY = gql`
  {
    posts {
      id
      title
      datePublished
      slug
      content {
        html
      }
      author {
        name
        avatar {
          url
        }
      }
      coverPhoto {
        url
      }
    }
  }
`;

export async function getStaticProps() {
  const { posts } = await hygraph.request(QUERY);

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {posts.map(({ title, author, coverPhoto, datePublished, slug, id }) => (
          <BlogCard
            title={title}
            author={author}
            coverPhoto={coverPhoto}
            datePublished={datePublished}
            slug={slug}
            key={id}
          />
        ))}
      </main>
    </div>
  );
}
