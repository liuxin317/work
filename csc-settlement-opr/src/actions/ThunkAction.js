import HttpRequest from '../request/Fetch';

// 异步发起action,高价函数
const fetchFriends = (params, type) => dispatch => {
    HttpRequest(params, res => {
        dispatch({
            type,
            payload: res
        })
    })
}

export default fetchFriends;