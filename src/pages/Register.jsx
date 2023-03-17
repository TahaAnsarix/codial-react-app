import { useState } from "react";
import styles from "../styles/login.module.css";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registering, setRegistering] = useState(false);

  const { addToast } = useToasts();
  const auth = useAuth();
  console.log(auth);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setRegistering(true);

    if (!name || !email || !password || !confirmPassword) {
      setRegistering(false);
      return addToast(
        "Please add all the fields name, email,  password and confirm password",
        {
          appearance: "error",
        }
      );
    }

    if (password !== confirmPassword) {
      setRegistering(false);
      return addToast("password doesn't match with the confirm password", {
        appearance: "error",
      });
    }

    const response = await auth.signup(name, email, password, confirmPassword);

    if (response.success) {
      navigate("/login");
      addToast("Successfully registered in, please login", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }
    setRegistering(false);
  };

  if (auth.user) {
    return navigate("/");
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <span className={styles.loginSignupHeader}>Register</span>

      <div className={styles.field}>
        <input
          type="text"
          name=""
          id=""
          placeholder="Name"
          //required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

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
        <input
          type="password"
          name=""
          id=""
          placeholder="Confirm Password"
          //required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <button disabled={registering}>
          {registering ? "Registering user..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default Register;
