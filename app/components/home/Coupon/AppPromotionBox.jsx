const AppPromotionBox = () => {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-md text-center">
      <h3 className="text-lg font-bold mb-2 text-[#14b8a6]">تسوّق كالمحترفين</h3>
      <p className="text-sm text-gray-600 mb-4">احصل على التطبيق وابدأ التوفير!</p>
      <div className="flex justify-center gap-2">
        <img src="/images/appstore.png" alt="App Store" className="w-28" />
        <img src="/images/googleplay.png" alt="Google Play" className="w-28" />
      </div>
    </div>
  );
};

export default AppPromotionBox;
