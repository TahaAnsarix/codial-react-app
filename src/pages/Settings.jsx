import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../hooks";
import styles from "../styles/settings.module.css";

const Settings = () => {
  const auth = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(auth.user?.name ? auth.user.name : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSavnig] = useState(false);
  const { addToast } = useToasts();

  const clearForm = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleOnSaveClick = async (e) => {
    e.preventDefault();
    setSavnig(true);
    console.log("Save button clicked");
    // console.log("name : ", name);
    // console.log("password : ", password);
    // console.log("confirmPassword : ", confirmPassword);
    // console.log("id : ", auth.user._id);

    if (!name || !password || !confirmPassword) {
      setSavnig(false);
      return addToast(
        "Please add all the fields name, email,  password and confirm password",
        {
          appearance: "error",
        }
      );
    }

    if (password !== confirmPassword) {
      setSavnig(false);
      return addToast("password doesn't match with the confirm password", {
        appearance: "error",
      });
    }

    const id = auth.user._id;
    const response = await auth.edit(id, password, confirmPassword, name);

    if (response.success) {
      //navigate("/login");

      setSavnig(false);
      setEditing(false);
      clearForm();

      return addToast("User details updated successfully", {
        appearance: "success",
      });
    } else {
      return addToast(response.message, {
        appearance: "error",
      });
    }
  };

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
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>
        {!editing && <div className={styles.fieldValue}>{name}</div>}
        {editing && (
          <input
            type="text"
            name=""
            id=""
            //placeholder="Name"
            //required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </div>
      {editing && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Password</div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Confirm password</div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}
      {!editing && (
        <div className={styles.btnGrp}>
          <button
            className={styles.editBtn}
            onClick={(e) => {
              setEditing(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      )}
      {editing && (
        <div className={styles.btnGrp}>
          <button className={styles.saveBtn} onClick={handleOnSaveClick}>
            {saving ? "Saving profile" : "Save"}
          </button>
          <button
            className={styles.goBack}
            onClick={() => {
              setEditing(false);
            }}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
