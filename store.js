import { configureStore } from '@reduxjs/toolkit';
import reducer from './redux/reducers';

const store = configureStore({
  reducer: reducer,
});

export default store;
