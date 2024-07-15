import LazyLoad from "react-lazyload";
import CoverImg from "./CoverImg";

const LazyLoadedImage = ({
  src,
  alt,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  fallbackSrc: string;
}) => (
  <LazyLoad offset={200} once>
    <CoverImg src={src} alt={alt} fallbackSrc={fallbackSrc} />
  </LazyLoad>
);

export default LazyLoadedImage;
