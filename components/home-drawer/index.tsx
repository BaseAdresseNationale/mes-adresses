import { Pane, Pulsar, Spinner, Tab, Tablist } from "evergreen-ui";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TrainingTab from "./training-tab";
import NewsTab from "./news-tab";
import { EventType } from "@/lib/bal-admin/type";
import { NewsType } from "@/lib/mattermost/type";
import LocalStorageContext from "@/contexts/local-storage";

const StyledDrawer = styled.div`
  height: 100%;
  width: 410px;
  background: white;
  border-left: 1px solid #e4e7eb;
  transition: right 0.3s ease;
  overflow: auto;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

function HomeDrawer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [news, setNews] = useState<NewsType[]>([]);
  const [nextTrainings, setNextTrainings] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lastNewsSeen, setLastNewsSeen } = useContext(LocalStorageContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/home-drawer-data");
        const { news, nextTrainings } = await response.json();

        setNews(news);
        setNextTrainings(nextTrainings);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const tabs = useMemo(() => {
    const lastNews = news?.[0];
    const showPulsar = lastNews && lastNews.id !== lastNewsSeen;

    return [
      { label: "Prochaines formations" },
      { label: "Actualités", showPulsar: showPulsar },
    ];
  }, [news, lastNewsSeen]);

  const updateLastNewsSeen = useCallback(
    (newsId: string) => {
      setLastNewsSeen(newsId);
    },
    [setLastNewsSeen]
  );

  return (
    <StyledDrawer>
      <Tablist padding={8}>
        {tabs.map(({ label, showPulsar }, index) => (
          <Tab
            key={label}
            isSelected={selectedIndex === index}
            onSelect={() => setSelectedIndex(index)}
            position="relative"
          >
            {showPulsar && (
              <Pane position="absolute" top={0} right={0}>
                <Pulsar />
              </Pane>
            )}
            {label}
          </Tab>
        ))}
      </Tablist>
      {isLoading && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          <Spinner />
        </Pane>
      )}
      {!isLoading && selectedIndex === 0 && (
        <TrainingTab nextTrainings={nextTrainings} />
      )}
      {!isLoading && selectedIndex === 1 && (
        <NewsTab news={news} updateLastNewsSeen={updateLastNewsSeen} />
      )}
    </StyledDrawer>
  );
}

export default HomeDrawer;
