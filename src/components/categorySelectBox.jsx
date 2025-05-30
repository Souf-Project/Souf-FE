import React, { useState } from "react";

export default function CategorySelectBox({
  title,
  content,
  defaultValue = "",
  type = "mypage", // or "join"
  onChange,
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [selectedSubSubOption, setSelectedSubSubOption] = useState(null);

  // 옵션 데이터 구조
  const options = [
    {
      id: 1,
      name: "순수 미술 & 일러스트",
      subOptions: [
        {
          id: 11,
          name: "일러스트·캐릭터 디자인",
          subOptions: [
            { id: 111, name: "일러스트" },
            { id: 112, name: "캐리커쳐" },
            { id: 113, name: "웹툰·콘티" },
            { id: 114, name: "2D 캐릭터" },
            { id: 115, name: "이모티콘" },
            { id: 116, name: "기타" },
          ],
        },
        {
          id: 12,
          name: "글자 디자인",
          subOptions: [
            { id: 121, name: "폰트" },
            { id: 122, name: "사인·직인" },
            { id: 123, name: "캘리그라피" },
            { id: 124, name: "타이포그래피" },
            { id: 125, name: "기타" },
          ],
        },
        {
          id: 13,
          name: "순수 미술",
          subOptions: [
            { id: 131, name: "서양화" },
            { id: 132, name: "동양화" },
            { id: 133, name: "서예" },
            { id: 134, name: "기타" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "만들기",
      subOptions: [
        {
          id: 21,
          name: "시제품 디자인",
          subOptions: [
            { id: 211, name: "시제품·3D프린팅" },
            { id: 212, name: "기타" },
          ],
        },
        {
          id: 22,
          name: "산업·제품 디자인",
          subOptions: [
            { id: 221, name: "제품·기구 설계" },
            { id: 222, name: "제품 도면·스케치" },
            { id: 223, name: "도면 제작·수정" },
            { id: 224, name: "인테리어 컨설팅" },
            { id: 225, name: "전시·무대 디자인" },
            { id: 226, name: "간판·시공" },
            { id: 227, name: "기타" },
          ],
        },
        {
          id: 23,
          name: "패션·텍스타일 디자인",
          subOptions: [
            { id: 231, name: "의류·쥬얼리 디자인" },
            { id: 232, name: "텍스타일 디자인" },
            { id: 233, name: "3D 도식화" },
            { id: 234, name: "기타" },
          ],
        },
        {
          id: 24,
          name: "조형 예술",
          subOptions: [
            { id: 241, name: "도예·도자기" },
            { id: 242, name: "조형" },
            { id: 243, name: "유리·금속·목 공예" },
            { id: 244, name: "기타" },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "음악",
      subOptions: [
        {
          id: 31,
          name: "음향",
          subOptions: [
            { id: 311, name: "성우" },
            { id: 312, name: "음악·음원·작곡·편곡" },
            { id: 313, name: "오디오 엔지니어링" },
            { id: 314, name: "기타" },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "사진 · 영상 · 영화",
      subOptions: [
        {
          id: 41,
          name: "사진",
          subOptions: [
            { id: 411, name: "제품·홍보 사진" },
            { id: 412, name: "개인·프로필 사진" },
            { id: 413, name: "이벤트 사진" },
            { id: 414, name: "사진 보정(포토샵)" },
            { id: 415, name: "기타" },
          ],
        },
        {
          id: 42,
          name: "영상",
          subOptions: [
            { id: 421, name: "광고·홍보 영상" },
            { id: 422, name: "숏폼 영상" },
            { id: 423, name: "영상 편집" },
            { id: 424, name: "드론 촬영" },
            { id: 425, name: "영상 후반 작업" },
            { id: 426, name: "기타" },
          ],
        },
        {
          id: 43,
          name: "영화",
          subOptions: [
            { id: 431, name: "감독" },
            { id: 432, name: "배우" },
            { id: 433, name: "조명" },
            { id: 434, name: "기타" },
          ],
        },
      ],
    },
    {
      id: 5,
      name: "디지털 콘텐츠 & 그래픽 디자인",
      subOptions: [
        {
          id: 51,
          name: "브랜드 디자인",
          subOptions: [
            { id: 511, name: "로고 디자인" },
            { id: 512, name: "브랜드 디자인·가이드" },
            { id: 513, name: "기타" },
          ],
        },
        {
          id: 52,
          name: "산업 디자인",
          subOptions: [
            { id: 521, name: "명함" },
            { id: 522, name: "전단지·포스터·인쇄물" },
            { id: 523, name: "현수막·배너" },
            { id: 524, name: "메뉴판" },
            { id: 525, name: "홍보물 인쇄·출력" },
            { id: 526, name: "스티커·봉투·초대장" },
            { id: 527, name: "패키지·커버" },
            { id: 528, name: "책표지·내지" },
            { id: 529, name: "앨범 커버" },
            { id: 5210, name: "기타" },
          ],
        },
        {
          id: 53,
          name: "웹·모바일 디자인",
          subOptions: [
            { id: 531, name: "웹 UI·UX" },
            { id: 532, name: "앱·모바일 UI·UX" },
            { id: 533, name: "기타" },
          ],
        },
        {
          id: 54,
          name: "마케팅 디자인",
          subOptions: [
            { id: 541, name: "상세 페이지" },
            { id: 542, name: "SNS·썸네일 디자인" },
            { id: 543, name: "채널아트 디자인" },
            { id: 544, name: "블로그·카페 디자인" },
            { id: 545, name: "기타" },
          ],
        },
        {
          id: 55,
          name: "컴퓨터 그래픽(CG)·모션그래픽",
          subOptions: [
            { id: 551, name: "모션그래픽" },
            { id: 552, name: "인포그래픽" },
            { id: 553, name: "미디어 아트" },
            { id: 554, name: "인트로·로고" },
            { id: 555, name: "AR·VR·XR" },
            { id: 556, name: "인포그래픽" },
            { id: 557, name: "방송용 아바타" },
            { id: 558, name: "3D 캐릭터·피규어" },
            { id: 559, name: "3D 제품 모델링·렌더링" },
            { id: 5510, name: "3D 공간 모델링" },
            { id: 5511, name: "3D 의류·쥬얼리" },
            { id: 5512, name: "NFT 아트" },
            { id: 5513, name: "기타" },
          ],
        },
        {
          id: 56,
          name: "게임 디자인",
          subOptions: [
            { id: 561, name: "VR·AR·게임" },
            { id: 562, name: "메타버스" },
            { id: 563, name: "3D 게임용 소스" },
            { id: 564, name: "기타" },
          ],
        },
        {
          id: 57,
          name: "애니메이션",
          subOptions: [
            { id: 571, name: "2D 애니메이션" },
            { id: 572, name: "3D 애니메이션" },
            { id: 573, name: "기타" },
          ],
        },
      ],
    },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSelectedSubOption(null);
    setSelectedSubSubOption(null);
  };

  const handleSubOptionSelect = (subOption) => {
    setSelectedSubOption(subOption);
    setSelectedSubSubOption(null);
  };

  const handleSubSubOptionSelect = (subSubOption) => {
    setSelectedSubSubOption(subSubOption);
  };

  const getValueToSave = () => {
    if (type === "join") {
      if (selectedSubSubOption) {
        return (
          selectedOption.name +
          " > " +
          selectedSubOption.name +
          " > " +
          selectedSubSubOption.name
        );
      } else if (selectedSubOption) {
        return selectedOption.name + " > " + selectedSubOption.name + " > ";
      } else if (selectedOption) {
        return selectedOption.name;
      }
      return null;
    } else {
      if (selectedSubSubOption) {
        return selectedSubSubOption.name;
      } else if (selectedSubOption) {
        return selectedSubOption.name;
      } else if (selectedOption) {
        return selectedOption.name;
      }
      return null;
    }
  };

  const handleSave = () => {
    const valueToSave = getValueToSave();
    if (valueToSave) {
      setSelectedValue(valueToSave);
    }
    setShowModal(false);
    setSelectedOption(null);
    setSelectedSubOption(null);
    setSelectedSubSubOption(null);
  };

  // 옵션 버튼 스타일
  const getOptionButtonStyle = (option) => {
    if (selectedOption?.id === option.id) {
      return selectedSubOption || selectedSubSubOption
        ? "bg-yellow-main text-black"
        : "bg-yellow-point text-white";
    }
    return "hover:bg-gray-100 border border-grey-border";
  };

  const getSubOptionButtonStyle = (subOption) => {
    if (selectedSubOption?.id === subOption.id) {
      return selectedSubSubOption
        ? "bg-yellow-main text-black"
        : "bg-yellow-point text-white";
    }
    return "hover:bg-gray-100 border border-grey-border";
  };

  const getSubSubOptionButtonStyle = (subSubOption) => {
    if (selectedSubSubOption?.id === subSubOption.id) {
      return "bg-yellow-point text-white";
    }
    return "hover:bg-gray-100 border border-grey-border";
  };

  return (
    <div className={`relative ${type === "join" && "w-full"}`}>
      <div
        className={`flex items-center rounded-md bg-white border overflow-hidden cursor-pointer hover:bg-[#F0F0F0] ${
          type === "join" ? "border-[#FFC400] w-full" : "border-grey-border "
        }`}
        onClick={() => setShowModal(true)}
      >
        <div className="flex-1 p-5 text-center">
          {selectedValue || "카테고리 선택"}
        </div>
      </div>

      {/* 선택 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[50rem]">
            <h3 className="text-xl font-semibold mb-4">카테고리 선택</h3>
            <div className="flex space-x-8">
              {/* 첫 번째 열 - 기본 옵션 */}
              <div className="flex flex-col w-1/3">
                {options.map((option) => (
                  <button
                    key={option.id}
                    className={`text-left p-3 my-1 rounded-md ${getOptionButtonStyle(
                      option
                    )}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>

              {/* 두 번째 열 - 서브 옵션 */}
              {selectedOption && selectedOption.subOptions.length > 0 && (
                <div className="flex flex-col w-1/3">
                  {selectedOption.subOptions.map((subOption) => (
                    <button
                      key={subOption.id}
                      className={`text-left p-3 my-1 rounded-md ${getSubOptionButtonStyle(
                        subOption
                      )}`}
                      onClick={() => handleSubOptionSelect(subOption)}
                    >
                      {subOption.name}
                    </button>
                  ))}
                </div>
              )}

              {/* 세 번째 열 - 서브서브 옵션 */}
              {selectedSubOption &&
                selectedSubOption.subOptions &&
                selectedSubOption.subOptions.length > 0 && (
                  <div className="flex flex-col w-1/3">
                    {selectedSubOption.subOptions.map((subSubOption) => (
                      <button
                        key={subSubOption.id}
                        className={`text-left p-3 my-1 rounded-md ${getSubSubOptionButtonStyle(
                          subSubOption
                        )}`}
                        onClick={() => handleSubSubOptionSelect(subSubOption)}
                      >
                        {subSubOption.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className={`bg-yellow-point text-white px-4 py-2 rounded-md ${
                  !getValueToSave() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSave}
                disabled={!getValueToSave()}
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
