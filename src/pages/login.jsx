import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonInput from "../components/buttonInput";
import Input from "../components/input";
import loginImg from "../assets/images/loginImg.svg";
import { postLogin } from "../api/member";
import { useMutation } from "@tanstack/react-query";
import { UserStore } from "../store/userStore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = () => {
    navigate("/");
  };

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => postLogin(email, password),
    onSuccess: (response) => {
      console.log("onSuccess 응답:", response);

      const result = response.data?.result;

      console.log("이름", result.nickname);
      console.log("멤버", result.roleType);
     
      UserStore.getState().setUser({
        memberId: result.memberId,
        nickname: result.nickname,
        roleType: result.roleType,
      });
     
      

      localStorage.setItem("accessToken", result.accessToken);

      navigate("/");
    },

    onError: (error) => {
      console.error("로그인 실패:", error);
      //setIsModal(true); // 로그인 실패하면 모달
    },
  });

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 bg-[#FFE681] flex flex-col justify-center px-16 ">
        <div className="my-auto">
          <h1 className="text-8xl font-bold mb-6">SouF</h1>
          <p className="text-4xl font-bold leading-relaxed text-gray-800 mb-10">
            합리적인 비용으로
            <br />
            필요한 인재를 만나보세요!
            <br />
            지금 바로 스프에서!
          </p>
          <div className="mt-20 w-1/2 h-auto ml-auto">
            <img src={loginImg} className=" w-full" />
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-white flex flex-col justify-center items-center px-36">
        <h2 className="text-6xl font-bold mb-10 mr-auto">로그인</h2>
        <div className="w-full space-y-6 bg-white p-8 border rounded-xl shadow">
          <Input
            title="이메일"
            // isValidateTrigger={isValidateTrigger}
            // isConfirmed={isConfirmed}
            placeholder="Souf@souf.com"
            onChange={(e) => setEmail(e.target.value)}
            essentialText="이메일을 입력해주세요"
            disapproveText="이메일을 입력해주세요"
            // onValidChange={onValidChange}
          />
          <Input
            title="비밀번호"
            // isValidateTrigger={isValidateTrigger}
            // isConfirmed={isConfirmed}
            type="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
            essentialText="비밀번호를 입력해주세요"
            disapproveText="비밀번호를 입력해주세요"
            // onValidChange={onValidChange}
          />
          <div className="flex justify-between text-[#767676] text-xl font-reagular">
            <button onClick={() => navigate("/join")}>회원가입</button>
            <button onClick={() => navigate("/pwdFind")}>
              비밀번호 재설정
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => loginMutation.mutate({ email, password })}
              className="bg-yellow-main mx-auto w-36 h-12 rounded-xl text-2xl font-bold"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
