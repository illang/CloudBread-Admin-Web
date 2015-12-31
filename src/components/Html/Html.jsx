import React, { Component, PropTypes } from 'react';
import { getTitle, getTail } from '../../lib/context';
import assets from './assets.json';

const preventFOUC = `
#app {
  visibility: hidden;
}
`;

class Html extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
  };

  render() {
    return (
      <html>
        <head>
          <title>{getTitle()}</title>
          <style type="text/css">{preventFOUC}</style>
          <link rel="stylesheet" media="all" href={assets.app.css} />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.children}} />
          <div dangerouslySetInnerHTML={{__html: getTail()}} />
          <script src={assets.app.js} />
        </body>
      </html>
    );
  }
}

export default Html;