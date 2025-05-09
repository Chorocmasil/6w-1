import { Lp } from "../../types/lp"; 

interface LPCardProps {
  lp: Lp;
}

const LPCard = ({ lp }: LPCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* 썸네일 이미지 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-48 object-cover"
      />
      
      {/* 제목 영역 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-semibold truncate">{lp.title}</h3>
      </div>
    </div>
  );
};

export default LPCard;
