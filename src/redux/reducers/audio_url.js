function audio_url(state = [], action) {
  switch (action.type) {
    case 'AUDIO_URL':
      return action.audio_url || '';
    default:
      return state;
  }
}

export default audio_url;
