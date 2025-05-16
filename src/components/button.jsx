import Input from '../components/input';

export default function Button({
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
    width= "w-full",
}) {
    return (
        <button
        onClick={onClick}
        className={`h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold bg-yellow-main ${width}`}>
        {btnText}
</button>
    );
}
