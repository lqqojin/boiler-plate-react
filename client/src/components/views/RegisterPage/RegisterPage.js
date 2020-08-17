import React, { useState } from 'react';
import { registerUser } from "../../../_actions/user_action";
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

const RegisterPage = (props) => {

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onEmailHandler = (event) => setEmail(event.currentTarget.value)
    const onNameHandler = (event) => setName(event.currentTarget.value)
    const setPasswordHandler = (event) => setPassword(event.currentTarget.value)
    const setConfirmPasswordHandler = (event) => setConfirmPassword(event.currentTarget.value)

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 설정을 하지 않으면 화면이 refresh 됨
        console.log('%cEmail','color:orange', email);
        console.log('%cPassword','color:orange', password);
        if (password !== confirmPassword) return alert('비밀번호가 다릅니다.');
        const body = {
            email,
            name,
            password,
        }

        dispatch(registerUser(body))
            .then(response => {
                console.log('%c [ loginUser ] < result >', 'color:red', response);
                if (response.payload.success) {
                    props.history.push('/login');
                } else {
                    alert('Failed to sign up!');
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
                <label>Name</label>
                <input type="text" value={name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="text" value={password} onChange={setPasswordHandler} />
                <label>Confirm Password</label>
                <input type="text" value={confirmPassword} onChange={setConfirmPasswordHandler} />
                <br />
                <button type="submit">
                    회원 가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage);
