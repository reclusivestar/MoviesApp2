import React, { Component } from 'react';

export default class Search extends Component {
   constructor(props) {
      super(props);
      console.log(this.props);
      this.state = {
         query: '',
         results: []
      }
   }

  getInfo = () => {
     console.log(this.props);
   // axios.get(`${API_URL}?api_key=${API_KEY}&prefix=${this.state.query}&limit=7`)
     this.props.searchMvs(this.state.query);
   // .then(({ data }) => {
     this.setState({results: this.props.Mvs});
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      } else if (!this.state.query) {
      }
    })
  }

  render() {
    return (
      <form>
        <input
          placeholder="Search for..."
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <Suggestions results={this.state.results} />
      </form>
    )
  }
}

const Suggestions = (props) => {
   const options = props.results.map(r => (
     <li key={r.id}>
       {r.name}
     </li>
   ))
   return <ul>{options}</ul>
}
