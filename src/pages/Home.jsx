import styles from "../styles/home.module.css";
//import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import { getPosts } from "../api";
import { CreatePost, FriendsList, Loader, Post } from "../components";
import { useNavigate } from "react-router-dom";
import { useAuth, usePosts } from "../hooks";

const Home = () => {
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  const posts = usePosts();

  if (!auth.user) {
    return navigate("/login");
  }

  if (posts.loading) {
    return <Loader />;
  }

  // if(!auth.user.friendships){

  // }
  //console.log("posts : ", posts);
  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        {auth.user && <CreatePost />}
        {posts.data.map((post) => {
          //console.log(post.user.name);
          return <Post post={post} />;
        })}
      </div>
      {auth.user && <FriendsList />}
    </div>
  );
};

// Home.propTypes = {
//   posts: PropTypes.array.isRequired,
// };

export default Home;
