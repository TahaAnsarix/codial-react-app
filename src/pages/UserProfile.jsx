import styles from "../styles/settings.module.css";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useEffect, useState } from "react";
import { addFriend, getUserById, removeFriend } from "../api";
import { Loader } from "../components";
import { useAuth } from "../hooks";

const UserProfile = () => {
  const auth = useAuth();
  //console.log("auth", auth);
  const [user, setUser] = useState({});
  //const location = useLocation();
  //console.log("user : ", user);
  //const { user = {} } = location.state;
  const [loading, setLoading] = useState(true);
  //get the userId from URL
  const { userId } = useParams();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [requestInProgress, setRequestInProgress] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      //call the API to get the user details based on the userId fetched from the useParams hook
      const response = await getUserById(userId);

      if (response.success) {
        setUser(response.data.user);
      } else {
        addToast(response.message, {
          appearance: "error",
        });
        return navigate("/");
      }
      setLoading(false);
    };
    getUser();
  }, [userId, addToast, navigate]);

  if (loading) {
    return <Loader />;
  }

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);

    const response = await addFriend(userId);
    console.log("response : ", response);

    if (response.success) {
      const { friendship } = response.data;
      auth.updateFriendship(true, friendship);
      addToast("Friend added successfully!", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }

    setRequestInProgress(false);
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);

    const response = await removeFriend(userId);
    //console.log("response : ", response);

    if (response.success) {
      //const { friendship } = response.data;
      const friendship = auth.user.friendships.filter(
        (friend) => friend.to_user._id === userId
      );
      auth.updateFriendship(false, friendship[0]);
      addToast("Friend removed successfully!", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }

    setRequestInProgress(false);
  };

  const checkIfUserIsAFriend = () => {
    //In the user state there's friendships array which contains friends of curerntly logged in users
    //We are checking if the current user profile is friends with the logged in user
    //So, we are fetcing the friendships array and fetching all the ids from the array which are friends with logged in user
    const friends = auth.user.friendships;
    const friendsUserIds = friends.map((friend) => friend.to_user._id);

    //Check if currently loaded user's profile's id is in the the friendships array
    const index = friendsUserIds.indexOf(userId);

    if (index !== -1) {
      //Currently loaded user profile is friends with the logged in user, return true
      return true;
    }

    //Currently loaded user profile is not friends with the logged in user, return false
    return false;
  };

  //const showAddFriendsBtn = checkIfUserIsAFriend();

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          alt=""
        />
      </div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user?.email}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>
        <div className={styles.fieldValue}>{user?.name}</div>
      </div>
      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={styles.saveBtn}
            onClick={handleRemoveFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? "Removing friend" : "Remove Friend"}
          </button>
        ) : (
          <button
            className={styles.saveBtn}
            onClick={handleAddFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? "Adding friend" : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
