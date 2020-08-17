import React, {useEffect} from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const LandingPage = (props) => {
    useEffect(() => {
        axios.get('/api/hello')
            .then((response) =>{
                console.log(response.data);
            })
    })

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                console.log('%c [ logout ] < result >', 'color:red', response);
                if(response.data.success) props.history.push('/login')
                else alert('로그 아웃에 실패 했습니다.')
            })
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
        }}>
            <h1>시작페이지</h1>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage);
