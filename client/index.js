import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import $ from 'jquery';

import d3 from 'd3';
import galaxy from './D3/galaxy.js';
import mainD3 from './D3/main-d3.js';

require('./style.css');

class Main extends React.Component {
  constructor() {
    super();
    this.searchEnterkey = this.searchEnterkey.bind(this);
    this.searchClick = this.searchClick.bind(this);
    this.postSearch = this.postSearch.bind(this);
  }
  postSearch() {
    let root = this.refs.searchInput.value;
    $.ajax({
      type: 'POST',
      url: '/search',
      data: {data : this.refs.searchInput.value}
    }).done(function(data) {
      mainD3(data, root);
    });
    this.refs.searchInput.value = '';
  }
  searchEnterkey(e) {
    if(e.key === 'Enter') {
      this.postSearch();
    }
  }
  searchClick() {
    this.postSearch();
  }
  render() {
    d3.select('svg').remove();
    return (
      <div>
        <input type="text" placeholder="Input" ref="searchInput" onKeyPress={this.searchEnterkey}/>
        <button onClick={this.searchClick}>Search</button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Link to="/"><img src="./testimg.png" height="42" width="42"/>Main</Link>
        {this.props.children}
      </div>
    );
  }
}

let rootElement = document.getElementById('app');

ReactDOM.render(<Router history = {browserHistory}>
      <Route path = "/" component = {App}>
         <IndexRoute component = {Main} />
      </Route>
   </Router>, rootElement);
