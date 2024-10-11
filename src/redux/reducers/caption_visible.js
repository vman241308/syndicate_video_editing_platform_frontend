function caption_visible(state = [], action) {
  switch (action.type) {
    case 'CAPTION_VISIBLE':
      return action.visible;
    default:
      return state;
  }
}

export default caption_visible;
