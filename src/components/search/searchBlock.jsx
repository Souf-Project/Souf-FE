export default function SearchBlock({ title, description, onClick }) {
const maxLength = 100;

const handlerFeedContent = (length, data) => {
      if(data.length > length){
        return data.slice(0, length) + "...";
      }
      return data;
    }
  return (
<div
      onClick={onClick}
      className="cursor-pointer p-4 border rounded-md hover:shadow-md transition-shadow duration-200"
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 0 12px 0 rgba(253, 224, 71, 0.7)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <h3 className="text-2xl font-semibold mb-2 px-1 rounded">
        {title}
      </h3>

      {description && (
        <p className="text-gray-600 whitespace-pre-line">
          {handlerFeedContent(maxLength, description)}
        </p>
      )}
    </div>
  );
}

//'0 4px 10px rgba(253, 224, 71, 0.7)';
//'0 0 12px 0 rgba(253, 224, 71, 0.7)'; // 연한 노란 그림자

//<h3 className="text-lg font-semibold mb-2 bg-yellow-100 bg-opacity-50 px-1 rounded"> bg-yellow-100 bg-opacity-50


/*
export default function SearchBlock({ title, description, onClick }) {
const maxLength = 100;

const handlerFeedContent = (length, data) => {
      if(data.length > length){
        return data.slice(0, length) + "...";
      }
      return data;
    }
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold mb-2 bg-yellow-100 bg-opacity-50 px-1 rounded">
  {title}
</h3>

      {description && 
      <p className="text-gray-600 whitespace-pre-line">{handlerFeedContent(maxLength, description)}</p>}
    </div>
  );
}

*/