import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Geometry traced directly from the source artwork (viewBox 222 × 232):
 *  - apex (111,1); roof corners (3,73) / (219,73); verticals fall to y=231
 *  - the centre spire runs apex → base
 *  - GLOSS is the lit "polished metal" face on the inner-right of the spire
 */
const OUTER = "M3 231 L3 73 L111 1 L219 73 L219 231";
const CENTER = "M111 231 L111 1";
const GLOSS = "M111 4 L160 36 L171 56 L150 96 L111 110 Z";

const DRAW_EASE = [0.65, 0.05, 0.36, 1] as const;

export default function RooftopMark() {
  const reduce = useReducedMotion();

  // Pointer parallax — the highlight grazes the mark like light on polished
  // metal. Springs make it viscous; travel is intentionally tiny (~1–2%).
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 32, damping: 24, mass: 1.4 });
  const sy = useSpring(my, { stiffness: 32, damping: 24, mass: 1.4 });
  const glossX = useTransform(sx, [0, 1], [-3, 3]);
  const glossY = useTransform(sy, [0, 1], [-2, 2]);
  const haloX = useTransform(sx, [0, 1], ["44%", "56%"]);
  const haloY = useTransform(sy, [0, 1], ["40%", "58%"]);
  const haloBg = useTransform(
    [haloX, haloY] as const,
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(120,195,255,0.22) 0%, rgba(46,167,255,0.05) 32%, transparent 60%)`,
  );

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <div className="mark">
      {/* pointer-tracked bloom behind the mark */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-32%",
          pointerEvents: "none",
          mixBlendMode: "screen",
          filter: "blur(6px)",
          background: haloBg,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.5 }}
      />

      <svg viewBox="0 0 222 232" role="img" aria-label="Rooftop Management">
        <defs>
          <linearGradient id="gloss-grad" x1="0.1" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#9bd4ff" stopOpacity="0.42" />
            <stop offset="0.45" stopColor="#2ea7ff" stopOpacity="0.14" />
            <stop offset="1" stopColor="#2ea7ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sheen-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.85" />
            </feComponentTransfer>
          </filter>
          <clipPath id="mark-clip">
            <path d={OUTER} fill="none" stroke="#fff" strokeWidth="10" />
            <path d={CENTER} fill="none" stroke="#fff" strokeWidth="10" />
            <path d={GLOSS} fill="#fff" />
          </clipPath>
        </defs>

        {/* breathing glow — blurred copy of the strokes, ~10s, near-imperceptible */}
        <motion.g
          aria-hidden
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 0.45 : [0.3, 0.62, 0.3] }}
          transition={{
            duration: 10,
            repeat: reduce ? 0 : Infinity,
            ease: "easeInOut",
            delay: 1.6,
          }}
        >
          <path className="stroke" d={OUTER} style={{ strokeWidth: 7, opacity: 0.6 }} />
          <path className="stroke" d={CENTER} style={{ strokeWidth: 7, opacity: 0.6 }} />
        </motion.g>

        {/* polished-metal lit face; drifts with the pointer */}
        <motion.path
          d={GLOSS}
          fill="url(#gloss-grad)"
          style={{ x: glossX, y: glossY, mixBlendMode: "screen" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.4 }}
        />

        {/* drawn strokes */}
        <motion.path
          className="stroke"
          d={OUTER}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.0, delay: 0.15, ease: DRAW_EASE }}
        />
        <motion.path
          className="stroke"
          d={CENTER}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 0.85, delay: 0.6, ease: DRAW_EASE }}
        />

        {/* specular sweep crossing the mark every ~24s. The skew lives on a
            wrapping group so Framer can own the rect's animated x transform. */}
        {!reduce && (
          <g clipPath="url(#mark-clip)">
            <g transform="skewX(-16deg)">
              <motion.rect
                x={0}
                y={-20}
                width={58}
                height={280}
                fill="url(#sheen-grad)"
                style={{ mixBlendMode: "screen" }}
                initial={{ x: -160, opacity: 0 }}
                animate={{ x: [-160, 250], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 2.6,
                  delay: 5,
                  repeat: Infinity,
                  repeatDelay: 21.4,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
