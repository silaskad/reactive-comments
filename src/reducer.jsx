function CommentsReducer(comments, action) {
    switch (action.type) {
      case 'ADD_COMMENT': {
        return [...comments, action.payload];
      }

      case 'ADD_REPLY': {
        const {id, newReply} = action.payload;

        return comments.map(comment => {
          if (comment.id === id) {
            return {...comment, replies: [...comment.replies, newReply],};
          }
          return comment;
        })
      }

      case 'DELETE_COMMENT': {
        const id = action.payload;

        return comments.filter(c => c.id !== id );
      }

      case 'DELETE_REPLY': {
        const id = action.payload;

        return comments.map(comment => {
          return {...comment, replies: comment.replies.filter(r => r.id !== id)};
        })
      }

      case 'UPDATE_COMMENT': {
        const {id, content} = action.payload;

        return comments.map(comment => {
          if (comment.id === id) {
            return {...comment, content: content};
          }
          return comment;
        })
      }

      case 'UPDATE_REPLY': {
        const {id, content} = action.payload;

        return comments.map(comment => {
          return {...comment, replies: comment.replies.map(reply => {
            if (reply.id === id) {
              return {...reply, content: content};
            }
            return reply;
          })};
        })
      }

      case 'VOTE': {
        const {id, type, currentUser} = action.payload;

        return comments.map(comment => {
          const existingCommentVote = comment.votedBy.find(vote =>
            vote.username === currentUser.username
          );

        if (comment.replies && comment.replies.length > 0) {
          const updatedReplies = comment.replies.map(reply => {
            const existingReplyVote = reply.votedBy.find(vote => vote.username === currentUser.username);

            if (reply.id === id) {
              if (!existingReplyVote) {
                return {...reply, votedBy: [...reply.votedBy, {username: currentUser.username, type}], score: Math.max(0, type === '+' ? reply.score + 1 : reply.score - 1)};
              }

              else if (existingReplyVote.type === type) {
                return {...reply, votedBy: reply.votedBy.filter(v => v.username !== currentUser.username), score: Math.max(0, type === '+' ? reply.score - 1 : reply.score + 1)};
              }

              else {
                const isSwitchingFromDownToUp = existingReplyVote.type === '-' && type === '+';
                const newScore = isSwitchingFromDownToUp && reply.score === 0
                  ? reply.score + 1
                  : (type === '+' ? reply.score + 2 : reply.score - 2);

                  return {...reply, votedBy: reply.votedBy.map(v => v.username === currentUser.username ? {...v, type} : v), score: Math.max(0, newScore)};
              }
            }

            return reply;
          });

          return {...comment, replies: updatedReplies};
        }

        if (comment.id === id) {
          if (!existingCommentVote) {
            return {...comment, votedBy: [...comment.votedBy, {username: currentUser.username, type}], score: Math.max(0, type === '+' ? comment.score + 1 : comment.score - 1)};
          }

          else if (existingCommentVote.type === type) {
            return {...comment, votedBy: comment.votedBy.filter(v => v.username !== currentUser.username), score: Math.max(0, type === '+' ? comment.score - 1 : comment.score + 1)};
          }

          else {
            const isSwitchingFromDownToUp = existingCommentVote.type === '-' && type === '+';
            const newScore = isSwitchingFromDownToUp && comment.score === 0
              ? comment.score + 1
              : (type === '+' ? comment.score + 2 : comment.score - 2);

              return {...comment, votedBy: comment.votedBy.map(v => v.username === currentUser.username ? {...v, type} : v), score: Math.max(0, newScore)};
          }
        }

        return comment;
      });
      }

      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }

  export default CommentsReducer