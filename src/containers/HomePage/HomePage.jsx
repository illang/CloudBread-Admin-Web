import React, { Component } from 'react';
import Helmet from 'react-helmet';

class HomePage extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Helmet title="CloudBread Inspector" />
        Inspector Main
      </div>
    );
  }
}

export default HomePage;