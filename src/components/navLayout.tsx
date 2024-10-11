import { Route, Routes } from 'react-router-dom';
import Navbar from './nav';
import { Home } from '../pages';

function NavRoute() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default NavRoute;
