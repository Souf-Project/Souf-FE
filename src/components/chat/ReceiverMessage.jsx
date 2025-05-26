import AeditInfoIco from "../../assets/images/AeditInfoIco.svg";

export default function ReceiverMessage({ content }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <img src={AeditInfoIco} />
      <div>
        <div className="max-w-xs bg-gray-200 text-black px-4 py-2 rounded-lg rounded-bl-none shadow">
          <p className="text-sm">{content}</p>
          <span className="text-xs text-gray-500 block text-right mt-1"></span>
        </div>
      </div>
    </div>
  );
}
