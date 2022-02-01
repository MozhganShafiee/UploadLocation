let id = 0;
let identifiedForm;
export const addFormLocation = (form) => {
  id = ++id;
  identifiedForm = {
    ...form,
    id,
  };
  return {
    type: "ADD_FORM_LOCATION",
    payload: identifiedForm,
  };
};

export const editFormLocation = (editableLocation) => {
  return {
    type: "EDIT_FORM_LOCATION",
    payload: editableLocation,
  };
};
