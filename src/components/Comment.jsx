import PropTypes from "prop-types";
import { useToasts } from "react-toast-notifications";
import { toggleLike } from "../api";
import styles from "../styles/home.module.css";

const Comment = ({ comment }) => {
  //console.log("comment : ", comment);

  const { addToast } = useToasts();

  const handleCommentLikeClick = async () => {
    const response = await toggleLike(comment._id, "Comment");

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
    <div className={styles.postCommentsItem}>
      <div className={styles.postCommentHeader}>
        <span className={styles.postCommentAuthor}>{comment.user.name}</span>
        <span className={styles.postCommentTime}>a minute ago</span>
        <span className={styles.postCommentLikes}>{comment.likes.length}</span>
      </div>

      <div className={styles.postCommentContent}>{comment.content}</div>
      <div className={styles.postActions}>
        <div className={styles.postLike}>
          <button onClick={handleCommentLikeClick}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1029/1029132.png"
              alt="likes-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

Comment.prototype = {
  comment: PropTypes.array.isRequired,
};

export default Comment;
