import { motion, useReducedMotion, type Transition } from "framer-motion";
import RooftopMark from "./RooftopMark";

const TEXT_EASE = [0.22, 0.61, 0.36, 1] as const;
const LINE_EASE = [0.65, 0.05, 0.36, 1] as const;

/**
 * The reveal timeline begins after the icon finishes drawing (~1.5s):
 *   ROOFTOP blur-to-sharp → MANAGEMENT +300ms → divider rules → address last.
 * Delays are absolute (from load) so the sequence is deterministic.
 */
export default function App() {
  const reduce = useReducedMotion();

  // When reduced motion is requested, render everything in its final state.
  const t = (config: Transition): Transition =>
    reduce ? { duration: 0 } : config;
  const from = <T,>(motionState: T, rest: T): T => (reduce ? rest : motionState);

  return (
    <main className="stage">
      <div className="composition">
        <RooftopMark />

        <div className="lockup">
          <motion.h1
            className="wordmark"
            initial={from({ opacity: 0, filter: "blur(12px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0 })}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={t({ duration: 1.2, delay: 1.5, ease: TEXT_EASE })}
          >
            ROOFTOP
          </motion.h1>

          <div className="submark-row">
            <motion.span
              className="divider"
              initial={from({ scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.9 })}
              animate={{ scaleX: 1, opacity: 0.9 }}
              transition={t({ duration: 0.9, delay: 1.85, ease: LINE_EASE })}
            />
            <motion.span
              className="submark"
              initial={from({ opacity: 0, filter: "blur(8px)", y: 4 }, { opacity: 1, filter: "blur(0px)", y: 0 })}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={t({ duration: 1.1, delay: 1.8, ease: TEXT_EASE })}
            >
              MANAGEMENT
            </motion.span>
            <motion.span
              className="divider"
              initial={from({ scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.9 })}
              animate={{ scaleX: 1, opacity: 0.9 }}
              transition={t({ duration: 0.9, delay: 1.85, ease: LINE_EASE })}
            />
          </div>
        </div>

        <motion.address
          className="address"
          initial={from({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ duration: 1.4, delay: 2.45, ease: TEXT_EASE })}
        >
          <motion.span
            className="tick"
            initial={from({ scaleX: 0 }, { scaleX: 1 })}
            animate={{ scaleX: 1 }}
            transition={t({ duration: 0.8, delay: 2.55, ease: LINE_EASE })}
          />
          1055 WILSHIRE BLVD, SUITE 2200
          <br />
          LOS ANGELES, CALIFORNIA 90017
        </motion.address>
      </div>
    </main>
  );
}
