import { combineReducers } from 'redux';

import crop_end from './crop_end';
import crop_start from './crop_start';
import caption_visible from './caption_visible';
import video_currenttime from './video_currenttime';
import video_duration from './video_duration';
import audio_url  from './audio_url';
import thumbs_url from './thumbs_url'

const rootReducer = combineReducers({
  crop_end,
  crop_start,
  caption_visible,
  video_currenttime,
  video_duration,
  audio_url,
  thumbs_url,
});

export default rootReducer;
