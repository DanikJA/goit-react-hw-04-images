import { Component } from 'react';
import './Searchbar.css';

export class Searchbar extends Component {
  state = {
    query: '',
  };

  handleChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.query);
    this.setState({ query: '' });
  };

  render() {
    return (
      <header class="searchbar">
        <form class="form" onSubmit={this.handleSubmit}>
          <input
            class="input"
            type="text"
            autocomplete="off"
            autofocus
            placeholder="Search images and photos"
            value={this.state.query}
            onChange={this.handleChange}
          />
          <button type="submit" class="buttonSubmit">
            <span className="button-label">Search</span>
          </button>
        </form>
      </header>
    );
  }
}
