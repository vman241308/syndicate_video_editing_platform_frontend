import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyleVerify = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  button {
    width: 320px;
    height: 58px;
    display: flex;
    align-items: center;
    background-color: #232323;
    color: white;
    border-radius: 7px;
    justify-content: center;
    padding: 12px;
    font-size: 15px;
    transition-duration: 0.4s;
  }
  .button:hover {
    background-color: #257bf5; /* Green */
    color: white;
    border-style: none;
  }
`;

const VerifyEmail = () => {
  const navigate = useNavigate();
  return (
    <StyleVerify>
      <div className='flex pb-[20px] justify-center flex-col items-center'>
        <p className='text-[32px] flex'>Verify Email</p>
        <p className='text-[15px] flex'>
          Check Your Email To Verify Your Account
        </p>
      </div>
      <button
        className='button cursor-pointer'
        onClick={() => navigate('/socialMediaConnect')}
      >
        Verify
      </button>
    </StyleVerify>
  );
};

export default VerifyEmail;
