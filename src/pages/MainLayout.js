import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

// import About from "./About.js";

const Redirect = (props) => {
  let history = useHistory();
  const {to} = props;
  history.push(to);
  return <></>;
}

const MainLayout = (props) => {
  return (
    <Switch>
      <Route exact path="/">
        <div className="Home-main">
          <div className="jumbotron">coming soon</div>
        </div>
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default MainLayout;