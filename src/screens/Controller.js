import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from "../screens/home/Home";
import Details from "../screens/details/Details";
import BookShow from "../screens/bookshow/BookShow";
// import Confirmation from "../screens/confirmation/Confirmation";

const Controller = () => {
  return (
    <Router>
      <div className="main-container">
        <Route path="/" exact component={Home} />
        <Route path="/movie-details/:id" component={Details} />
        <Route path="/book-show/:id" component={BookShow} />
        {/* <Route path="/confirm/:id" component={Confirmation} /> */}
      </div>
    </Router>
  );
};

export default Controller;