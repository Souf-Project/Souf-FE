import { useEffect } from 'react';
import Input from '../components/input';

export default function ButtonInput({
    title,
    type,
    btnText,
    onClick,
    placeholder,
    onChange,
    disapproveText = '',
    essentialText = '',
    approveText = '',
    onValidChange = () => {},
    isValidateTrigger = false,
    isConfirmed = undefined,
    value="",
    isLoading = false
}) {
            useEffect(() => {
            console.log("버튼 인풋에서", isConfirmed);
          }, [isConfirmed]);
    return (

        
        <div className="flex flex-col gap-2 w-full items-center">
            <div className="w-full flex gap-3 items-center">
                <div className="flex-1">
                    <Input
                    title={title}
                        isValidateTrigger={isValidateTrigger}
                        isConfirmed={isConfirmed}
                        placeholder={placeholder}
                        onChange={onChange}
                        essentialText={essentialText}
                        approveText={approveText}
                        disapproveText={disapproveText}
                        onValidChange={onValidChange}
                        value={value}
                    />
                </div>
                {btnText && (
                    <button
                        onClick={onClick}
                        disabled={isLoading}
                        className={`h-[52px] px-6 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold ${
                            isLoading 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-yellow-main hover:bg-yellow-point transition-colors duration-200'
                        }`}
                    >
                        {isLoading ? '전송 중...' : btnText}
                    </button>
                )}
            </div>
        </div>
    );
}
