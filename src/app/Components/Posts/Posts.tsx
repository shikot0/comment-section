'use client';
import Image from 'next/image';
import { DeleteButton, EditButton, ReplyButton, SendButton } from "../Buttons/Buttons";
import { BASE_URL } from '../../../../statics';
import { User } from '../User/User';
import moment from 'moment';
import { Score } from '../Score/Score';
import {useState, useEffect, FormEvent} from 'react';
import Loader from '../Loader/Loader';
import {v4} from 'uuid';
import './Posts.css';

type Comment = {
    _id: string,
    score: number,
    text: string,
    user: string,
    updatedAt: Date,
    replies: Comment[]
}
type CommentProps = {
    comment: Comment,
    getPosts: Function,
    setComments: Function
}
type EditedComment = {
  text: string
}


export function Comment({comment, getPosts, setComments}: CommentProps) {
    const {_id, score, text, user, updatedAt, replies: replyIds} = comment;
    const [replies, setReplies] = useState([]);
    const [replyWrapperVisible, setReplyWrapperVisible] = useState<boolean>(false);
    const [isUser, setIsUser] = useState<boolean | undefined>(undefined);
    const [editedComment, setEditedComment] = useState<EditedComment>({
      text: comment.text
    })
    const [editMode, setEditMode] = useState<boolean>(false);
    // console.log(comment)
    function calculateDifference(date: Date) {
        const then = moment(date);
        const now = moment(new Date());
        let difference = now.diff(then, 'days');
        let unit = 'days';
        if(difference === 0) {
          return `today`;
        }else if(difference > 7 && difference < 14) {
            difference = 1;
            unit = 'week';
        }else if(difference > 14) {
            difference = Math.round(difference / 7);
            unit = 'weeks';
        }else if(difference > 30 && difference < 60) {
            difference = 1;
            unit = 'month';
        }else if(difference > 60){
            difference = Math.round(difference / 30);
            unit = 'months';
        }else if(difference > 365 && difference < 730) {
            difference = 1;
            unit = 'year';
        }else if (difference > 365) {
            difference = Math.round(difference / 365);
            unit = 'years';
        }
        const result = `${difference} ${unit} ago`;
        return result
    }
    
    async function getReplies(setter: Function) {
      const res = await fetch(`${BASE_URL}/api/posts/${_id}/replies`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if(data.succeeded) {
        setter(data.replies);
      }
    }

    function deletePost(id: string) {
      fetch(`${BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
      .then(res => res.json())
      .then(data => {
        if(data.succeeded) {
          getPosts(setComments)
        }
      })
    }

    function editComment(e: FormEvent<HTMLDivElement>) {
      const target = e.target as HTMLInputElement;
      setEditedComment(prev => {
        return {...prev, text: target?.value}
      })
    }

    function updateComment(id: string) {
      if(editedComment.text === '') return;

      fetch(`${BASE_URL}/api/posts/${id}`, {
        method: 'PATCH',
        cache: 'no-store',
        body: JSON.stringify(editedComment)
      })
      .then(res => res.json())
      .then(data => {
        if(data.succeeded) {
          getPosts(setComments);
        }
      })
    }

    useEffect(() => {
      getReplies(setReplies);
    }, [])

    // useEffect(() => {
    //   console.log(replies);
    // }, [replies])
    return (
      <div className="comment-wrapper">
        <div className="comment">
          {/* <div className="score-wrapper">
            <button className="score-btn">
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
            </button>
            <small className="score">{score}</small>
            <button className="score-btn">
              <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
            </button>
          </div> */}
          <Score score={score} postId={_id} />
          <div className="comment-content">
            <div className="comment-header">
              <div className="comment-info">
                {/* <div className="profile-picture-wrapper">
                  <Image src={`${BASE_URL}/api/users/profile-picture/${userId}`} fill alt="profile-picture"/>
                </div>
                <div className="username">amyrobson</div> */}
                <User isUser={isUser} setIsUser={setIsUser} username={user} />
                {/* <div className="date">1 month ago</div> */}
                <div className="date">{calculateDifference(updatedAt)}</div>
              </div>
              <div className="buttons-section top">
                {isUser ? 
                  <>
                    <DeleteButton callback={deletePost} params={[_id]} /> 
                    <EditButton callback={() => {setEditMode(prev => !prev)}}/>
                  </>
                : null}
                {isUser === false ? <ReplyButton callback={() => setReplyWrapperVisible(prev => !prev)} /> : null}
              </div>
            </div>
            <div className="comment-text" onChange={e => editComment(e)} contentEditable={editMode}>{text}</div>
            <div className="bottom-button-section">
              <Score score={score} postId={_id} />
              <div className="buttons-section bottom">
                {isUser ? 
                  <>
                    <DeleteButton callback={deletePost} params={[_id]} /> 
                    <EditButton callback={() => {setEditMode(prev => !prev)}}/>
                  </>
                : null}
                {isUser === false ? <ReplyButton callback={() => setReplyWrapperVisible(prev => !prev)} /> : null}
                
                {editMode ?
                  <SendButton callback={updateComment} params={[_id]} text='Update' /> 
                : null}
              </div>
            </div>
          </div>
        </div>

        {replyWrapperVisible ?
          <NewReply postId={_id} getPosts={getPosts} setComments={setComments} />
        : null}

        {replyIds.length > 0 ?
          <div className="replies-wrapper">
            {replies.length > 0 ?
                <>
                  {replies.map(reply => {
                    return <Comment getPosts={getPosts} setComments={setComments} key={v4()} comment={reply} />
                  })}
                </>
            : <Loader />}
          </div>
        : null}
      </div>
    )
}

type NewComment = {
  user: string,
  text: string,
  type: string
}
type NewCommentProps = {
  getPosts: Function,
  setComments: Function
}

export function NewComment({getPosts, setComments}: NewCommentProps) {
  const [newComment, setNewComment] = useState<NewComment>({
    user: 'juliusomo',
    text: '',
    type: 'comment'
  })

  function addPost() {
    if(!newComment.text) return;

    setNewComment(prev => {
      return {...prev, text: ''}
    })

    fetch(`${BASE_URL}/api/posts`, {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify(newComment)
    })
    .then(res => res.json())
    .then(data => {
      if(data.succeeded) {
        getPosts(setComments)
      }
    })
  }

  function updateNewComment(e: FormEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    setNewComment(prev => {
      return {...prev, text: target?.value}
    })

    // setNewComment({...newComment, text: target?.value})
  }
  return (
    <div className="new-post-wrapper">
      <div className="profile-picture-wrapper">
        <Image src={`${BASE_URL}/api/users/profile-picture/juliusomo`} fill alt="juliusomo"/>
      </div>
      <textarea className="comment-input" name="new comment" value={newComment.text} onChange={(e) => updateNewComment(e)} placeholder="Add a comment..."></textarea>
      <SendButton callback={addPost} />
    </div>
  )
}

type NewReply = {
  user: string,
  text: string,
  type: string
}
type NewReplyProps = {
  postId: string,
  getPosts: Function,
  setComments: Function
}

export function NewReply({postId, getPosts, setComments}: NewReplyProps) {
  const [newReply, setNewReply] = useState<NewReply>({
    user: 'juliusomo',
    text: '',
    type: 'reply'
  })

  function addPost() {
    if(!newReply.text) return;

    setNewReply(prev => {
      return {...prev, text: ''}
    })

    fetch(`${BASE_URL}/api/posts/${postId}/replies`, {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify(newReply)
    })
    .then(res => res.json())
    .then(data => {
      if(data.succeeded) {
        getPosts(setComments)
      }
    })
  }

  function updateNewReply(e: FormEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    setNewReply(prev => {
      return {...prev, text: target?.value}
    })

    // setNewComment({...newComment, text: target?.value})
  }
  return (
    <div className="new-post-wrapper">
      <div className="profile-picture-wrapper">
        <Image src={`${BASE_URL}/api/users/profile-picture/juliusomo`} fill alt="juliusomo"/>
      </div>
      <textarea className="comment-input" name="new reply" value={newReply.text} onChange={(e) => updateNewReply(e)} placeholder="Reply..."></textarea>
      <SendButton callback={addPost} text={'Reply'}/>
    </div>
  )
}