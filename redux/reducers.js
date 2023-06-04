import { SET_SERVER_INFO } from './actions';
import { SET_RECORDED_FILES } from './actions';

const initialState = {
  serverInfo: {
    address: '',
    port: '',
  },
  // ... other initial state properties ...
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVER_INFO:
      return {
        ...state,
        serverInfo: action.payload,
      };
    case SET_RECORDED_FILES:
      return {
        ...state,
        recordedFiles: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
