import React from 'react';
import API from '../api/api';
import LinkStore from '../stores/LinkStore';

const _getAppState = () => {
  return {links: LinkStore.getAll()};
};

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = _getAppState();
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    API.fetchLinks();
    LinkStore.on('change', this.onChange);
  }
  componentWillUnmount() {
    LinkStore.removeListener('change', this.onChange);
  }
  onChange() {
    this.setState(_getAppState());
  }
  render() {
    const content = this.state.links.map(link => {
      return <li key={link._id}>
          <a href={link.url}>{link.title}</a>
        </li>;
    });
    return (
      <div>
        <h3>Links:
          <ul>
            {content}
          </ul>
        </h3>
      </div>
    );
  }
}
