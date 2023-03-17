import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import styles from "../styles/login.module.css";
//import { login } from "../api";
import { useAuth } from "../hooks";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const { addToast } = useToasts();
  const auth = useAuth();
  console.log(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoggingIn(true);

    if (!email || !password) {
      setLoggingIn(false);
      return addToast("Please add both email and password", {
        appearance: "error",
      });
    }

    const response = await auth.login(email, password);

    if (response.success) {
      addToast("Successfully logged in", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }
    setLoggingIn(false);
  };

  if (auth.user) {
    return <Navigate to="/" />;
    //return;
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <span className={styles.loginSignupHeader}>Login</span>

      <div className={styles.field}>
        <input
          type="email"
          name=""
          id=""
          placeholder="Email"
          //required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <input
          type="password"
          name=""
          id=""
          placeholder="Password"
          //required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <button disabled={loggingIn}>
          {loggingIn ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default Login;
