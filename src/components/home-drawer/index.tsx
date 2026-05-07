import { Heading, Pane, Pulsar, Spinner, Tab, Tablist } from "evergreen-ui";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TrainingTab from "./training-tab";
import NewsTab from "./news-tab";
import { EventType } from "@/lib/bal-admin/type";
import { NewsType } from "@/lib/mattermost/type";
import LocalStorageContext from "@/contexts/local-storage";
import styles from "./home-drawer.module.css";

const WIDE_BREAKPOINT = 1500;

function HomeDrawer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [news, setNews] = useState<NewsType[]>([]);
  const [nextTrainings, setNextTrainings] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWide, setIsWide] = useState(false);
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

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${WIDE_BREAKPOINT}px)`);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsWide(event.matches);
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const lastNews = news?.[0];
  const showPulsar = lastNews && lastNews.id !== lastNewsSeen;

  const tabs = useMemo(() => {
    return [
      { label: "Prochaines formations" },
      { label: "Actualités", showPulsar: showPulsar },
    ];
  }, [showPulsar]);

  const updateLastNewsSeen = useCallback(
    (newsId: string) => {
      setLastNewsSeen(newsId);
    },
    [setLastNewsSeen]
  );

  return (
    <>
      {isWide ? (
        <>
          <Pane
            className={`${styles["home-drawer"]} ${styles["home-drawer-left"]}`}
          >
            <Heading size={500} className={styles["split-heading"]}>
              Prochaines formations
            </Heading>
            {isLoading ? (
              <Pane
                display="flex"
                alignItems="center"
                justifyContent="center"
                flex={1}
              >
                <Spinner />
              </Pane>
            ) : (
              <TrainingTab nextTrainings={nextTrainings} />
            )}
          </Pane>
          <Pane className={styles["home-drawer"]}>
            <Heading
              size={500}
              className={styles["split-heading"]}
              position="relative"
            >
              Actualités
              {showPulsar && (
                <Pane position="absolute" top={8} right={16}>
                  <Pulsar />
                </Pane>
              )}
            </Heading>
            {isLoading ? (
              <Pane
                display="flex"
                alignItems="center"
                justifyContent="center"
                flex={1}
              >
                <Spinner />
              </Pane>
            ) : (
              <NewsTab news={news} updateLastNewsSeen={updateLastNewsSeen} />
            )}
          </Pane>
        </>
      ) : (
        <Pane className={styles["home-drawer"]}>
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
        </Pane>
      )}
    </>
  );
}

export default HomeDrawer;
