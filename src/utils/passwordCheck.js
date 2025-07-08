export function isValidPassword(password) {
  const lengthValid = password.length >= 8 && password.length <= 20;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password); // 특수문자

  return lengthValid && hasLetter && hasNumber && hasSpecialChar;
}

export function isPasswordMatch(password, confirmPassword) {
  return password === confirmPassword;
}
