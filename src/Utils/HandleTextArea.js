export const HandleTextArea = (value, type = 0) => {
  if (value !== null && value !== undefined && value !== "") {
    if (type === 0) {
      return value.replaceAll(/(?:\r\n|\r|\n)/g, "textarea");
    } else {
      return value.replaceAll("textarea", "\n");
    }
  }
  return value;
};
