import { GuideComponent, GuideStep } from "../GuideComponent";

export const ConsoleAnalysisGuide = () => {
  // Guide steps with instructions for using the Console Analysis page
  const guideSteps: GuideStep[] = [
    {
      id: "welcome",
      title: "Welcome to Console Analysis",
      description:
        "This page helps you explore gaming platforms, analyze their sales performance, compare different consoles, and understand market trends. Let's see how it works!",
      position: {
        placement: "top",
        targetElement: "body",
      },
    },
    {
      id: "console-family-filter",
      title: "Console Family Filter",
      description:
        "Use these buttons to filter consoles by their family (Nintendo, PlayStation, Xbox, etc.). This helps you focus your analysis on specific console ecosystems.",
      position: {
        placement: "bottom",
        targetElement:
          ".p-4.mb-6.bg-white.rounded-lg.shadow-md.dark\\:bg-gray-800",
      },
    },
    {
      id: "sales-by-platform",
      title: "Sales by Platform",
      description:
        "This chart shows total global sales for each gaming platform. Click on any bar to see detailed information about that specific console.",
      position: {
        placement: "left",
        targetElement: ".lg\\:grid-cols-2 > div:first-child .h-96",
      },
    },
    {
      id: "market-share",
      title: "Market Share Chart",
      description:
        "This pie chart displays the relative market share of the top gaming platforms. The percentage shows each console's contribution to the overall gaming market.",
      position: {
        placement: "right",
        targetElement: ".lg\\:grid-cols-2 > div:last-child .h-96",
      },
    },
    {
      id: "platform-efficiency",
      title: "Platform Efficiency Analysis",
      description:
        "This scatter plot shows the relationship between a console's game library size and its sales per game. Larger bubbles represent platforms with higher total sales.",
      position: {
        placement: "top",
        targetElement:
          ".p-4.mb-6.bg-white.rounded-lg.shadow-md.dark\\:bg-gray-800 .h-96",
      },
    },
    {
      id: "efficiency-legend",
      title: "Console Family Legend",
      description:
        "This color-coded legend helps you identify different console families in the scatter plot (Nintendo in blue, PlayStation in orange, Xbox in green, etc.).",
      position: {
        placement: "top",
        targetElement: ".recharts-legend-wrapper",
      },
    },
    {
      id: "top-platforms-table",
      title: "Top Platforms Table",
      description:
        "This table ranks platforms by their sales efficiency (sales per game). Click on any row to select that console for detailed analysis.",
      position: {
        placement: "bottom",
        targetElement: "table.min-w-full",
      },
    },
    {
      id: "console-details",
      title: "Console Details Section",
      description:
        "When you select a console, this section appears with key statistics including total games, global sales, sales per game, and market share percentage.",
      position: {
        placement: "top",
        targetElement: ".grid.grid-cols-1.gap-4.mb-6.md\\:grid-cols-4",
      },
      // This may not be visible initially, so we'll handle visibility differently
    },
    {
      id: "regional-distribution",
      title: "Regional Sales Distribution",
      description:
        "This pie chart shows how a console's sales are distributed across different regions (North America, Europe, Japan, and other markets).",
      position: {
        placement: "left",
        targetElement:
          ".grid.grid-cols-1.gap-6.md\\:grid-cols-2 > div:first-child .h-64",
      },
      // This may not be visible initially
    },
    {
      id: "top-genres",
      title: "Top Genres Chart",
      description:
        "This chart displays the most popular game genres for the selected console, helping you understand which types of games performed best on that platform.",
      position: {
        placement: "right",
        targetElement:
          ".grid.grid-cols-1.gap-6.md\\:grid-cols-2 > div:last-child .h-64",
      },
      // This may not be visible initially
    },
  ];

  // Scrolling back to top when guide is completed
  const handleGuideComplete = () => {
    // Scroll back to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <GuideComponent
      guideSteps={guideSteps}
      storageKey="consoleAnalysisGuideCompleted"
      onComplete={handleGuideComplete}
    />
  );
};
