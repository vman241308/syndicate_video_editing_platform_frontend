function video_duration(state = [], action) {
  switch (action.type) {
    case 'VIDEO_DURATION':
      return action.videoDuration || 0;
    default:
      return state;
  }
}

export default video_duration;
