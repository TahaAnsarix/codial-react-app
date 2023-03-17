import { API_URLS, getFormBody, LOCALSTORAGE_TOKEN_KEY } from "../utils";

const customFetch = async (url, { body, ...customConfig }) => {
  //get the token stored in the user's local machine
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const config = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    //body is an object and we can't send object to the fetch request
    //commenting below line since our body is no longer in JSON format
    //config.body = JSON.stringify(body);

    config.body = getFormBody(body);
  }
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (data.success) {
      return {
        data: data.data,
        success: true,
      };
    }

    throw new Error(data.message);
  } catch (error) {
    console.error("error : ", error);
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getPosts = (page = 1, limit = 5) => {
  return customFetch(API_URLS.posts(page, limit), {
    method: "GET",
  });
};

export const login = (email, password) => {
  return customFetch(API_URLS.login(), {
    method: "POST",
    body: {
      email,
      password,
    },
  });
};

export const register = (name, email, password, confirm_password) => {
  return customFetch(API_URLS.signup(), {
    method: "POST",
    body: {
      name,
      email,
      password,
      confirm_password,
    },
  });
};

export const edit = (id, password, confirm_password, name) => {
  return customFetch(API_URLS.editUser(), {
    method: "POST",
    body: {
      id,
      name,
      password,
      confirm_password,
    },
  });
};

export const getUserById = (id) => {
  return customFetch(API_URLS.userInfo(id), {
    method: "GET",
  });
};

export const getFriends = () => {
  return customFetch(API_URLS.friends(), {
    method: "GET",
  });
};

export const addFriend = (userId) => {
  return customFetch(API_URLS.createFriendship(userId), {
    method: "POST",
  });
};

export const removeFriend = (userId) => {
  return customFetch(API_URLS.removeFriend(userId), {
    method: "POST",
  });
};

export const addPost = (content) => {
  return customFetch(API_URLS.createPost(content), {
    method: "POST",
    body: {
      content,
    },
  });
};

export const addComment = (post_id, content) => {
  return customFetch(API_URLS.comment(), {
    method: "POST",
    body: {
      post_id,
      content,
    },
  });
};

export const toggleLike = (itemId, itemType) => {
  return customFetch(API_URLS.toggleLike(itemId, itemType), {
    method: "POST",
  });
};

export const searchUsers = (searchText) => {
  return customFetch(API_URLS.searchUsers(searchText), {
    method: "GET",
  });
};
