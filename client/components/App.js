class App extends React.Component {
  constructor() {
    super();
    this.searchClick = this.searchClick.bind(this);
  }
  searchClick() {
    console.log(this.refs.searchInput.value);
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

ReactDOM.render(<App/>, document.getElementById('app'));
