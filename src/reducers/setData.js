export const addFormLocation = (state = [], action) => {
  switch (action.type) {
    case "ADD_FORM_LOCATION":
      // console.log(action.payload);
      return [...state, action.payload];

    case "EDIT_FORM_LOCATION":
      let editableLocation = state.findIndex(
        (data) => data.id === action.payload.id
      );
      state[editableLocation] = action.payload;
      return state;

    default:
      return state;
  }
};
