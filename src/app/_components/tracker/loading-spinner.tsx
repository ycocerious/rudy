export const LoadingSpinner = () => {
  return (
    <div className="flex h-[135px] items-center justify-center sm:h-[141px] md:h-[152px]">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#5ce1e6]"></div>
    </div>
  );
};
