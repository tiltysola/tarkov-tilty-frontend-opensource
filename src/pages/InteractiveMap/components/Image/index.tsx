import { Image } from 'react-konva';

import { ImageConfig } from 'konva/lib/shapes/Image';
import useImage from 'use-image';

interface ImageProps {
  imageSrc: string;
}

type OmitImageConfig = Omit<ImageConfig, 'image'>;

const Index = (props: OmitImageConfig & ImageProps) => {
  const { imageSrc } = props;

  const [image, status] = useImage(imageSrc);

  if (status === 'loaded') {
    return <Image image={image} {...props} />;
  } else {
    return null;
  }
};

export default Index;
