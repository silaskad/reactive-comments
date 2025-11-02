import styles from '../comment_card/comment_card.module.css'
import iconDelete from '../../assets/icon-delete.svg'
import iconEdit from '../../assets/icon-edit.svg'
import iconMinus from '../../assets/icon-minus.svg'
import iconPlus from '../../assets/icon-plus.svg'
import iconReply from '../../assets/icon-reply.svg'
import AddCommentBox from '../add_comment/add_comment.jsx'
import Modal from '../modal/modal.jsx'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

function CommentCard({comment, handleVote, currentUser, handleAddReply,
    handleDeleteComment, handleDeleteReply, type, handleUpdateComment, handleUpdateReply}) {

    const userVote = comment.votedBy.find(v => v.username === currentUser.username);
    const hasUpVoted = userVote?.type === '+';
    const hasDownVoted = userVote?.type === '-';
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const replyInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.content);

    useEffect(() => {
        const body = document.body;

        if (showReplyBox || isEditing && replyInputRef.current) {
            const input = replyInputRef.current;
            input.focus();

            const value = input.value;
            input.setSelectionRange(value.length, value.length);
        }

        if (showModal) {
            body.classList.add('scroll_lock');
        } else {
            body.classList.remove('scroll_lock');
        }

        return () => body.classList.remove('scroll_lock');
    }, [showReplyBox, showModal, isEditing]);

    return(
        <>
        <section className={styles.comment}>
            <div className={styles.section_container}>
                <div className={styles.content}>
                    <div className={styles.content_topper}>
                        <div className={styles.profile_container}>
                            <img src={comment.user.image.png} alt="profile picture" className={styles.profile}/>
                        </div>
                        <div className={styles.user_wrapper}>
                            <span className={styles.username}>{comment.user.username}</span>
                            {comment.user.username === currentUser.username &&
                                <div className={styles.you_container}>
                                    <span>you</span>
                                </div>
                            }
                        </div>
                        <span className={styles.date_posted}>{comment.createdAt}</span>
                    </div>
                    {isEditing 
                    ? <><textarea name="editedText" id="editedText" value={editedText} onChange={e => setEditedText(e.target.value)} ref={replyInputRef}></textarea>
                        <button className={styles.update_button}
                            onClick={() => {type === 'comment' ? handleUpdateComment(editedText) : handleUpdateReply(editedText); setIsEditing(false)}}>
                        update</button></>
                    : <p className={styles.content_text}>{comment.replyingTo && (<span className={styles.content_text_reply_to}>
                        @{comment.replyingTo}</span>)}{comment.content}</p>}
                </div>
                <div className={`${styles.vote_group} ${isEditing && styles.is_editing_disables}`}>
                    <button disabled={isEditing && true} className={`${styles.plus_button} ${hasUpVoted ? styles.has_up_voted : ''}`} onClick={() => handleVote(comment.id, '+')}>
                        <img src={iconPlus} alt="plus button" />
                    </button>
                    <span className={styles.vote_text}>{comment.score}</span>
                    <button disabled={isEditing && true} className={`${styles.minus_button} ${hasDownVoted ? styles.has_down_voted : ''}`} onClick={() => handleVote(comment.id, '-')}>
                        <img src={iconMinus} alt="minus button" />
                    </button>
                </div>
                <div className={styles.user_action_group}>
                    {comment.user.username !== currentUser.username
                    ?   <button className={styles.reply_button}
                            onClick={() => setShowReplyBox(!showReplyBox)}>
                            <img src={iconReply} alt="reply icon" />
                            Reply
                        </button>
                    :   <div className={`${styles.user_edits_group} ${isEditing && styles.is_editing_disables}`}>
                            <button disabled={isEditing && true} className={styles.delete_button}
                                onClick={() => setShowModal(true)}>
                                <img src={iconDelete} alt="delete icon" />
                                Delete
                            </button>
                            <button disabled={isEditing && true} className={styles.edit_button}
                                onClick={() => setIsEditing(true)}>
                                <img src={iconEdit} alt="edit icon" />
                                Edit
                            </button>
                        </div>
                    }
                </div>
            </div>
        </section>
        {showReplyBox &&
            <AddCommentBox currentUser={currentUser} buttonText='reply' comment={comment} handleAddReply={handleAddReply}
            setShowReplyBox={setShowReplyBox}
            replyInputRef={replyInputRef} />
        }
        
        {showModal && (
            <>
                {createPortal(
                    <div className='modal_backdrop'></div>,
                    document.body
                )}
                <Modal setShowModal={setShowModal} handleDeleteComment={handleDeleteComment} handleDeleteReply={handleDeleteReply} type={type} />
            </>
        )}
        </>
    )
}

export default CommentCard