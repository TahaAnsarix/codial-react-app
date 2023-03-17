import { useContext, useEffect, useState } from "react";
import { AuthContext, PostsContext } from "../providers";
import {
  login as userLogin,
  register,
  edit as editUser,
  getFriends,
  getPosts,
} from "../api";
import jwt from "jwt-decode";

import {
  getItemFromLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "../utils";

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Since the global user state does not have the friendships array by default
  //Hence, we need to fetch the friendships array and set it in the global user state
  //So, that our friendships list is not empty upon the first render
  useEffect(() => {
    const getUser = async () => {
      // console.log(
      //   "Inside useEffect to add freindships array to the global user state"
      // );
      //Get the token of the logged in user from the local storage
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

      if (userToken) {
        //Decode the the JWT to get the user information
        const user = jwt(userToken);

        let friends = await getUserFriends();

        setUser({
          ...user,
          friendships: friends,
        });

        // setUser(user);

        //console.log("user : ", user);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  //Login
  const login = async (email, password) => {
    //call the API
    const response = await userLogin(email, password);

    if (response.success) {
      //Set the user in the global user state
      //console.log("response.data", response.data);

      const friends = await getUserFriends();
      //console.log("friends : ", friends);

      setUser({
        ...response.data.user,
        friendships: friends,
      });
      //sets the user token in their local storage
      //LOCALSTORAGE_TOKEN_KEY is key
      //response.data.token is value
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const logout = () => {
    //Remove the user from the global state and delete the token from their local storage
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };
  const signup = async (user, email, password, confirmPassword) => {
    //Calls the API and registers the user with following details
    const response = await register(user, email, password, confirmPassword);
    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const edit = async (id, password, confirmPassword, name) => {
    //Calls the editUser API and change the existing details of the user with the following details
    const response = await editUser(id, password, confirmPassword, name);
    //console.log("response : ", response);

    if (response.success) {
      //Since user is successfully updated in the DB, hence their JWT also updated
      //we need to update our global user state inorder to reflect the changes just made to the user
      //Since, user details changed hence the JWT changed, update the token in the local storage as well
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const updateFriendship = (addFriend, friend) => {
    //This function is to add or remove friends based upon the flag addFriend
    //console.log("friend", friend);
    if (addFriend) {
      //Adding a new friend in the global state
      //set all the existing friends and then add the new friend
      setUser({
        ...user,
        friendships: [...user.friendships, friend],
      });
      return;
    } else {
      //Removing an esisting friend
      //Create a new array by filtering the friend who has been just removed
      const newFriends = user.friendships.filter(
        (f) => f.to_user._id !== friend.to_user._id
      );
      setUser({
        ...user,
        friendships: newFriends,
      });
    }
  };

  return {
    user,
    login,
    logout,
    loading,
    signup,
    edit,
    updateFriendship,
  };
};

const getUserFriends = async () => {
  const response = await getFriends();

  //console.log("response.data", response.data);

  let friends = [];
  if (response.success) {
    friends = response.data.friends;
  }

  return friends;
};

export const usePosts = () => {
  return useContext(PostsContext);
};

export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  //This effect sets the posts globally in the global posts state
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();
      //console.log("response", response);

      if (response.success) setPosts(response.data.posts);

      setLoading(false);
    };
    fetchPosts();
  }, []);

  //This function adds the newly created post at the top of all the posts and re-renders the dom
  const addPostToState = (post) => {
    const newPost = [post, ...posts]; //adds new post then spreads rest of the posts
    setPosts(newPost);
  };

  const addCommentToState = (comment, postId) => {
    const newPosts = posts.map((post) => {
      if (post._id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });

    setPosts(newPosts);
  };

  return {
    data: posts,
    loading,
    addPostToState,
    addCommentToState,
  };
};
