import { BASE_URL } from '../../../../statics';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import './User.css';

type UserProps = {
    username: string;
    isUser: boolean | undefined, 
    setIsUser: Function
}
type User = {
    username: string
}

async function getUser(username: string, setter: Function, setIsUser: Function) {
    const res = await fetch(`${BASE_URL}/api/users/${username}`, {
        cache: 'no-store'
    });
    const data = await res.json();
    if(data.succeeded) {
        setter(data.user);
        setIsUser(data.user.username === 'juliusomo');
    }
}
export function User({username, isUser, setIsUser}: UserProps) {
    const [user, setUser] = useState<User>();
    // const [isUser, setIsUser] = useState<boolean>(false);

    useEffect(() => {
        getUser(username, setUser, setIsUser);
    }, [])
    return (
        <>
            {user ?
            <>
                <div className="profile-picture-wrapper">
                    {/* <Image src={`${BASE_URL}/api/users/profile-picture/${id}`} fill alt="profile-picture"/> */}
                    <Image src={`${BASE_URL}/api/users/profile-picture/${user.username}`} fill alt="profile-picture"/>
                </div>
                <div className="username">{user.username}</div>
                {isUser ? 
                    <small className="you-badge">you</small>
                : null}
            </>
            : 
            <>
                <div className="profile-picture-skeleton"></div>
                <div className="username-skeleton"></div> 
            </>
            }
        </>
    )
}