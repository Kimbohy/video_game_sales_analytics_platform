import { GuideComponent, GuideStep } from "../GuideComponent";

export const GenreAnalysisGuide = () => {
  // Guide steps with instructions for using the Genre Analysis page
  const guideSteps: GuideStep[] = [
    {
      id: "welcome",
      title: "Welcome to Genre Analysis",
      description:
        "This page helps you explore game genres, their popularity, sales performance, and platform distribution. Let's see how it works!",
      position: {
        placement: "top",
        targetElement: "body",
      },
    },
    {
      id: "analysis-mode",
      title: "Analysis Mode",
      description:
        "Toggle between Single Genre and Compare Genres modes. Single mode lets you analyze one genre in detail, while Compare mode allows you to compare up to 5 genres side by side.",
      position: {
        placement: "bottom",
        targetElement:
          ".mb-6.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-md.p-4",
      },
    },
    {
      id: "sales-by-genre",
      title: "Sales by Genre",
      description:
        "This chart displays total sales for each genre. Click on any bar to select that genre for detailed analysis. The longer the bar, the higher the sales.",
      position: {
        placement: "left",
        targetElement: ".lg\\:grid-cols-2 > div:first-child .h-96",
      },
    },
    {
      id: "game-count",
      title: "Game Count by Genre",
      description:
        "This pie chart shows the number of games in each genre. The size of each slice represents the proportion of games in that genre. Click on a slice to select a genre.",
      position: {
        placement: "right",
        targetElement: ".lg\\:grid-cols-2 > div:last-child .h-96",
      },
    },
    {
      id: "sales-per-game",
      title: "Sales Efficiency Analysis",
      description:
        "This chart shows the average sales per game for each genre. Higher values indicate genres with greater commercial success per title released.",
      position: {
        placement: "top",
        targetElement:
          ".mb-6.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-md.p-4 .h-80",
      },
    },
    {
      id: "genre-stats",
      title: "Genre Statistics",
      description:
        "When you select a genre, this section appears with key statistics including game count, global sales, sales per game, and average critic score.",
      position: {
        placement: "top",
        targetElement: ".grid.grid-cols-1.md\\:grid-cols-4.gap-4.mb-6",
      },
    },
    {
      id: "platforms-distribution",
      title: "Platform Distribution",
      description:
        "This pie chart shows which platforms have the most games for the selected genre. It helps you understand where the genre is most popular.",
      position: {
        placement: "left",
        targetElement:
          ".grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:first-child .h-64",
      },
    },
    {
      id: "top-publishers",
      title: "Top Publishers",
      description:
        "This chart displays the publishers with the most games in the selected genre, helping you identify which companies specialize in this type of game.",
      position: {
        placement: "right",
        targetElement:
          ".grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:last-child .h-64",
      },
    },
    {
      id: "top-games",
      title: "Top Games in Genre",
      description:
        "This table lists the best-selling games in the selected genre, showing their platform, publisher, critic score, and sales figures.",
      position: {
        placement: "bottom",
        targetElement: "table.min-w-full",
      },
    },
    {
      id: "compare-mode",
      title: "Genre Comparison Mode",
      description:
        "When comparing genres, you'll see advanced visualization tools like the radar chart that lets you compare multiple aspects of different genres simultaneously.",
      position: {
        placement: "top",
        targetElement:
          ".space-y-6 .bg-white.dark\\:bg-gray-800.rounded-lg.shadow-md.p-4.mb-6 .h-96",
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
      storageKey="genreAnalysisGuideCompleted"
      onComplete={handleGuideComplete}
    />
  );
};
