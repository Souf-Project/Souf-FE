// utils/seo.js
export const generateSeoContent = (
  data,
  helpers
) => {
  const {
    title,
    nickname,
    categoryNames = [],
    minPrice,
    maxPrice,
    deadline,
    location,
    recruitDetail,
    preferMajor,
    content,
  } = data;

  const { maskNickname, formatDate } = helpers;

  return `
    제목: ${title || ""}
    작성자: ${maskNickname ? maskNickname(nickname) : ""}
    카테고리: ${categoryNames
      .map((c) => [c.first, c.second, c.third].filter(Boolean).join(" > "))
      .join(", ")}
    급여: ${
      minPrice && maxPrice
        ? `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`
        : "금액 협의"
    }
    기한: ${formatDate ? formatDate(deadline) : ""}
    지역: ${
      recruitDetail
        ? `${recruitDetail.cityName} ${recruitDetail.cityDetailName || ""}`.trim()
        : location || ""
    }
    우대사항: ${
      recruitDetail?.preferentialTreatment
        ? recruitDetail.preferentialTreatment
        : preferMajor
        ? "전공자 우대"
        : "경력/경험 무관"
    }
    상세내용: ${(content || "").replace(/\s+/g, " ")}
  `;
};
