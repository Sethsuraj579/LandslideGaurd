import { ASSETS, CUTOUT_SVG, NAMES, type Lens } from "./heroAssets";

type Props = { slot: "l" | "r"; lens: Lens; onSelect: (lens: Lens) => void };

export default function HeroLens({ slot, lens, onSelect }: Props) {
  const asset = ASSETS[lens];
  return <button className={`lens lens-${slot}`} type="button" onClick={() => onSelect(lens)} aria-label={`Show ${NAMES[lens]} layer`}>
    {asset.cutout ? <img src={asset.cutout} alt="" className="is-shown" /> : <span dangerouslySetInnerHTML={{ __html: CUTOUT_SVG[lens] }} />}
  </button>;
}