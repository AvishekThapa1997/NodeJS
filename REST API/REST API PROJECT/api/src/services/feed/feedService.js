import Post from "../../model/Post.js";
import Status from "../../model/Status.js";
import * as authService from "../auth/authService.js";
export const createPost = (post, userId) => {
  return authService.getUserById(userId).then((user) => {
    return user.createPost(post);
  });
  //return Post.save(post);
};
export const getAllPostOf = (offset, userId) => {
  return Post.getAllPostOf(offset, userId);
};

export const getStatusOf = (userId) => {
  return Status.getStatusOf(userId);
};
export const getAllPostCountOf = (userId) => {
  return Post.getAllPostCountOf(userId);
};
export const getPostById = (postId) => {
  return Post.getPostById(postId);
};

export const updatePostById = (postId, postUpdating) => {
  return Post.updatePostById(postId, postUpdating);
};

export const getStatusById = (statusId) => {
  return Status.getStatusById(statusId);
};
export const updateStatusOf = (userId, statusId, newStatus) => {
  return Status.updateStatus(userId, statusId, newStatus);
};
export const deletePost = (postId) => {
  return Post.deletePost(postId);
};
