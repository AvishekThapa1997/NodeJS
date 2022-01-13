import * as feedService from "../../services/feed/feedService.js";
import * as authService from "../../services/auth/authService.js";
import * as util from "../../utils/util.js";
import rootDirName from "../../rootDirectory.js";
import * as path from "path";
export const getPosts = async (req, res, next) => {
  const page = req.query.page ?? 1;
  const offset = (page - 1) * util.ITEM_PER_PAGE;
  try {
    let _totalNoOfPosts = await feedService.getAllPostCountOf(req.userId);
    const posts = await feedService.getAllPostOf(offset, req.userId);
    const transformedPost = posts.map((post) => {
      return {
        _id: post._id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        creator: {
          _id: post.user._id,
          name: post.user.name,
        },
      };
    });
    res.status(200).json({
      posts: transformedPost,
      totalItems: _totalNoOfPosts,
    });
  } catch (err) {
    util.setDbError(err);
    next(err);
  }
  // feedService
  //   .getAllPostCountOf(req.userId)
  //   .then((noOfPost) => {
  //     _totalNoOfPosts = noOfPost;
  //     return feedService.getAllPostOf(offset, req.userId);
  //   })
  //   .then((posts) => {
  //     const transformedPost = posts.map((post) => {
  //       return {
  //         _id: post._id,
  //         title: post.title,
  //         content: post.content,
  //         imagegUrl: post.imageUrl,
  //         createdAt: post.createdAt,
  //         updatedAt: post.updatedAt,
  //         creator: {
  //           _id: post.user._id,
  //           name: post.user.name,
  //         },
  //       };
  //     });
  //     res.status(200).json({
  //       posts: transformedPost,
  //       totalItems: _totalNoOfPosts,
  //     });
  //   })
  //   .catch((err) => {
  //     util.setDbError(err);
  //     next(err);
  //   });
};

export const createPost = async (req, res, next) => {
  if (!req.file) {
    util.throwError(422, "No Image Provided");
  }
  const { title, content } = req.body;
  const post = { title, content, imageUrl: req.file.path.replace("\\", "/") };
  try {
    const newPost = await feedService.createPost(post, req.userId);
    const user = await authService.getUserById(req.userId);
    res.status(201).json({
      message: "Successfull Created",
      post: {
        ...newPost,
        creator: {
          name: user.name,
        },
      },
    });
  } catch (err) {
    util.setDbError(err);
    next(err);
  }
  // feedService
  //   .createPost(post, req.userId)
  //   .then((data) => {
  //     res.status(201).json({
  //       message: "Successfull Created",
  //       post: {
  //         ...data,
  //         creator: {
  //           name: "Avishek Thapa",
  //         },
  //       },
  //     });
  //   })
  //   .catch((err) => {
  //     util.setDbError(err);
  //     next(err);
  //   });
};
export const getUserStatus = (req, res, next) => {
  const userId = req.userId;
  feedService
    .getStatusOf(userId)
    .then((_status) => {
      const resStatus = {};
      if (!_status) {
        resStatus.status = "";
        res.status(200).json({
          status: resStatus,
        });
      } else {
        resStatus.status = _status.status;
        resStatus._id = _status._id;
        resStatus.userId = _status.userId;
        res.status(200).json({
          status: resStatus,
        });
      }
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};
export const getPost = (req, res, next) => {
  const postId = req.params.postId;
  feedService
    .getPostById(postId)
    .then((post) => {
      if (!post) {
        util.throwError(404, "Could not find post.");
      }
      res.status(200).json({
        post: post,
      });
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};
export const updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const { title, content, image } = req.body;
  console.log("========REQUEST========", image);
  let imageUrl = image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    util.throwError(422, "No Image Provided");
  }
  console.log("========AFTER========", image);
  let _post;
  feedService
    .getPostById(postId)
    .then((post) => {
      if (!post) {
        util.throwError(404, "Post Not Found!");
      }
      if (post.userId !== req.userId) {
        util.throwError(401, "Not Authorized.");
      }
      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl);
      }
      _post = post;
      return post._id;
    })
    .then((postId) => {
      return feedService.updatePostById(postId, {
        title,
        content,
        imageUrl,
      });
    })
    .then(() => {
      res.status(200).json({
        message: "Updated Successfully",
        post: {
          ..._post.dataValues,
          creator: {
            name: "Avishek Thapa",
          },
        },
      });
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};

export const updateStatus = (req, res, next) => {
  const _status = req.body.status;
  const statusId = req.query.id;
  console.log(statusId);
  const userId = req.userId;
  let prevStatus;
  feedService
    .getStatusById(statusId)
    .then((status) => {
      prevStatus = status;
      return authService.getUserById(userId);
    })
    .then((user) => {
      if (!user || (prevStatus?.id && user._id !== prevStatus.id)) {
        return res.status(401).send({
          message: "Not Authorized",
        });
      }
      if (!prevStatus) {
        return user.createStatus({
          status: _status,
        });
      }
      return feedService.updateStatusOf(user._id, prevStatus._id, _status);
    })
    .then((newStatus) => {
      if (newStatus) {
        return res.status(200).json({
          message: "Status Updated Successfully!",
        });
      }
      throw new Error("Something Went Wrong!");
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};
export const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  feedService
    .getPostById(postId)
    .then((post) => {
      if (!post) {
        util.throwError(404, "Post Not Found!");
      }
      if (post.userId !== req.userId) {
        util.throwError(401, "Not Authorized");
      }
      _post = post;
      return post;
    })
    .then((post) => {
      clearImage(post.imageUrl);
      return feedService.deletePost(post._id);
    })
    .then(() => {
      res.status(200).json({
        message: "Successfull Deleted",
      });
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};
const clearImage = (imagePath) => {
  util.deleteImage(path.join(rootDirName, imagePath));
};
