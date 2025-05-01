const mapPostsToNews = ({
  order,
  posts,
}: {
  order: string[];
  posts: any[];
}) => {
  return order
    .map((postId) => posts[postId])
    .filter(({ delete_at, type }) => !delete_at && !type)
    .map(({ id, message, create_at }) => {
      return {
        id,
        message,
        date: create_at,
      };
    });
};

export const fetchNews = async () => {
  const response = await fetch(process.env.MATTERMOST_CHANNEL_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return mapPostsToNews(data);
};
