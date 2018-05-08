import Types from '../actions/ActionType';

export default (state = {}, action) => {
    switch (action.type) {
        case Types.LOAD_STATE :
            return Object.assign({},state, action.payload);
        case Types.MENU_STATE :
            return Object.assign({},state, action.payload);
        case Types.MENU_LIST :
            return Object.assign({},state, action.payload);
        default : 
            return state 
    }
}