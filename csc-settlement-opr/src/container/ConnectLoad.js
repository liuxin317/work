import { connect } from 'react-redux';
import Loading from '../components/common/Loading';

const mapStateToProps = (store) => {
    return {
        loadState: store.common.LoadState
    }
}

const ConnectLoad = connect(
    mapStateToProps
)(Loading);

export default ConnectLoad;