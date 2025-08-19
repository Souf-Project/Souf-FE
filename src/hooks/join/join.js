// hooks/useSignupMutations.js
import { useMutation } from "@tanstack/react-query";
import {
  getNickNameVerify,
  postEmailVerification,
  postEmailVerify,
  postSignUp,
} from "../../api/member";
import { postSocialSignUp } from "../../api/social";

export const useSignupMutations = ({
  onEmailSuccess,
  onEmailError,
  onNicknameChecked,
  onEmailVerifySuccess,
  onEmailVerifyError,
  onSignUpSuccess,
  onSignUpError,
  onSocialSignUpSuccess,
  onSocialSignUpError,
}) => {
  const emailVerificationMutation = useMutation({
    mutationFn: (email) => postEmailVerification(email),
    onSuccess: onEmailSuccess,
    onError: onEmailError,
  });

  const checkNickname = useMutation({
    mutationFn: getNickNameVerify,
    onSuccess: onNicknameChecked,
  });

  const emailVerify = useMutation({
    mutationFn: ({ email, verification }) =>
      postEmailVerify(email, verification, "SIGNUP"),
    onSuccess: onEmailVerifySuccess,
    onError: onEmailVerifyError,
  });

  const signUp = useMutation({
    mutationFn: (finalData) => postSignUp(finalData),
    onSuccess: onSignUpSuccess,
    onError: onSignUpError,
  });

  const socialSignUp = useMutation({
    mutationFn: (socialSignupData) => postSocialSignUp(socialSignupData),
    onSuccess: onSocialSignUpSuccess,
    onError: onSocialSignUpError,
  });

  return {
    emailVerificationMutation,
    checkNickname,
    emailVerify,
    signUp,
    socialSignUp,
  };
};
