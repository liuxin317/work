import React from 'react';
import './style.scss';

class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="loading loading-cover">
        <div className="loading-circle"></div>
      </div>
    );
  }
}

export default Loading;