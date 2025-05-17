import React, { useState } from "react";
import EditText from "./editText";

export default function CompanyProfileEdit() {
  const [name, setName] = useState("박정곤");
  const [nickname, setNickname] = useState("스프회사");
  const [email, setEmail] = useState("souf@gmail.com");
  const [interests, setInterests] = useState([
    "일러스트",
    "일러스트",
    "일러스트",
    "일러스트",
  ]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  return (
    <div className="min-h-screen w-full">
      <h2 className="text-[32px] font-bold mb-4">프로필 수정</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full rounded-[30px]">
        <div className="flex flex-row">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-2" />
          <div className="flex flex-col mb-6 ml-4">
            <div className="text-lg font-semibold">스프회사</div>
            <button className="flex items-center border px-3 py-2 text-sm mt-2 w-fit rounded-[10px]">
              프로필 사진 변경하기
            </button>

            <p className="text-xs text-gray-500 mt-1">
              800x800 크기의 PNG, JPG 사진만 업로드 가능합니다.
            </p>
          </div>
        </div>

        <EditText
          label="이름"
          value={name}
          isEditing={isEditingName}
          onChange={(e) => setName(e.target.value)}
          onEditClick={() => setIsEditingName(true)}
          onConfirmClick={() => setIsEditingName(false)}
        />

        <EditText
          label="닉네임"
          value={nickname}
          isEditing={isEditingNickname}
          onChange={(e) => setNickname(e.target.value)}
          onEditClick={() => setIsEditingNickname(true)}
          onConfirmClick={() => setIsEditingNickname(false)}
        />

        <div className="mb-4">
          <label className="font-semibold block mb-1">이메일</label>
          <input
            className="border px-4 py-4 rounded w-full bg-gray-100"
            value={email}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">관심 분야</label>
          <div className="flex gap-2 flex-wrap">
            {interests.map((tag, idx) => (
              <div key={idx} className="border px-4 py-1 rounded-full text-sm">
                {tag}
              </div>
            ))}
            <button
              className="ml-2 border px-4 py-1"
              onClick={() => setIsEditingInterests(true)}
            >
              수정
            </button>
          </div>
        </div>

        <div>
          <label className="font-semibold block mb-1">비밀번호 변경</label>
          <input className="border px-4 py-2 rounded w-full" type="password" />
        </div>
      </div>
    </div>
  );
}
