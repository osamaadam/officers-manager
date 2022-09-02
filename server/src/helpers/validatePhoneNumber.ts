export const validatePhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^01[0-9]{9}$/;
  if (phoneRegex.test(phoneNumber)) return phoneNumber;
  else if (phoneRegex.test(`0${phoneNumber}`)) return `0${phoneNumber}`;
  else return "";
};
