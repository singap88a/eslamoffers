import Image from 'next/image';

const CouponCard = ({ title, discount, img, buttonText }) => {
  return (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 shadow-md w-full max-w-xs">
      <div className="mb-3">
        <Image src={img} alt={title} width={100} height={40} />
      </div>
      <h3 className="text-md font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{discount}</p>
      <button className="bg-[#14b8a6] text-white text-sm font-bold px-4 py-2 rounded-md w-full hover:bg-[#0d9488] transition">
        {buttonText}
      </button>
    </div>
  );
};

export default CouponCard;
