import { createStore, compose } from 'redux';
import rootReducer from './reducers/index';

const defaultState = {
  crop_start: 0,
  crop_end: 100,
  caption_visible: false,
  video_currenttime: 0,
  video_duration: 0,
  audio_url: '',
  thumbs_url: [],
};

const store = createStore(
  rootReducer,
  defaultState,
  compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV !== 'production'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

export default store;
