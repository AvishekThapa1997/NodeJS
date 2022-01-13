export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First Post",
        description: "First Post Description",
      },
    ],
  });
};

export const createPost = (req, res, next) => {
  const { title, description } = req.body;
  res.status(201).json({
    message: "Successfull Created",
    result: {
      id: new Date().toISOString(),
      title,
      description,
    },
  });
};
