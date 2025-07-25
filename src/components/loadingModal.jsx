import Loading from "./loading";

export default function LoadingModal({ text = '업로드 중입니다...', size = 'lg' }) {
    //border-t-4 border-yellow-main 

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
<Loading size={size} text={text} />
</div>

  );
}

//<div className="absolute top-3 left-2 w-[95%] h-1 bg-yellow-main rounded-t-[2px]" />