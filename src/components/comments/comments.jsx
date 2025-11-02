import styles from '../comments/comments.module.css'
import CommentCard from '../comment_card/comment_card'
import AddCommentBox from '../add_comment/add_comment'

function Comments({comments, currentUser, handleAddComment, handleAddReply, handleVote,
    handleDeleteComment, handleDeleteReply, handleUpdateComment, handleUpdateReply
}) {
    return(
        <>
        {comments.map(comment => (
            <div key={comment.id} className={styles.comments_wrapper}>
                <CommentCard comment={comment} handleVote={handleVote} currentUser={currentUser} handleAddReply={(replyText) => handleAddReply(comment.id, replyText, comment.user.username)}
                handleDeleteComment={() => handleDeleteComment(comment.id)} 
                handleUpdateComment={(content) => handleUpdateComment(comment.id, content)} type='comment' />
                {/* replies, only if they exist */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.replies_container}>
                        {comment.replies.map(reply => (
                            <div key={reply.id}>
                                <CommentCard  comment={reply} handleVote={handleVote} currentUser={currentUser} handleAddReply={(replyText) => handleAddReply(comment.id, replyText, reply.user.username)}
                                handleDeleteReply={() => handleDeleteReply(reply.id)}
                                handleUpdateReply={(content) => handleUpdateReply(reply.id, content)} type='reply' />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
        <div className={styles.input_wrapper}>
            <AddCommentBox currentUser={currentUser} handleAddComment={handleAddComment} buttonText='send'/>
        </div>
        </>
    )
}

export default Comments