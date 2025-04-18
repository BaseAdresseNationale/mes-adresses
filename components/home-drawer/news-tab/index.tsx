import { getFullDate } from "@/lib/utils/date";
import { Heading, Pane, Text } from "evergreen-ui";
import styled from "styled-components";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import { NewsType } from "@/lib/mattermost/type";
import { useEffect } from "react";

const StyledWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;

    &:last-child {
      border-bottom: none;
    }
  }
`;

interface NewsTabProps {
  news: NewsType[];
  updateLastNewsSeen: (id: string) => void;
}

function NewsTab({ news, updateLastNewsSeen }: NewsTabProps) {
  useEffect(() => {
    updateLastNewsSeen(news[0]?.id);
  }, [updateLastNewsSeen, news]);

  return (
    <StyledWrapper>
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
        news.map(({ id, date, message }) => (
          <Pane
            key={id}
            is="li"
            display="flex"
            flexDirection="column"
            padding={10}
            gap={8}
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
    </StyledWrapper>
  );
}

export default NewsTab;
