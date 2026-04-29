import Lottie from "lottie-react";
import { CSSProperties } from "react";

interface Props {
  data: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Reusable Lottie wrapper. Pass any imported JSON. */
const LottieIcon = ({ data, loop = true, autoplay = true, className, style }: Props) => (
  <Lottie animationData={data} loop={loop} autoplay={autoplay} className={className} style={style} />
);

export default LottieIcon;
