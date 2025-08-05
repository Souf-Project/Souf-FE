import { useEffect } from "react";

const useSNSShare = ({ title, url, option }) => {
  const shareToTwitter = () => {
    const sharedLink =
      "text=" + encodeURIComponent(title + " \n ") + encodeURIComponent(url);
    openWidnow(`https://twitter.com/intent/tweet?${sharedLink}`);
  };

  const shareToFacebook = () => {
    const sharedLink = encodeURIComponent(url);
    openWidnow(`http://www.facebook.com/sharer/sharer.php?u=${sharedLink}`);
  };

  const shareToKakaoTalk = () => {
    if (window.Kakao === undefined) {
      return;
    }

    const kakao = window.Kakao;

    // 중복 initialization 방지
    if (!kakao.isInitialized()) {
      // 환경 변수에서 카카오 키 가져오기
      const kakaoKey = import.meta.env.VITE_KAKAO_SHARE_KEY;
      if (kakaoKey) {
        kakao.init(kakaoKey);
      }
    }

    kakao.Share.sendDefault({
      objectType: "text",
      text: title,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    });
  };

  const shareToNavigator = ({ text, url }) => {
    const sharedData = {
      text: text,
      url: url,
    };

    try {
      if (navigator.canShare && navigator.canShare(sharedData)) {
        navigator
          .share(sharedData)
          .then(() => {
            console.log("성공")
          })
          .catch(() => {
            console.log("취소")
          });
      }
    } catch (e) {
      console.log("실패")
    }
  };

  const openWidnow = (url) => {
    window.open(url, option?.windowOpenTarget || "_blank");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return {
    isAvailNavigator: typeof navigator.share !== "undefined",
    shareToTwitter,
    shareToFacebook,
    shareToKakaoTalk,
    shareToNavigator,
  };
};

export default useSNSShare;