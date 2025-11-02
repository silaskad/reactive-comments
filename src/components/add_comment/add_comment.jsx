import styles from '../add_comment/add_comment.module.css'
import { useState } from 'react'

function AddCommentBox({comment, currentUser, handleAddComment, handleAddReply, buttonText, setShowReplyBox, replyInputRef}) {
    const [newCommentText, setNewCommentText] = useState('');
    

    function handleAddCommentClick() {
        if (newCommentText.trim() != '') {
            handleAddComment(newCommentText);
            setNewCommentText('');
        }
    }

    function handleAddReplyClick() {
        if (newCommentText.trim() != '') {
            handleAddReply(newCommentText);
            setNewCommentText('');
            setShowReplyBox(false);
        }
    }

    return(
        <section className={styles.input}>
            <div className={styles.section_container}>
                <textarea name="comment" id="comment" placeholder='Add a comment...'
                    onChange={e => setNewCommentText(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            buttonText === 'send' ? handleAddCommentClick() : handleAddReplyClick();
                        }
                    }}
                    value={newCommentText}
                    ref={replyInputRef}></textarea>
                <div className={styles.img_container}>  
                    <img src={currentUser.image.png} alt="user profile picture" />
                </div>
                <div className={styles.button_container}>
                    <button onClick={buttonText === 'send' ? handleAddCommentClick : handleAddReplyClick}>{buttonText}</button>
                </div>
            </div>
        </section>
    )
}

export default AddCommentBox