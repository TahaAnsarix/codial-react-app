import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks";
import { Home, Login, Register, Settings, UserProfile } from "../pages";
import { Loader, Navbar } from "./";

const Page404 = () => {
  return <h1>404</h1>;
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  return auth.user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <Loader />;
  }
  //console.log(auth);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/:userId"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
