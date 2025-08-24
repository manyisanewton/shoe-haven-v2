const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300 dark:bg-slate-700"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-slate-700 mb-2"></div>
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-slate-700"></div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-8 w-1/3 rounded bg-gray-300 dark:bg-slate-700"></div>
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;