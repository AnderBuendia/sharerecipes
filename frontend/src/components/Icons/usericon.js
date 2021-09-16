import Image from 'next/image';
const UserIcon = ({ imageUrl, imageName, w, h }) => {
  const image = imageUrl ? imageUrl : '/usericon.jpeg';
  const name = imageName ? imageName : 'UserIcon Image';

  return (
    <Image
      className="block rounded-full"
      src={image}
      alt={name}
      width={w}
      height={h}
    />
  );
};

export default UserIcon;
