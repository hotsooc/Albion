import React from 'react';
import Image from 'next/image';
import { ItemType } from '@/store/data';

type BuildCardProps = {
  title: string;
  buildData: ItemType;
};

const BuildCard: React.FC<BuildCardProps> = ({ title, buildData }) => {
  const getImageSource = () => {
    switch (title) {
      case 'Hellgate 5v5':
        return buildData.image || '/placeholder.png';
      case 'Hellgate 2v2':
        return buildData.image2 || buildData.image || '/placeholder.png';
      case 'Openworld':
        return buildData.image3 || buildData.image || '/placeholder.png';
      default:
        return '/placeholder.png';
    }
  };

  const imageSrc = getImageSource();

  return (
    <div className="rounded-xl shadow-xl flex flex-col items-center bg-white p-4 min-h-[400px] text-center relative transition-all duration-300 hover:-translate-y-2.5 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-5 text-accent-blue">{title}</h2>
      <div className="grid grid-cols-1 gap-4 mb-5">
        <Image src={imageSrc} alt={`${buildData.name} item`} width={300} height={300} />
        {/* <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} />
        <Image src={imageSrc} alt={`${buildData.name} item`} width={70} height={70} /> */}
      </div>
    </div>
  );
};

export default BuildCard;