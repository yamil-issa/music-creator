export const SET_SERVER_INFO = 'SET_SERVER_INFO';

export const SET_RECORDED_FILES = 'SET_RECORDED_FILES';

export const setServerInfo = (serverInfo) => ({
  type: SET_SERVER_INFO,
  payload: serverInfo,
});

export const setRecordedFiles = (recordings) => ({
  type: SET_RECORDED_FILES,
  payload: recordings,
});
