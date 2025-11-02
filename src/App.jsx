import data from './data/data.json'
import Comments from './components/comments/comments.jsx'
import './App.css'
import CommentsReducer from './reducer.jsx'
import { useState, useReducer, useEffect } from 'react'


function App() {
  const initialComments = () => {
    const saved = localStorage.getItem('comments');

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.warn('Corrupted localStorage data. Resetting.');
      }
    }

    return data.comments.map(comment => ({
      ...comment,
      votedBy: comment.votedBy || [],
      replies: comment.replies
        ? comment.replies.map(r => ({...r, votedBy: r.votedBy || [] }))
        : [],
    }));
  };

  const [comments, dispatch] = useReducer(CommentsReducer, [], initialComments);
  const [currentUser, setCurrentUser] = useState(data.currentUser);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  function handleAddComment(content) {
    const newComment = {
      id: Date.now(),
      content,
      createdAt: "just now",
      score: 0,
      user: currentUser,
      votedBy : [],
      replies: [],
    };

    dispatch({
      type: 'ADD_COMMENT',
      payload: newComment
    });
  }

  function handleAddReply(id, content, replyingTo) {
    const newReply = {
      id: Date.now(),
      content,
      createdAt: "just now",
      score: 0,
      replyingTo,
      user: currentUser,
      votedBy: [],
      replies: [],
    };

    dispatch({
      type: 'ADD_REPLY',
      payload: {id, newReply}
    });
  }

  function handleDeleteComment(id) {
    dispatch({
      type: 'DELETE_COMMENT',
      payload: id
    })
  }

  function handleDeleteReply(id) {
    dispatch({
      type: 'DELETE_REPLY',
      payload: id
    })
  }

  function handleUpdateComment(id, content) {
    dispatch({
      type: 'UPDATE_COMMENT',
      payload: {id, content}
    })
  }

  function handleUpdateReply(id, content) {
    dispatch({
      type: 'UPDATE_REPLY',
      payload: {id, content}
    })
  }

  function handleVote(id, type) {
    dispatch({
      type: 'VOTE',
      payload: {id, type, currentUser}
    })
  }

  return(
    <main id='main'>
      <Comments comments={comments} currentUser={currentUser} handleAddComment={handleAddComment}
      handleVote={handleVote} handleAddReply={handleAddReply}
      handleDeleteComment={handleDeleteComment} handleDeleteReply={handleDeleteReply}
      handleUpdateComment={handleUpdateComment} handleUpdateReply={handleUpdateReply} />
    </main>
  )
}

export default App