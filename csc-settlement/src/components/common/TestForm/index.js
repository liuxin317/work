import React from 'react';
import Loadable from 'react-loadable';
import PageLoading from '../PageLoading';

const LoadableComponent = Loadable({
  loader: () => import('./AsyncComp'),
  loading: PageLoading
});

class TestForm extends React.Component {
  render() {
    return (
      <div className="test-form">
        <LoadableComponent></LoadableComponent>
      </div>
    );
  }
}

export default TestForm;
