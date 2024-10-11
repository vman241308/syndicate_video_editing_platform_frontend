function crop_start(state = [], action) {
  switch (action.type) {
    case 'CROPS_CHANGED':
      if (action.end) {
        if (action.end - state < 0 && action.end >= 0) {
          return action.end - 0;
        }
      }
      if (action.start) {
        if (action.start < 0) return 0;
        if (action.start > 100) return 100;
        return action.start;
      }
      return state;

    default:
      return state;
  }
}

export default crop_start;
