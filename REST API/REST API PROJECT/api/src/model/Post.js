import { Model, DataTypes } from "sequelize";
import dbSetUp from "../utils/db/db.js";
import { ITEM_PER_PAGE } from "../utils/util.js";
import User from "./User.js";
class Post extends Model {
  static save(post) {
    return Post.create(post);
  }
  static getAllPostOf(offset, userId) {
    return Post.findAll({
      limit: ITEM_PER_PAGE,
      offset: offset,
      where: {
        userId: userId,
      },
      include: User,
    });
  }
  static getAllPostCountOf(userId) {
    return Post.count({
      where: {
        userId: userId,
      },
    });
  }
  static getPostById(postId) {
    return Post.findByPk(postId);
  }
  static updatePostById(postId, postUpdating) {
    return Post.update(
      {
        title: postUpdating.title,
        content: postUpdating.content,
        imageUrl: postUpdating.imageUrl,
      },
      {
        where: {
          _id: postId,
        },
      }
    );
  }
  static deletePost(postId) {
    return Post.destroy({
      where: {
        _id: postId,
      },
    });
  }
}
Post.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbSetUp,
    modelName: "post",
  }
);
export default Post;
