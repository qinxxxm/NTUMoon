import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Home from "./pages/Home";
import Review from "./pages/Review";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import SendEmail from "./pages/SendEmail";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import Timetable from "./pages/Timetable";
function App() {
    const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
              // element={<Home />} 
            />
            <Route 
              path="/review/:courseCode" 
              element={user ? <Review /> : <Navigate to="/login" />} 
              //NOT enabling the user authentication check first because i(yuhao) cannot log in
              // element={<Review />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route
              path = "/sendEmail"
              element={<SendEmail/ >}
            />
            <Route
              path = "/resetPassword"
              element={<ResetPassword/ >}
            />
            <Route 
              path="/account" 
              element={user ? <Account /> : <Navigate to="/account" />} 
            />
             <Route
              path="/settings"
              element={user ? <Settings /> : <Navigate to="/" />}
             />
             <Route
              path="/timetable"
              element={
              user ? (
                  <Timetable />
                    ) : (
                        <Navigate to="/timetable" />
                    )}
              />
          </Routes>
        </div>
    );
}

export default App;
