export default function StateBlock({ color, label, value }) {
  return (
    <button
      className={`${color} text-lg font-medium px-10 py-1 rounded-[10px]  h-[60px] flex items-center justify-between`}
    >
      <span>{label}</span>
      <span className="mx-8 h-6 border-l border-[#898989]"></span>
      <span className="font-bold">{value}</span>
    </button>
  );
}
