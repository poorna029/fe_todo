import React, { useState } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Success from "../Success";
import styles from "./Register.module.css";
import { DNA } from "react-loader-spinner";
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const Signup = () => {
  const FetchConstants = {
    initial: "INITIAL",
    loading: "LOADING",
    success: "SUCCESS",
    failure: "FAILURE",
  };
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    location: "",
    fetchStatus: FetchConstants.initial,
    msg: "",
    isSuccess: false,
  });

  const [errors, setErrors] = useState({});
  const his = useHistory();
  if (Cookies.get("jwt")) {
    return <Redirect to="/todolist" />;
  }
  const handleChange = (e) => {
    setFormData({ ...formData, gender: "Male", [e.target.id]: e.target.value });
  };
  let response;
  let d = "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handler handling");

    // Validate inputs
    const errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.location) {
      errors.location = "Location is required";
    }
    console.log(formData, errors);

    if (Object.keys(errors).length === 0) {
      const data = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        gender: formData.gender,
        location: formData.location,
      };
      try {
        // Send form data to the server
        setFormData((pre) => ({ ...pre, fetchStatus: FetchConstants.loading }));

        response = await fetch("https://be-todos-app.onrender.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        d = await response.json();

        console.log(response, formData);
        if (response.ok) {
          setFormData((pre) => ({
            ...pre,
            fetchStatus: FetchConstants.success,
            isSuccess: true,
            msg: d.data,
          }));
        }

        setFormData({
          name: "",
          username: "",
          password: "",
          confirmPassword: "",
          gender: "",
          location: "",
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormData((pre) => ({
          ...pre,
          fetchStatus: FetchConstants.failure,
          msg: d.err,
        }));
        // Handle error (e.g., display error message to user)
      } finally {
        if (!response.ok) {
          setFormData((pre) => ({
            ...pre,
            fetchStatus: FetchConstants.failure,
            msg: d.err,
            isSuccess: response.ok,
          }));
        } else {
          setTimeout(() => {
            <Success data={d.data} />;
            his.push("/login");
          }, 10000);
        }
      }
    } else {
      // If there are errors, update state to display errors to the user
      setErrors(errors);
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

  return (
    <div className={styles.main}>
      <form className={styles.sign_up} onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className={styles.input_container}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            className={styles.input}
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}{" "}
        </div>
        <div className={styles.input_container}>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            className={styles.input}
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <span className={styles.error}>{errors.username}</span>
          )}
        </div>

        <div className={styles.input_container}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            className={styles.input}
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <div className={styles.input_container}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <br />
          <input
            className={styles.input}
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>

        <div className={styles.gender_container}>
          <label className={styles.gender1}>Gender:</label>
          <br />
          <div className={styles.gender}>
            <div className={styles.gender_label_input_container}>
              <input
                className={styles.radio}
                type="radio"
                name="gender"
                id="genderMale"
                value="Male"
                checked
                onChange={handleChange}
              />
              <label htmlFor="genderMale">Male</label>
            </div>
            <div className={styles.gender_label_input_container}>
              <input
                className={styles.radio}
                type="radio"
                name="gender"
                id="genderFemale"
                value="Female"
                onChange={handleChange}
              />
              <label htmlFor="genderFemale">Female</label>
            </div>
          </div>
          {errors.gender && (
            <span className={styles.error}>{errors.gender}</span>
          )}
        </div>

        <div className={styles.location_input_container}>
          <label htmlFor="location">Location:</label>
          <br />
          <input
            className={styles.input}
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && (
            <span className={styles.error}>{errors.location}</span>
          )}
        </div>

        <input className={styles.b} type="submit" value="Submit" />

        <div className={styles.paragraph}>
          <p> Already registered? </p>
          <Link to="/login">Login</Link>
        </div>
        {formData.failure ? (
          <p className={formData.isSuccess ? styles.success : styles.failure}>
            {d.data}
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default Signup;
