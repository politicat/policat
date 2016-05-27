class Search extends React.Component {
  constructor() {
    super();
  }
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
