import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Login.module.css";
import { DNA } from "react-loader-spinner";

const Login = () => {
  var data = "";
  const FetchConstants = {
    initial: "INITIAL",
    loading: "LOADING",
    success: "SUCCESS",
    failure: "FAILURE",
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fetchStatus: FetchConstants.initial,
    msg: "",
    isSuccess: "",
  });
  const a = useHistory();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSuccess = (cookie) => {
    Cookies.set("jwt", cookie);

    a.push("/todolist");
    // <Redirect to="/todolist" />
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const errors = {};
    if (!formData.username) {
      errors.username = "*Username is required";
    }
    if (!formData.password) {
      errors.password = "*Password is required";
    }
    let res;
    if (Object.keys(errors).length === 0) {
      try {
        // Send form data to the server
        setFormData((pre) => ({ ...pre, fetchStatus: FetchConstants.loading }));
        const { username, password } = formData;
        const newObj = { username, password };
        console.log(newObj);
        const options = {
          method: "POST",
          body: JSON.stringify(newObj),
          headers: {
            "Content-Type": "application/json",
          },
        };

        res = await fetch("https://be-todos-app.onrender.com/login", options);
        console.log(res, "res1");
        data = await res.json();
        if (res.ok) {
          handleSuccess(data.jwtToken);
          setFormData((pre) => ({
            ...pre,
            fetchStatus: FetchConstants.success,
            msg: data.data,
          }));
        } else {
          console.log(res, data, data.jwtToken, "res2");
          setFormData((pre) => ({
            ...pre,
            fetchStatus: FetchConstants.failure,
            msg: data.err,
          }));
        }

        // Clear form data (optional)
        setFormData({
          username: "",
          password: "",
        });
      } catch (error) {
        console.log(error, "res3");

        setFormData((pre) => ({
          ...pre,
          fetchStatus: FetchConstants.failure,
          msg: data.err,
        }));

        // Handle error (e.g., display error message to user)
      }
    } else {
      // If there are errors, update state to display errors to the user
      setErrors(errors);
      setFormData((pre) => ({ ...pre, fetchStatus: FetchConstants.failure }));
    }
  };

  const renderJobItemDetailsLoadingView = () => (
    <div className={styles.loader_container} data-testid="loader">
      <DNA
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );

  if (formData.fetchStatus === "LOADING") {
    return renderJobItemDetailsLoadingView();
  }
  if (formData.isSuccess && formData.isSuccess !== "") {
    console.log(formData, "success");
  } else {
    console.log(formData, "fall");
  }

  return (
    <div className={styles.login_main}>
      <form className={styles.login} onSubmit={handleSubmit}>
        <h2 className={styles.h2}>Login</h2>
        <div className={styles.input_containe}>
          <label htmlFor="username">UserName:</label>
          <br />
          <input
            className={styles.input}
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter UserName"
          />
          {errors.username && (
            <span className={styles.error}>{errors.username}</span>
          )}
        </div>

        <div className={styles.input_containe}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            className={styles.input}
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <input className={styles.but_style} type="submit" value="Submit" />

        <div className={styles.notification}>
          <p className={styles.not_register_para}>Not registered yet?</p>
          <Link to="/" className={styles.link}>
            SignUp
          </Link>
        </div>
        {!formData.isSuccess && formData.isSuccess !== "" && (
          <p className={styles.err}>*{data.err}</p>
        )}
        {formData.isSuccess && formData.isSuccess !== "" && (
          <p className={styles.suc}>*{data.data}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
