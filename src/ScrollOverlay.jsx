import { useState, useEffect } from 'react';
import { useStore } from './store';

const scrollContent = {
  1: {
    title: "The Pastoral — The Romantic Sublime",
    content: `In the early 19th century, artists believed nature held divine power. Mountains weren't obstacles; they were cathedrals. Waterfalls weren't just water; they were glimpses of the infinite.

This was the Romantic Sublime: the belief that nature could overwhelm the human spirit with awe and terror, revealing truths that reason could never reach.

Stand here, in this pastoral paradise, and feel what the Romantics felt: that nature is not merely scenery, but a doorway to something greater than ourselves.`,
    attribution: "— Inspired by Leo Marx, The Machine in the Garden (1964)"
  },
  2: {
    title: "The Machine — The Futurist Manifesto",
    content: `"We declare that the splendor of the world has been enriched by a new beauty: the beauty of speed!"

In 1909, the Futurists declared war on the past. Museums were cemeteries. Tradition was a prison. Only the machine, roaring, racing, ruthless, could set humanity free.

They painted not sunsets, but simultaneity: the blur of motion, the fracture of time. A speeding car was more beautiful than the Victory of Samothrace. Factory smoke was the incense of progress.

Look around you. This is their vision made real.`,
    attribution: "— Inspired by Richard Humphreys, Futurism (1999)"
  },
  3: {
    title: "Synthesis",
    content: `What you see before you is neither purely natural nor wholly artificial; it is something new.

Crystalline prisms float in an infinite sky, yet moss and vegetation cling to their geometric faces. Light refracts through mathematical forms while life finds purchase in impossible places.

This is the question our age must answer: Can the machine and the garden coexist? Can technology become a scaffold for nature rather than its replacement?

Perhaps the future is not a choice between the pastoral and the industrial, but a synthesis: where human creation and natural growth intertwine like vines on crystal.`,
    attribution: "— A meditation on Leo Marx and environmental art"
  }
};

export default function ScrollOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const level = useStore((state) => state.level);
  const isTransitioning = useStore((state) => state.isTransitioning);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        if (!isTransitioning) {
          setIsVisible(prev => !prev);
        }
      }
      // Also close with Escape
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isTransitioning]);

  // Close scroll when transitioning between levels
  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(false);
    }
  }, [isTransitioning]);

  const content = scrollContent[level] || scrollContent[1];

  return (
    <>
      {/* Hint text */}
      <div className="scroll-hint">
        Press <span className="key-hint">P</span> to read about this world
      </div>

      {/* Scroll overlay */}
      <div className={`scroll-overlay ${isVisible ? 'visible' : ''}`}>
        <div className="scroll-backdrop" onClick={() => setIsVisible(false)} />
        <div className="scroll-container">
          <div className="scroll-paper">
            <div className="scroll-header">
              <h2 className="scroll-title">{content.title}</h2>
              <button 
                className="scroll-close" 
                onClick={() => setIsVisible(false)}
                aria-label="Close scroll"
              >
                ×
              </button>
            </div>
            <div className="scroll-content">
              {content.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="scroll-attribution">
              {content.attribution}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
