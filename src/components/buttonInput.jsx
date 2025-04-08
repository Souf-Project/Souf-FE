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
}) {
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
                    />
                </div>
                {btnText && (
                    <button
                        onClick={onClick}
                        className="h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold bg-yellow-main"
                    >
                        {btnText}
                    </button>
                )}
            </div>
        </div>
    );
}
