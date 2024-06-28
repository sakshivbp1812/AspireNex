// pages/[slug].js

import { useRouter } from 'next/router';

export async function getStaticPaths() {
  // Fetch data to determine dynamic paths
  const paths = [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
    // Add more paths as needed
  ];

  return {
    paths,
    fallback: false // or true or 'blocking' based on your needs
  };
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the component using params.slug
  const { slug } = params;
  // Example: Fetch data from CMS or API
  const postData = { title: `Post ${slug}`, content: 'Lorem ipsum...' };

  return {
    props: {
      postData
    }
  };
}

export default function Post({ postData }) {
  const router = useRouter();

  // Display loading state if data is not yet available
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{postData.title}</h1>
      <p>{postData.content}</p>
    </div>
  );
}
