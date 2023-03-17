import styles from "../styles/home.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Comment } from "../components";
import { useState } from "react";
import { addComment, toggleLike } from "../api";
import { useToasts } from "react-toast-notifications";
import { usePosts } from "../hooks";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { addToast } = useToasts();
  const posts = usePosts();

  //console.log("post", post);

  const handleAddCommentEnter = async (e) => {
    if (e.key === "Enter") {
      setAddingComment(true);

      const response = await addComment(post._id, comment);

      if (response.success) {
        setComment("");
        posts.addCommentToState(response.data.comment, post._id);
        addToast("Comment Added successfully", {
          appearance: "success",
        });
      } else {
        addToast(response.message, {
          appearance: "error",
        });
      }

      setAddingComment(false);
    }
  };

  const handlePostLikeClick = async () => {
    const response = await toggleLike(post._id, "Post");

    if (response.success) {
      console.log("response.data : ", response.data);
      //posts.addLikeToState(response.data.comment, post._id);
      if (response.data.deleted) {
        addToast("Like removed successfully!", {
          appearance: "success",
        });
      } else {
        addToast("Like added successfully!", {
          appearance: "success",
        });
      }
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }
  };
  return (
    <div className={styles.postWrapper} key={`post-${post._id}`}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="user-pic"
          />
          <div>
            <Link
              to={`/user/${post.user._id}`}
              state={{
                user: post.user,
              }}
              className={styles.postAuthor}
            >
              {post.user.name}
            </Link>
            <span className={styles.postTime}>a minute ago</span>
          </div>
        </div>
        <div className={styles.postContent}>{post.content}</div>

        <div className={styles.postActions}>
          <div className={styles.postLike}>
            <button onClick={handlePostLikeClick}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1029/1029132.png"
                alt="likes-icon"
              />
            </button>
            <span>{post.likes.length}</span>
          </div>

          <div className={styles.postCommentsIcon}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2190/2190510.png"
              alt="comments-icon"
            />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div className={styles.postCommentBox}>
          <input
            placeholder="Start typing a comment"
            value={comment}
            disabled={addingComment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleAddCommentEnter}
          />
        </div>

        <div className={styles.postCommentsList}>
          {/* {<Comment comment={post.comments} />} */}
          {/* {console.log("post.comments", post.comments)} */}
          {post.comments.map((comment) => {
            return <Comment comment={comment} />;
          })}
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  posts: PropTypes.object.isRequired,
};

export default Post;
