import styled from 'styled-components';
import check from '../assets/check.png';
import cross from '../assets/cross.png';
import { useNavigate } from 'react-router-dom';

const StyledSocialMedia = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: black;
  .bar {
    width: 320px;
    height: 58px;
    display: flex;
    align-items: center;
    background-color: #232323;
    color: white;
    border-radius: 7px;
    justify-content: space-between;
    padding: 12px;
    font-size: 15px;
  }
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
  }
  .button:hover {
    background-color: #257bf5; /* Green */
    color: white;
    border-style: none;
  }
`;

const SocialMedia = () => {
  const navigate = useNavigate();
  return (
    <StyledSocialMedia className='justify-center items-center'>
      <p className=' text-center text-[32px] w-1/4 justify-items-center'>
        Connect To Your Social Media Channel
      </p>
      <div className='space-y-3 py-[20px]'>
        <p className='text-center text-[15px]'>
          Click To Connect Or Disconnect
        </p>
        <div className='bar'>
          <p>Instagram</p>
          <img src={cross}></img>
        </div>
        <div className='bar'>
          <p>Facebook</p>
          <img src={cross}></img>
        </div>
        <div className='bar'>
          <p>Youtube</p>
          <img src={cross}></img>
        </div>
        <div className='bar'>
          <p>Tiktok</p>
          <img src={cross}></img>
        </div>
        <div className='bar'>
          <p>Linkedin</p>
          <img src={cross}></img>
        </div>
      </div>
      <button className='button' onClick={() => navigate('/home')}>
        <p>Next</p>
      </button>
    </StyledSocialMedia>
  );
};

export default SocialMedia;
