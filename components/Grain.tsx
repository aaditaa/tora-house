/**
 * One full-page grain overlay. It is what makes the warm neutrals read as paper
 * rather than as beige CSS, and it should be felt rather than seen: 3.5% opacity,
 * fixed, pointer-events none, above the background and below the content.
 */
export function Grain() {
  return (
    <svg className="grain" aria-hidden="true" focusable="false" data-print-hide>
      <filter id="paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}
