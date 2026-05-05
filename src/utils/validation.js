export function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export function isNameValid(name) {
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ']+([- ][a-zA-ZÀ-ÖØ-öø-ÿ']+)*$/
  return nameRegex.test(name)
}

export function isPhoneValid(phone) {
  const phoneRegex = /^(\(?(?:(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)?)? ?(?:[2-8]|9[0-9])[0-9]{3}-?[0-9]{4}|(?:\+1-?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})(?:-?|\s?)(?:[2-9]\d{2})(?:-?|\s?)(?:\d{4}))$/
  return phoneRegex.test(phone)
}
