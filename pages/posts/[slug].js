import styles from "../../styles/Slug.module.css";
import { GraphQLClient, gql } from "graphql-request";

const hygraph = new GraphQLClient(process.env.HYGRAPH_CONTENT_API);

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;

const SLUG_LIST = gql`
  {
    posts {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { posts } = await hygraph.request(SLUG_LIST);

  return {
    paths: posts.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;

  const data = await hygraph.request(QUERY, { slug });
  const post = data.post;

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export default function BlogPost({ post }) {
  return (
    <main className={styles.blog}>
      <img
        src={post.coverPhoto.url}
        alt="Post Cover Photo"
        className={styles.cover}
      />
      <div className={styles.title}>
        <img src={post.author.avatar.url} alt="Author" />
        <div className={styles.authtext}>
          <h6>By {post.author.name}</h6>
          <h6 className={styles.date}>{post.datePublished}</h6>
        </div>
      </div>
      <h2>{post.title}</h2>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      ></div>
    </main>
  );
}
