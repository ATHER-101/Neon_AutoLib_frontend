import { Paper } from "@mui/material";
import { useState } from "react";

const CoverImg = ({
  src,
  alt,
  fallbackSrc,
}: {
  src: string | undefined;
  alt: string;
  fallbackSrc: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <Paper
      component="img"
      src={imgSrc}
      alt={alt}
      onError={handleError}
      sx={{
        aspectRatio: "6 / 9",
        width: "100%",
        objectFit: "cover",
        borderRadius: 1.5,
      }}
    />
  );
};

export default CoverImg;
