class App extends React.Component {
  render() {
    return (
      <p>
        <input type="text" placeholder="Input" />
        <button>Search</button>
      </p>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
