import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action'

const LoginPage = (props) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const setPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); // 설정을 하지 않으면 화면이 refresh 됨
        console.log('%cEmail','color:orange', email);
        console.log('%cPassword','color:orange', password);
        const body = {
            email,
            password
        }

        dispatch(loginUser(body))
            .then(response => {
                console.log('%c [ loginUser ] < result >', 'color:red', response);
                if (response.payload.loginSuccess) {
                    props.history.push('/');
                } else {
                    alert('Error');
                }
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
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="text" value={email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="text" value={password} onChange={setPasswordHandler} />
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage;
