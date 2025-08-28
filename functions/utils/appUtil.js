const failActionFunction = async function (request, h, error) {
  let customErrorMessage = "";
  if (error.name === "ValidationError") {
    customErrorMessage = error.details[0].message;
  } else {
    customErrorMessage = error.output.payload.message;
  }
  customErrorMessage = customErrorMessage.replace(/"/g, "");
  customErrorMessage = customErrorMessage.replace("[", "");
  customErrorMessage = customErrorMessage.replace("]", "");
  return Boom.badRequest(customErrorMessage);
};
