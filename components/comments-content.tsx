import { Pane, Text } from "evergreen-ui";
import { uniqueId } from "lodash";

const COMMENTS_LIMIT = 10;

interface CommentsContentProps {
  comments: string[];
}

function CommentsContent({ comments }: CommentsContentProps) {
  const filteredComments = comments.slice(0, COMMENTS_LIMIT);
  const nbComments = comments.length;
  const remainComments = nbComments - COMMENTS_LIMIT;

  return (
    <>
      <Pane marginBottom={8}>
        <Text color="white">
          Commentaire{`${comments.length > 0 ? "s" : ""}`} :
        </Text>
      </Pane>
      {filteredComments.map((comment) => (
        <Pane
          color="white"
          key={uniqueId()}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          <Text color="white">{comment}</Text>
        </Pane>
      ))}
      {nbComments > COMMENTS_LIMIT && (
        <Pane marginTop={8}>
          <Text color="white">
            {`${remainComments} autre${
              remainComments > 1 ? "s" : ""
            } commentaire${remainComments > 1 ? "s" : ""}`}
          </Text>
        </Pane>
      )}
    </>
  );
}

export default CommentsContent;
