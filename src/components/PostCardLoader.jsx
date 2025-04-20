const PostCardLoader = () => {
  return (
    <div className="card px-4 border border-gray-500 mb-4 py-4 rounded-sm">
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-xl h-8 rounded-md font-semibold bg-gray-600 animate-pulse w-full"></h1>
        </div>
        <p className="text-xs py-1 px-4 flex items-center gap-1 font-semibold"></p>
        <div className="h-10 flex flex-col gap-2">
          <p className="text-sm rounded-md px-4 w-2/4 h-5 bg-gray-600 animate-pulse text-gray-800"></p>
          <p className="text-sm rounded-md px-4 w-1/4 h-5 bg-gray-600 animate-pulse text-gray-800"></p>
        </div>
      </div>
    </div>
  );
};

export default PostCardLoader;
