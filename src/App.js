import MainRouter from './routing/MainRouter';
import Sidebar from './components/layout/sidebar/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CharactersProvider } from './components/context/CharactersContext';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  return (
    <>
      <ToastContainer theme='colored' />
      <div className='app d-flex'>
        <Router>
          <Sidebar />
          <div className='main bg-white'>
            <CharactersProvider>
              <MainRouter />
            </CharactersProvider>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
