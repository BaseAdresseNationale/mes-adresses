export function getValidationMessage(validationMessages, index) {
  if (validationMessages && validationMessages[index]) {
    return validationMessages[index][0]
  }
}
