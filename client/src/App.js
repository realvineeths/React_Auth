import {BrowserRouter,Route, Routes} from 'react-router-dom';
import { useCallback, useContext, useEffect} from "react";
import {UserContext} from './context/userContext'
import Login from './Login';
import Home from './home';
import Loader from './loader';
import Aboutus from './aboutus';




function App() {
    const [context, setContext] = useContext(UserContext);
    return  context.token?(
        <>
        <BrowserRouter>
          <Routes>
            <Route path='/' exact element={<Home/>}/>
            <Route path='/home' exact element={<Home/>}/>
            <Route path='/aboutus' exact element={<Aboutus/>}/>
          </Routes>
        </BrowserRouter>
        </>

    ) : (
      //incase the user is not authecticated
      <BrowserRouter>
      <Routes>
                <Route path='*' exact element={<Login/>}/>
      </Routes>
      </BrowserRouter>
    );
}

export default App;