export function isValidPassword(password) {
  const lengthValid = password.length >= 8 && password.length <= 20;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9\s]/.test(password); // 특수문자 (공백 제외)
  const hasNoSpace = !/\s/.test(password); // 공백 포함 여부 검증

  return lengthValid && hasLetter && hasNumber && hasSpecialChar && hasNoSpace;
}

export function isPasswordMatch(password, confirmPassword) {
  return password === confirmPassword;
}
