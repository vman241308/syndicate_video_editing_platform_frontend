function video_currenttime(state = [], action) {
  switch (action.type) {
    case 'VIDEO_CURRENTTIME':
      return action.currentTime || 0;
    default:
      return state;
  }
}

export default video_currenttime;
