import { GuideComponent, GuideStep } from "../GuideComponent";

interface UserGuideProps {
  showGamesListOnly?: boolean;
}

export const UserGuide = ({ showGamesListOnly = false }: UserGuideProps) => {
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

  // Select the appropriate storage key based on the guide type
  const storageKey = showGamesListOnly
    ? "vgSalesGamesListGuideCompleted"
    : "vgSalesGuideCompleted";

  return <GuideComponent guideSteps={guideSteps} storageKey={storageKey} />;
};
