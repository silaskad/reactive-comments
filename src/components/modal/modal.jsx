import styles from '../modal/modal.module.css'

function Modal({setShowModal, type, handleDeleteComment, handleDeleteReply}) {
    return(
        <div className={styles.modal_container}>
            <div className={styles.modal_content}>
                <h2 className={styles.content_title}>Delete comment</h2>
                <p className={styles.content_text}>
                    Are you sure you want to delete this comment?
                    This will remove the comment and can't be undone.
                </p>
                <div className={styles.button_group}>
                    <button className={styles.cancel_button}
                        onClick={() => setShowModal(false)}>
                        no, cancel
                    </button>
                    <button className={styles.delete_button}
                        onClick={() => {
                            if (type === 'comment') {
                                handleDeleteComment();
                            } else if (type === 'reply') {
                                handleDeleteReply();
                            } else {
                                // do nothing
                            }
                        }}>
                        yes, delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal