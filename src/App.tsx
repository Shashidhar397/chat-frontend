import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';
import Home from './pages/home/component/Home';
import Login from './pages/login/component/Login';
import SignUp from './pages/signUp/component/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='*' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
