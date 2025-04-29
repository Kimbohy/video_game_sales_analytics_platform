import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  position: {
    placement: "top" | "bottom" | "left" | "right";
    targetElement: string;
  };
}

interface UserGuideProps {
  showGamesListOnly?: boolean;
}

export const UserGuide = ({ showGamesListOnly = false }: UserGuideProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasCompletedGuide, setHasCompletedGuide] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [targetElementDimensions, setTargetElementDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const animationInProgressRef = useRef(false);

  // Store original body overflow style
  const [originalBodyOverflow, setOriginalBodyOverflow] = useState("");

  // Guide steps with instructions for using the dashboard
  const dashboardGuideSteps: GuideStep[] = [
    {
      id: "welcome",
      title: "Welcome to Video Game Sales Analytics",
      description:
        "This dashboard helps you explore video game sales data across different platforms, genres, and years. Let's take a quick tour!",
      position: {
        placement: "top",
        targetElement: "body",
      },
    },
    {
      id: "timeline",
      title: "Timeline Chart",
      description:
        "Click on any year in this chart to see detailed games released during that period. The blue line shows total sales while the green line shows the number of games released.",
      position: {
        placement: "bottom",
        targetElement: ".timeline-chart",
      },
    },
    {
      id: "platform-chart",
      title: "Platform Sales Distribution",
      description:
        "This chart shows sales by platform. Click on any bar to filter the dashboard by that platform. Each color represents a different region.",
      position: {
        placement: "left",
        targetElement: ".platform-chart",
      },
    },
    {
      id: "genre-chart",
      title: "Genre Distribution",
      description:
        "The pie chart shows sales by genre. Click on any slice to filter the dashboard by that genre. You can combine filters for deeper analysis.",
      position: {
        placement: "right",
        targetElement: ".genre-chart",
      },
    },
    {
      id: "filters",
      title: "Active Filters",
      description:
        "When you select filters, they'll appear here. Click the '×' button to remove a filter. Use the 'Reset Filters' button to clear all selections.",
      position: {
        placement: "bottom",
        targetElement: ".active-filters",
      },
    },
  ];

  // Specific guide steps for the games list view
  const gamesListGuideSteps: GuideStep[] = [
    {
      id: "games-list-intro",
      title: "Games List View",
      description:
        "You're now viewing games released in the selected year. This view shows you detailed information about each game.",
      position: {
        placement: "top",
        targetElement: ".games-list",
      },
    },
    {
      id: "games-search",
      title: "Search and Filter",
      description:
        "Use the search box to find specific games, platforms, genres, or publishers. The results will update instantly as you type.",
      position: {
        placement: "bottom",
        targetElement: "input[type='text']",
      },
    },
    {
      id: "games-sort",
      title: "Sort Games",
      description:
        "You can sort the games by name, sales figures, platform, or genre by clicking these buttons. Click again to reverse the sort order.",
      position: {
        placement: "bottom",
        targetElement:
          ".games-list button[class*='flex items-center gap-1 px-3']",
      },
    },
    {
      id: "games-cards",
      title: "Game Cards",
      description:
        "Click on any game card to see detailed sales information. You can also click on the platform or genre tags to filter the dashboard.",
      position: {
        placement: "right",
        targetElement: ".games-list .grid > div:first-child",
      },
    },
    {
      id: "games-back",
      title: "Return to Overview",
      description:
        "Click this back button to return to the dashboard overview and see the timeline chart again.",
      position: {
        placement: "right",
        targetElement:
          ".games-list button[class*='p-2 text-gray-600 rounded-full']",
      },
    },
  ];

  // Select which steps to show based on the showGamesListOnly prop
  const guideSteps = showGamesListOnly
    ? gamesListGuideSteps
    : dashboardGuideSteps;

  // Check if the specified element exists in the DOM
  const checkElementExists = (selector: string): boolean => {
    if (selector === "body") return true;
    return document.querySelector(selector) !== null;
  };

  // Filter steps to only include those whose elements are currently in the DOM
  // Moved inside useEffect to prevent re-calculating on every render
  const [availableSteps, setAvailableSteps] = useState<GuideStep[]>([]);

  // Update available steps when guide steps change
  useEffect(() => {
    const steps = guideSteps.filter((step) =>
      checkElementExists(step.position.targetElement)
    );
    setAvailableSteps(steps);

    // Reset current step index when available steps change
    if (steps.length > 0) {
      setCurrentStepIndex(0);
    }
  }, [showGamesListOnly]); // Only recalculate when showGamesListOnly changes

  // Check if the user has seen the guide before
  useEffect(() => {
    const storageKey = showGamesListOnly
      ? "vgSalesGamesListGuideCompleted"
      : "vgSalesGuideCompleted";
    const guideCompleted = localStorage.getItem(storageKey);
    if (guideCompleted === "true") {
      setHasCompletedGuide(true);
      setIsVisible(false);
    } else {
      setHasCompletedGuide(false);
      setIsVisible(true);
    }
  }, [showGamesListOnly]);

  // Block scrolling when guide is active
  useEffect(() => {
    if (isVisible) {
      // Store the original overflow style
      setOriginalBodyOverflow(document.body.style.overflow);
      // Block scrolling
      document.body.style.overflow = "hidden";
    } else if (originalBodyOverflow) {
      // Restore original overflow when guide is hidden
      document.body.style.overflow = originalBodyOverflow;
    }

    // Cleanup function to restore original overflow on unmount
    return () => {
      document.body.style.overflow = originalBodyOverflow || "";
    };
  }, [isVisible, originalBodyOverflow]);

  // Get element position and dimensions safely
  const getElementRect = (selector: string): DOMRect => {
    if (selector === "body") {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Create a DOMRect centered in the viewport
      return new DOMRect(viewportWidth / 2, viewportHeight / 2, 0, 0);
    }

    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      // Return a default DOMRect if element not found
      return new DOMRect(0, 0, 0, 0);
    }

    return element.getBoundingClientRect();
  };

  // Smooth scrolling to target element
  const scrollToElement = (rect: DOMRect, callback: () => void) => {
    // Check if element is in viewport
    const isElementInViewport =
      rect.top >= 50 &&
      rect.left >= 50 &&
      rect.bottom <= window.innerHeight - 50 &&
      rect.right <= window.innerWidth - 50;

    if (!isElementInViewport) {
      // Calculate the scroll position to center the element
      const scrollOffset = rect.top - window.innerHeight / 2 + rect.height / 2;

      // Set animation flag
      animationInProgressRef.current = true;

      window.scrollTo({
        top: window.scrollY + scrollOffset,
        behavior: "smooth",
      });

      // Wait for scroll to complete before callback
      setTimeout(() => {
        animationInProgressRef.current = false;
        callback();
      }, 500);
    } else {
      // Element is in viewport, no need to scroll
      callback();
    }
  };

  // Position tooltip with transition animation
  const positionTooltip = (rect: DOMRect, step: GuideStep) => {
    const tooltipHeight = tooltipRef.current?.offsetHeight || 250;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 400;

    let top = 0;
    let left = 0;

    switch (step.position.placement) {
      case "top":
        top = rect.top - tooltipHeight - 20;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - 20;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + 20;
        break;
    }

    // Ensure tooltip stays within viewport
    if (top < 20) top = 20;
    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) {
      left = window.innerWidth - tooltipWidth - 20;
    }
    if (top + tooltipHeight > window.innerHeight - 20) {
      top = window.innerHeight - tooltipHeight - 20;
    }

    setTooltipPosition({ top, left });
  };

  // Update target element highlight and tooltip position
  const updateElementHighlight = (stepIndex: number) => {
    if (!isVisible || availableSteps.length === 0) return;

    const step = availableSteps[stepIndex];
    if (!step) return;

    const rect = getElementRect(step.position.targetElement);

    // First update the spotlight position
    setTargetElementDimensions({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
    });

    // Then scroll if needed and position tooltip
    scrollToElement(rect, () => {
      // Get fresh position after scrolling
      const updatedRect = getElementRect(step.position.targetElement);
      positionTooltip(updatedRect, step);
    });
  };

  // Position the tooltip near the target element and scroll into view if needed
  useEffect(() => {
    if (!isVisible || availableSteps.length === 0) return;

    const handleScroll = () => {
      // Update highlight position after scrolling
      if (currentStepIndex < availableSteps.length) {
        const currentStep = availableSteps[currentStepIndex];
        const element = document.querySelector(
          currentStep.position.targetElement
        ) as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          // Update spotlight position
          setTargetElementDimensions({
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
          });
          // Update tooltip position
          positionTooltip(rect, currentStep);
        }
      }
    };

    // Add a small delay to ensure DOM elements are fully rendered
    const timeoutId = setTimeout(() => {
      if (currentStepIndex < availableSteps.length) {
        updateElementHighlight(currentStepIndex);
      }
    }, 100);

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentStepIndex, isVisible, availableSteps.length]); // Only depend on the length, not the entire array

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (
        isVisible &&
        availableSteps.length > 0 &&
        currentStepIndex < availableSteps.length
      ) {
        // Use a debounce technique to avoid too many updates
        if (animationInProgressRef.current) return;

        animationInProgressRef.current = true;
        setTimeout(() => {
          updateElementHighlight(currentStepIndex);
          animationInProgressRef.current = false;
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible, currentStepIndex, availableSteps.length]);

  const currentStep = availableSteps[currentStepIndex] || guideSteps[0];

  const handleNextStep = () => {
    if (animationInProgressRef.current) return;

    if (currentStepIndex < availableSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeGuide();
    }
  };

  const handlePrevStep = () => {
    if (animationInProgressRef.current) return;

    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeGuide = () => {
    const storageKey = showGamesListOnly
      ? "vgSalesGamesListGuideCompleted"
      : "vgSalesGuideCompleted";
    localStorage.setItem(storageKey, "true");
    setHasCompletedGuide(true);
    setIsVisible(false);
  };

  const resetGuide = () => {
    setCurrentStepIndex(0);
    setIsVisible(true);
  };

  // If there are no available steps, don't show the guide
  if (availableSteps.length === 0) {
    return null;
  }

  if (hasCompletedGuide && !isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={resetGuide}
        className="fixed z-50 p-3 text-white bg-indigo-600 rounded-full shadow-lg bottom-4 right-4 hover:bg-indigo-700"
        title="Show Guide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Spotlight overlay */}
          <div className="fixed inset-0 z-40 pointer-events-none bg-black/50">
            {/* Transparent cutout for highlighted element */}
            {currentStep.position.targetElement !== "body" && (
              <motion.div
                initial={false}
                animate={{
                  top: targetElementDimensions.top - 8,
                  left: targetElementDimensions.left - 8,
                  width: targetElementDimensions.width + 16,
                  height: targetElementDimensions.height + 16,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                className="absolute"
                style={{
                  boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.75)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "2px solid rgba(99, 102, 241, 0.8)",
                  borderRadius: "8px",
                  pointerEvents: "none",
                  backdropFilter: "blur(0px)",
                  boxSizing: "content-box",
                }}
              />
            )}
          </div>

          {/* Tooltip */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            <motion.div
              ref={tooltipRef}
              layout
              key={`tooltip-${currentStep.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="absolute max-w-md p-6 bg-white rounded-lg shadow-xl pointer-events-auto dark:bg-gray-800"
            >
              {/* Arrow pointing to target element */}
              {currentStep.position.targetElement !== "body" && (
                <motion.div
                  layout
                  className="absolute w-3 h-3 bg-white dark:bg-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    [currentStep.position.placement === "top"
                      ? "bottom"
                      : currentStep.position.placement === "bottom"
                      ? "top"
                      : currentStep.position.placement === "left"
                      ? "right"
                      : "left"]: "-6px",
                    transform: "rotate(45deg)",
                    left:
                      currentStep.position.placement === "top" ||
                      currentStep.position.placement === "bottom"
                        ? "50%"
                        : currentStep.position.placement === "left"
                        ? "calc(100% - 6px)"
                        : "6px",
                    top:
                      currentStep.position.placement === "left" ||
                      currentStep.position.placement === "right"
                        ? "50%"
                        : currentStep.position.placement === "top"
                        ? "calc(100% - 6px)"
                        : "6px",
                    marginLeft:
                      currentStep.position.placement === "top" ||
                      currentStep.position.placement === "bottom"
                        ? "-6px"
                        : "0",
                    marginTop:
                      currentStep.position.placement === "left" ||
                      currentStep.position.placement === "right"
                        ? "-6px"
                        : "0",
                    zIndex: -1,
                  }}
                />
              )}

              <div className="flex items-center justify-between mb-4">
                <motion.h3
                  layout
                  className="text-xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentStep.title}
                </motion.h3>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={completeGuide}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </div>
              <motion.div
                layout
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-600 dark:text-gray-300">
                  {currentStep.description}
                </p>
              </motion.div>
              <motion.div
                layout
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-1">
                  {availableSteps.map((_, index) => (
                    <span
                      key={index}
                      className={`block w-2 h-2 rounded-full ${
                        index === currentStepIndex
                          ? "bg-indigo-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevStep}
                    disabled={
                      currentStepIndex === 0 || animationInProgressRef.current
                    }
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md disabled:opacity-50 dark:text-gray-300 dark:border-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={animationInProgressRef.current}
                    className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {currentStepIndex === availableSteps.length - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Clickable overlay to enable interaction with highlighted element */}
          {currentStep.position.targetElement !== "body" && (
            <div
              className="fixed inset-0 z-30 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: "all" }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};
