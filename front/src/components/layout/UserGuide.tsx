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

export const UserGuide = () => {
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

  // Store original body overflow style
  const [originalBodyOverflow, setOriginalBodyOverflow] = useState("");

  // Check if the user has seen the guide before
  useEffect(() => {
    const guideCompleted = localStorage.getItem("vgSalesGuideCompleted");
    if (guideCompleted === "true") {
      setHasCompletedGuide(true);
      setIsVisible(false);
    }
  }, []);

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

  // Position the tooltip near the target element and scroll into view if needed
  useEffect(() => {
    if (!isVisible) return;

    const currentStep = guideSteps[currentStepIndex];
    const targetSelector = currentStep.position.targetElement;

    if (targetSelector === "body") {
      // Center in viewport for welcome step
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setTooltipPosition({
        left: viewportWidth / 2 - 200, // Assuming tooltip width ~400px
        top: viewportHeight / 2 - 150, // Roughly center vertically
      });

      setTargetElementDimensions({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      });

      return;
    }

    // Find the target element
    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    if (!targetElement) return;

    // Get dimensions and position
    const rect = targetElement.getBoundingClientRect();
    setTargetElementDimensions({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
    });

    // Check if element is in viewport
    const isElementInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    // Scroll element into view if needed
    if (!isElementInViewport) {
      // Calculate the scroll position to center the element
      const scrollOffset = rect.top - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({
        top: window.scrollY + scrollOffset,
        behavior: "smooth",
      });

      // Wait for scroll to complete before positioning tooltip
      setTimeout(() => {
        // Re-measure position after scrolling
        const updatedRect = targetElement.getBoundingClientRect();
        setTargetElementDimensions({
          width: updatedRect.width,
          height: updatedRect.height,
          top: updatedRect.top,
          left: updatedRect.left,
        });

        // Position tooltip based on updated measurements
        positionTooltip(updatedRect, currentStep);
      }, 500);
    } else {
      // Position tooltip immediately if element is in viewport
      positionTooltip(rect, currentStep);
    }
  }, [currentStepIndex, isVisible]);

  // Helper function to position tooltip
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
    if (top < 10) top = 10;
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - 10;
    }

    setTooltipPosition({ top, left });
  };

  // Guide steps with instructions for using the dashboard
  const guideSteps: GuideStep[] = [
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
    {
      id: "games-list",
      title: "Game Details",
      description:
        "After selecting a year, you'll see a list of games. Click on any game card to view detailed sales information. You can also search and sort the list.",
      position: {
        placement: "top",
        targetElement: ".games-list",
      },
    },
  ];

  const currentStep = guideSteps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < guideSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeGuide();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeGuide = () => {
    localStorage.setItem("vgSalesGuideCompleted", "true");
    setHasCompletedGuide(true);
    setIsVisible(false);
  };

  const resetGuide = () => {
    setCurrentStepIndex(0);
    setIsVisible(true);
  };

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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute"
                style={{
                  top: targetElementDimensions.top - 8,
                  left: targetElementDimensions.left - 8,
                  width: targetElementDimensions.width + 16,
                  height: targetElementDimensions.height + 16,
                  boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.75)",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          {/* Tooltip */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            <motion.div
              ref={tooltipRef}
              key={currentStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute max-w-md p-6 bg-white rounded-lg shadow-xl pointer-events-auto dark:bg-gray-800"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              {/* Connecting line to target element (optional) */}
              {currentStep.position.targetElement !== "body" && (
                <div
                  className="absolute w-2 h-2 bg-white dark:bg-gray-800"
                  style={{
                    [currentStep.position.placement === "top"
                      ? "bottom"
                      : currentStep.position.placement === "bottom"
                      ? "top"
                      : currentStep.position.placement === "left"
                      ? "right"
                      : "left"]: "-8px",
                    transform: "rotate(45deg)",
                    left:
                      currentStep.position.placement === "top" ||
                      currentStep.position.placement === "bottom"
                        ? "50%"
                        : currentStep.position.placement === "left"
                        ? "calc(100% - 5px)"
                        : "5px",
                    top:
                      currentStep.position.placement === "left" ||
                      currentStep.position.placement === "right"
                        ? "50%"
                        : currentStep.position.placement === "top"
                        ? "calc(100% - 5px)"
                        : "5px",
                  }}
                />
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentStep.title}
                </h3>
                <button
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
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {currentStep.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {guideSteps.map((_, index) => (
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
                    disabled={currentStepIndex === 0}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md disabled:opacity-50 dark:text-gray-300 dark:border-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {currentStepIndex === guideSteps.length - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              </div>
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
