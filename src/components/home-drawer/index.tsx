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
    <Pane
      className={`${styles["home-drawer"]} ${
        isWide ? styles["home-drawer-wide"] : ""
      }`}
    >
      {isWide ? (
        isLoading ? (
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Spinner />
          </Pane>
        ) : (
          <Pane className={styles["split-container"]}>
            <Pane className={styles["split-pane"]}>
              <Heading size={500} className={styles["split-heading"]}>
                Prochaines formations
              </Heading>
              <TrainingTab nextTrainings={nextTrainings} />
            </Pane>
            <Pane className={styles["split-pane"]}>
              <Heading size={500} className={styles["split-heading"]}>
                Actualités
                {showPulsar && (
                  <Pane position="absolute" top={8} right={16}>
                    <Pulsar />
                  </Pane>
                )}
              </Heading>
              <NewsTab news={news} updateLastNewsSeen={updateLastNewsSeen} />
            </Pane>
          </Pane>
        )
      ) : (
        <>
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
        </>
      )}
    </Pane>
  );
}

export default HomeDrawer;
