function crop_end(state = [], action) {
  switch (action.type) {
    case 'CROPS_CHANGED':
      if (action.start) {
        if (state - action.start < 0 && action.start <= 100) {
          return action.start + 0;
        }
      }
      if (action.end) {
        if (action.end < 0) return 0;
        if (action.end > 100) return 100;
        return action.end;
      }
      return state;

    default:
      return state;
  }
}

export default crop_end;
