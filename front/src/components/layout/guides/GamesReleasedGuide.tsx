import { GuideComponent, GuideStep } from "../GuideComponent";

export const GamesReleasedGuide = () => {
  // Guide steps with instructions for using the Games Released Analysis page
  const guideSteps: GuideStep[] = [
    {
      id: "welcome",
      title: "Welcome to Games Released Analysis",
      description:
        "This page helps you explore the history of video game releases, track industry growth trends, and analyze sales performance by year. Let's see how it works!",
      position: {
        placement: "top",
        targetElement: "body",
      },
    },
    {
      id: "time-range",
      title: "Time Range Selection",
      description:
        "Use these buttons to select different time periods for your analysis. You can view data for all time or focus on the last 10, 20, or 30 years.",
      position: {
        placement: "bottom",
        targetElement: "#time-range-selector",
      },
    },
    {
      id: "timeline-chart",
      title: "Games Released Timeline",
      description:
        "This chart shows the number of games released (blue area) and total sales (green line) over time. Click on any year to see detailed information about games released that year.",
      position: {
        placement: "top",
        targetElement: ".h-96",
      },
    },
    {
      id: "brush-tool",
      title: "Timeline Navigation",
      description:
        "Use this brush tool to zoom in on specific time periods. Drag the handles to adjust the visible range and focus on particular years.",
      position: {
        placement: "bottom",
        targetElement: ".recharts-brush",
      },
    },
    {
      id: "growth-chart",
      title: "Year-over-Year Growth Chart",
      description:
        "This chart displays the annual growth rates for game releases (purple bars) and sales (orange line). Positive values indicate industry growth while negative values show decline.",
      position: {
        placement: "top",
        targetElement: ".lg\\:grid-cols-2 > div:first-child .h-80",
      },
    },
    {
      id: "sales-per-game",
      title: "Sales per Game Analysis",
      description:
        "This chart shows the average sales per game over time, helping you identify periods when games were particularly successful or struggled in the market.",
      position: {
        placement: "top",
        targetElement: ".lg\\:grid-cols-2 > div:last-child .h-80",
      },
    },
    {
      id: "year-analysis",
      title: "Year Analysis",
      description:
        "When you click a year on the timeline, this section appears with detailed statistics, including game count, total sales, and year-over-year growth.",
      position: {
        placement: "top",
        targetElement: ".mb-6 > .grid-cols-1 > .md\\:grid-cols-4",
      },
    },
    {
      id: "top-genres",
      title: "Top Genres Chart",
      description:
        "This chart shows the most popular genres for the selected year. You can see which game types dominated the market during that period.",
      position: {
        placement: "left",
        targetElement: ".md\\:grid-cols-2 > div:first-child .h-64",
      },
    },
    {
      id: "top-platforms",
      title: "Top Platforms Chart",
      description:
        "This chart displays the gaming platforms that had the most releases in the selected year. You can track the rise and fall of different consoles over time.",
      position: {
        placement: "right",
        targetElement: ".md\\:grid-cols-2 > div:last-child .h-64",
      },
    },
    {
      id: "publishers-table",
      title: "Top Publishers Table",
      description:
        "This table lists the most active publishers for the selected year, showing their game count, total sales, and average sales per game.",
      position: {
        placement: "bottom",
        targetElement: "table.min-w-full",
      },
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
      storageKey="gamesReleasedGuideCompleted"
      onComplete={handleGuideComplete}
    />
  );
};
