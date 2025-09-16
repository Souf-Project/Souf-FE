export default function MatchingPrice({ price, category,project, type }) {
  return (
    <div>
        {type=="satisfaction"?
         <div className="text-3xl font-bold text-blue-500"><span className="text-black">만족도</span> {price}%</div>
      
        :
        <div className="text-3xl font-bold text-blue-500">{price}만원~</div>
        }
     
      <div className="text-neutral-700 text-xl font-bold mt-4">{category}</div>
      <div className="text-neutral-400 text-md font-bold">{project}</div>
      <div className="text-neutral-400 text-md font-bold">{type}</div>
    </div>
  )
}