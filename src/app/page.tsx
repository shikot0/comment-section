'use client';
import { ReplyButton, SendButton } from './Components/Buttons/Buttons';
import Image from 'next/image'
import Loader from './Components/Loader/Loader';
import { BASE_URL } from '../../statics';
import {Comment, NewComment} from './Components/Posts/Posts';
import { useState, useEffect, FormEvent } from 'react';
import {v4} from 'uuid';
import './globals.css';



export default function Home() {
  const [comments, setComments] = useState([]);


  async function getPosts(setter: Function) {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      cache: 'no-store'
    });
    const data = await res.json();
    setter(data.comments);
    // console.log(data)
  }

  useEffect(() => {
    getPosts(setComments);
  }, []);



  
  return (
    <main>
      {/* <section id="comments-section">
        {comments.length > 0 ?
          comments.map(comment => {
            return <Comment key={v4()} comment={comment} />
          })
        : <Loader />}
        <div className="new-post-wrapper">
          <div className="profile-picture-wrapper">
            <Image src={`${BASE_URL}/api/users/profile-picture/juliusomo`} fill alt="juliusomo"/>
          </div>
        </div>
      </section> */}
        {comments.length > 0 ?
          <section id="comments-section">
            {comments.map(comment => {
              return <Comment key={v4()} comment={comment} getPosts={getPosts} setComments={setComments}/>
            })}
            {/* <div className="new-post-wrapper">
              <div className="profile-picture-wrapper">
                <Image src={`${BASE_URL}/api/users/profile-picture/juliusomo`} fill alt="juliusomo"/>
              </div>
              <textarea className="comment-input" value={newComment.text} onChange={(e) => updateNewComment(e)} placeholder="Add a comment..."></textarea>
              <SendButton callback={addPost} />
            </div> */}
            <NewComment getPosts={getPosts} setComments={setComments} />
          </section>
        : <Loader />}
    </main>
  )
}
