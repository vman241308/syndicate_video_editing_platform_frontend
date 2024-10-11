import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import logoPng from '../assets/logo.png';
import { useEffect, useState } from 'react';
import Icon from '../icons';
import axios from 'axios';
import validator from 'validator';

const StyledSignUp = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: black;
  .bar {
    width: 320px;
    height: 58px;
    display: flex;
    align-items: center;
    background-color: rgb(35, 35, 35);
    color: white;
    border-radius: 7px;
    justify-content: left;
    padding: 12px;
    font-size: 14px;
  }
  button {
    min-width: 320px;
    min-height: 58px;
    display: flex;
    align-items: center;
    background-color: rgb(35, 35, 35);
    color: white;
    border-radius: 7px;
    justify-content: center;
    padding: 12px;
    font-size: 14px;
    transition-duration: 0.4s;
  }
  input {
    width: 100%;
    height: 100%;
    background-color: #232323;
    color: white;
  }
  .button:hover {
    background-color: #257bf5; /* Green */
    color: white;
    border-style: none;
  }
  button:disabled,
  button[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
  }
  p.alert {
    font-size: 14px;
    color: red;
  }
  p.success {
    font-size: 14px;
    color: #257bf5;
  }
`;

interface RegisterInput {
  email: string;
  password: string;
}

const SignUp = () => {
  async function register(data: RegisterInput) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_AUTH_ENDPOINT}/register`,
        data
      );
      console.log('--------->', res.data.token);
    } catch (error) {
      console.log(error);
    }
  }
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  // const [isContinueClicked, setIsContinueClicked] = useState<boolean>(false);

  // validation part for input values: email, password, confirm password
  const [compare, setCompare] = useState<boolean>(false);
  const [isEmailEmpty, setEmailEmpty] = useState<boolean>(false);
  const [isPasswordEmpty, setPasswordEmpty] = useState<boolean>(false);
  const [isEmailValid, setEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setPasswordValid] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(event.target.value);
  };

  const handleCompare = (password: string, confirm: string) => {
    const status = password == confirm;
    setCompare(status);
  };

  const checkEmail = (email: string) => {
    if (validator.isEmail(email)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const checkPassword = (password: string) => {
    if (
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 2,
        minSymbols: 1,
      })
    ) {
      setPasswordValid(false);
      setPasswordEmpty(false);
    } else if (password.length == 0) setPasswordEmpty(true);
    setPasswordValid(true);
  };

  useEffect(() => {
    checkPassword(password);
    handleCompare(password, confirm);
    console.log(
      'every status--->',
      isEmailValid,
      compare,
      isPasswordValid,
      email,
      password
    );
  }, [password, confirm]);

  useEffect(() => {
    checkEmail(email);
  }, [email]);

  useEffect(() => {
    checkPassword(password);
  }, [password]);

  useEffect(() => {
    setEmailEmpty(false);
    setPasswordEmpty(false); // show '' or Your password is invalid
    setEmailValid(true); // show '' or Your email is invalid
    setPasswordValid(true);
    setCompare(true); // show '' or Retype your password again
  }, []);
  return (
    <StyledSignUp className='justify-center items-center'>
      <img src={logoPng}></img>
      <div className=' space-y-3 py-[15px]'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          className='bar'
          onChange={handleEmailChange}
        />
        {isEmailEmpty ? <p className='alert'>Please input Email!</p> : ''}
        {!isEmailValid ? <p className='alert'>Your email is invalid!</p> : ''}
        <input
          type='password'
          placeholder='Password'
          className='bar'
          value={password}
          onChange={handlePasswordChange}
        />
        {isPasswordEmpty ? <p className='alert'>Please input Password!</p> : ''}
        {!isPasswordValid ? (
          <p className='alert'>Your Password is invalid!</p>
        ) : (
          ''
        )}
        <input
          type='password'
          placeholder='Confirm Password'
          className='bar'
          value={confirm}
          onChange={handleConfirmChange}
        />
        {compare ? '' : <p className='alert'>Retype your password again!</p>}
        <button
          className='button cursor-pointer'
          onClick={() => {
            register({ email, password });
            navigate('/verifyEmail');
            console.log(
              'every status--->',
              isEmailValid,
              compare,
              isPasswordValid
            );
            if (email.length == 0) {
              {
                setEmailValid(true);
                setEmailEmpty(true);
              }
            }
            if (password.length == 0) {
              setPasswordValid(true);
              setPasswordEmpty(true);
            }
          }}
          disabled={
            !(
              isEmailValid &&
              compare &&
              isPasswordValid &&
              !isEmailEmpty &&
              !isPasswordEmpty
            )
          }
        >
          Continue
        </button>
      </div>

      <p className='text-[15px] text-white'>
        Already Have An Account? <Link to='/'> Sign In </Link> Here
      </p>
    </StyledSignUp>
  );
};

export default SignUp;
