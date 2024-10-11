import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NavLayout from './components/navLayout';
import SignUp from './pages/singUp';
import SignIn from './components/signIn';
import VerifyEmail from './components/verifyEmail';
import SocialMedia from './components/socialMediaChannel';
import Setting from './pages/setting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<NavLayout />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/' element={<SignIn />} />
        <Route path='/verifyEmail' element={<VerifyEmail />} />
        <Route path='/socialMediaConnect' element={<SocialMedia />} />
        <Route path='/setting' element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
