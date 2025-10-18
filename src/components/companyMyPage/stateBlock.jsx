export default function StateBlock({ color, label, value }) {
  return (
    <button
      className={`${color} text-md font-medium px-2 lg:px-4 py-2 rounded-[10px]  flex items-center justify-between`}
    >
      <span>{label}</span>
      <span className="mx-4 lg:mx-4 h-4 border-l border-[#898989]"></span>
      <span className="font-bold">{value}</span>
    </button>
  );
}
