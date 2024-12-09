import { Pane, Text } from "evergreen-ui";
import { uniqueId } from "lodash";

const COMMENTS_LIMIT = 10;

interface CommentsContentProps {
  mainComment?: string;
  commentedNumeros: string[];
}

function CommentsContent({
  mainComment,
  commentedNumeros,
}: CommentsContentProps) {
  const filteredComments = commentedNumeros.slice(0, COMMENTS_LIMIT);
  const nbComments = commentedNumeros.length;
  const remainComments = nbComments - COMMENTS_LIMIT;

  return (
    <>
      <Pane marginBottom={8}>
        {mainComment ? (
          <Pane
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            color="white"
          >
            <Text color="white">{mainComment}</Text>
          </Pane>
        ) : (
          <Text color="white">
            Commentaire{`${commentedNumeros.length > 0 ? "s" : ""}`}
          </Text>
        )}
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
