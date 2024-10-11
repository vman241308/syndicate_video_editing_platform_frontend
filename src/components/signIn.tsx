import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import logoPng from '../assets/logo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const StyledSignIn = styled.div`
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
  .button:hover {
    background-color: #257bf5; /* blue */
    color: white;
    border-style: none;
  }
  button:disabled,
  button[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
  }
  input {
    color: white;
    background-color: #232323;
  }
  p.alert {
    color: red;
    font-size: 14px;
  }
`;

const SignIn = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [alert, setAlert] = useState<string>('');

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const checkEmail = (email: string) => {
    if (validator.isEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
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
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  useEffect(() => {
    checkEmail(email);
  }, [email]);

  useEffect(() => {
    checkPassword(password);
  }, [password]);

  useEffect(() => {
    console.log(
      'statuses----------->',
      isEmailValid,
      isPasswordValid,
      isEmailEmpty,
      isPasswordEmpty
    );
    setIsEmailValid(true);
    setIsPasswordValid(true);
  }, []);

  return (
    <StyledSignIn className='justify-center items-center'>
      <img src={logoPng}></img>
      <div className='py-[20px] space-y-4'>
        <input
          className='bar'
          type='text'
          placeholder='Email'
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleEmailChange(event)
          }
        />
        {isEmailEmpty ? <p className='alert'>Please input Email!</p> : ''}
        {isEmailValid ? '' : <p className='alert'>Your email is invalid!</p>}
        <input
          className='bar'
          type='password'
          placeholder='Password'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handlePasswordChange(event)
          }
          value={password}
        />
        {isPasswordEmpty ? <p className='alert'>Please input Password!</p> : ''}
        {isPasswordValid ? (
          ''
        ) : (
          <p className='alert'>
            Must Contain 2 numbers, a symbol and a uppercase!
          </p>
        )}
        <button
          type='button'
          className='button cursor-pointer'
          onClick={() => {
            navigate('/home');
            if (email && password) {
              axios
                .post(`${import.meta.env.VITE_AUTH_ENDPOINT}/login`, {
                  email,
                  password,
                })
                .then((res: any) => {
                  console.log('token------>', res.data.token);
                })
                .catch((err) => {
                  console.log(err);
                  setAlert('Email or Password is incorrect!');
                });
            }

            if (email.length == 0) {
              {
                setIsEmailValid(true);
                setIsEmailEmpty(true);
              }
            }
            if (password.length == 0) {
              setIsPasswordValid(true);
              setIsPasswordEmpty(true);
            }
            console.log(
              'statuses----------->',
              isEmailValid,
              isPasswordValid,
              isEmailEmpty,
              isPasswordEmpty
            );
          }}
          disabled={
            !(
              isEmailValid &&
              isPasswordValid &&
              !isEmailEmpty &&
              !isPasswordEmpty
            )
          }
        >
          Continue
        </button>
      </div>
      <p className='text-[15px]'>
        Don't You Have An Account? <Link to='/signUp'> Sign Up </Link> Here
      </p>
    </StyledSignIn>
  );
};

export default SignIn;
