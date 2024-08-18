import { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import TodoItem from "../TodoItem";
import styles from "./TodoList.module.css";

class TodoList extends Component {
  state = {
    todos: [],
    text: "",
    count: 0,
    isEdit: false,
    editId: null,
    refresh: false,
  };

  onTodoAdd = (event) => {
    this.setState({ text: event.target.value });
  };

  componentDidMount = () => {
    this.get_todos();
  };

  confirmSubmission = () => {
    const confirmed = window.confirm("Are you sure , to delete?");
    return confirmed; // true if user clicks "OK", false if user clicks "Cancel"
  };

  onDeleteTodo = async (id) => {
    const is_tobe_deleted = this.confirmSubmission();
    if (is_tobe_deleted) {
      const jwt = Cookies.get("jwt");

      const url = "https://be-todos-app.onrender.com/delete_todo";
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ todo_id: id }),
      };
      const res = await fetch(url, options);
      this.get_todos();
      console.log(res, "delete executed");
    }
  };

  onUpdateTodo = async (e) => {
    e.preventDefault();
    const { editId, text } = this.state;

    const jwt = Cookies.get("jwt");

    const url = "https://be-todos-app.onrender.com/edit_todo";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ todo: text, todo_id: editId }),
    };
    const res = await fetch(url, options);
    this.get_todos();
    this.setState((p) => ({ ...p, text: "" }));
  };

  onEditTodo = (id) => {
    const { todos } = this.state;
    console.log(this.state, "onedit", id);
    const val = todos.filter((e) => e.todo_id === id)[0].todo;
    console.log(val);
    this.setState((prevState) => ({
      ...prevState,
      todos: prevState.todos,
      isEdit: true,
      text: val,
      editId: id,
    }));
  };

  get_todos = async () => {
    const jwt = Cookies.get("jwt");

    const url = "https://be-todos-app.onrender.com/show_todos";
    console.log(jwt);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };

    const res = await fetch(url, options);
    console.log(res, "get executed");
    const data = await res.json();
    if (res.ok) {
      console.log(data, "data exec");
      this.setState((x) => ({ ...x, todos: data }));
    }
  };

  logout = () => {
    Cookies.remove("jwt");
    this.props.history.push("/login");
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { count, text } = this.state;

    // check is there any text only then add the obj
    if (text === "") {
      alert("Enter valid Todo");
    }
    if (text !== "") {
      const jwt = Cookies.get("jwt");

      const url = "https://be-todos-app.onrender.com/add_todo";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ todo: text, status: "Uninitiated" }),
      };

      const res = await fetch(url, options);
      console.log(res, "executed");
      if (res.ok) {
        this.setState((p) => ({ ...p, text: "" }));
        this.get_todos();
        const data = await res.json();
        console.log(data, "data exec");
      }
    }
  };

  render() {
    if (!Cookies.get("jwt")) {
      return <Redirect to="/login" />;
    }
    const { todos, text, isEdit } = this.state;
    return (
      <div className={styles.bg_container}>
        <div className={styles.main_container}>
          <div className={styles.todo_heading_logout_button}>
            <h2 className={styles.heading}>Todo List</h2>
            <button className={styles.logout_button} onClick={this.logout}>
              Logout
            </button>
          </div>
          <form
            onSubmit={isEdit ? this.onUpdateTodo : this.submitForm}
            className={styles.form}
          >
            <input
              placeholder="Add a task"
              type="text"
              value={text}
              className={styles.input_field}
              onChange={this.onTodoAdd}
            />
            <button type="submit" className={styles.todo_button}>
              {!isEdit ? "Add Todo" : "Update Todo"}
            </button>
          </form>
          {todos.length ? (
            <ul className={styles.val2}>
              {todos.map((each) => (
                <TodoItem
                  key={each.todo_id}
                  details={each}
                  onUpdateTodoCount={this.onEditTodo}
                  onDeleteTodoCount={this.onDeleteTodo}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}

export default TodoList;
