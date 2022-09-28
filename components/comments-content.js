import PropTypes from 'prop-types'
import {Pane, Text} from 'evergreen-ui'

const COMMENTS_LIMIT = 10

function CommentsList({comments}) {
  return comments.map(({_id, numero, suffixe, comment}) => (
    <Pane color='white' key={_id} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
      <Text color='white'>
        • {numero}{suffixe} : {comment}
      </Text>
    </Pane>
  ))
}

function CommentsContent({comments}) {
  const filteredComments = comments.slice(0, COMMENTS_LIMIT)
  const nbComments = comments.length
  const remainComments = nbComments - COMMENTS_LIMIT

  return (
    <>
      <Pane marginBottom={8}>
        <Text color='white'>
          Commentaire{`${comments.length > 0 ? 's' : ''}`} :
        </Text>
      </Pane>
      <CommentsList comments={filteredComments} />
      {nbComments > COMMENTS_LIMIT && (
        <Pane marginTop={8}>
          <Text color='white'>
            {`${remainComments} autre${remainComments > 1 ? 's' : ''} commentaire${remainComments > 1 ? 's' : ''}`}
          </Text>
        </Pane>
      )}
    </>
  )
}

CommentsList.propTypes = {
  comments: PropTypes.array.isRequired
}

CommentsContent.propTypes = {
  comments: PropTypes.array.isRequired
}

export default CommentsContent
