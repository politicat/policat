import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

class Main extends React.Component {
  constructor() {
    super();
    this.searchClick = this.searchClick.bind(this);
  }
  searchClick() {
    console.log('value? ', this.refs.searchInput.value);
  }
  render() {
    return (
      <div>
        <h2> Main </h2>
        <input type="text" placeholder="Input" ref="searchInput"/>
        <button onClick={this.searchClick}>Search</button>
      </div>
    );
  }
}

class Search extends React.Component {
  render() {
    return (
      <div>
        <h2> Search </h2>
        <input type="text" placeholder="Input" ref="searchInput"/>
        <button onClick={this.searchClick}>Search</button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="">Main</Link></li>
          <li><Link to="search">Search</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

let rootElement = document.getElementById('app');

ReactDOM.render(<Router history = {browserHistory}>
      <Route path = "/" component = {App}>
         <IndexRoute component = {Main} />
         <Route path = "" component = {Main} />
         <Route path = "search" component = {Search} />
      </Route>
   </Router>, rootElement);
