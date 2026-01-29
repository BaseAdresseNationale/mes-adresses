import { getFullDate } from "@/lib/utils/date";
import { Heading, Pane, Text } from "evergreen-ui";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import { NewsType } from "@/lib/mattermost/type";
import { useContext, useEffect } from "react";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface NewsTabProps {
  news: NewsType[];
  updateLastNewsSeen: (id: string) => void;
}

function NewsTab({ news, updateLastNewsSeen }: NewsTabProps) {
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  useEffect(() => {
    updateLastNewsSeen(news[0]?.id);
    matomoTrackEvent(
      MatomoEventCategory.HOME_PAGE,
      MatomoEventAction[MatomoEventCategory.HOME_PAGE].SHOW_NEWS
    );
  }, [updateLastNewsSeen, news, matomoTrackEvent]);

  return (
    <Pane
      is="ul"
      display="flex"
      flexDirection="column"
      padding={0}
      margin={0}
      listStyle="none"
    >
      {news.length === 0 && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
          padding={10}
        >
          <Text>Pas de d&apos;actualité</Text>
        </Pane>
      )}
      {news.length > 0 &&
        news.map(({ id, date, message }, index) => (
          <Pane
            key={id}
            is="li"
            display="flex"
            flexDirection="column"
            padding={10}
            gap={8}
            justifyContent="space-between"
            borderBottom={index === news.length - 1 ? "none" : "1px solid #ccc"}
          >
            <Heading display="flex" alignItems="center" size={400}>
              {getFullDate(new Date(date))}
            </Heading>
            <Text>
              <Markdown remarkPlugins={[remarkGfm, remarkGemoji]}>
                {message}
              </Markdown>
            </Text>
          </Pane>
        ))}
    </Pane>
  );
}

export default NewsTab;
