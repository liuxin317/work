import * as types from '../../actions/common/actionTypes';

const initialState = {
  info: "common",

  // 请求中的接口计数
  loading: 0,
  // 错误信息
  msg: ''
};

export default function common(state = initialState, action) {
  switch (action.type) {

    case types.COM_LOADING_STATUS_UPDATE:
      return Object.assign({}, state, {
        loading: state.loading + (action.status === 'pending'? 1 : state.loading > 0 ? -1 : 0),
        msg: action.status === 'pending' ? '' : action.msg
      });

    case types.COM_SET_ALERT_MSG:
      return Object.assign({}, state, {msg: action.msg});

    default:
      return state;
  }
}
