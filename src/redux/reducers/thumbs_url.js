function thumbs_url(state = [], action) {
  switch (action.type) {
    case 'THUMBS_URL':
      return action.thumbs_url || [];
    default:
      return state;
  }
}

export default thumbs_url;
