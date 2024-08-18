import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Register";
import TodoList from "./components/TodoList";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/todolist" component={TodoList} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
