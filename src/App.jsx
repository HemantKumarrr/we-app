import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Layout from "./layout/Layout";
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
import Private from "./private/Private";
const Create = lazy(() => import("./pages/Create"));
const Home = lazy(() => import("./pages/Home"));
const SinglePost = lazy(() => import("./pages/SinglePost"));
import { GoogleOAuthProvider } from "@react-oauth/google";
const MyQuestions = lazy(() => import("./pages/MyQuestions"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const BookMarks = lazy(() => import("./pages/BookMarks"));
import PageLoader from "./components/PageLoader";
const DashBoard = lazy(() => import("./pages/DashBoard"));
const OTP = lazy(() => import("./pages/Auth/OTP"));
import LocomotiveScroll from "locomotive-scroll";

function App() {
  const locomotiveScroll = new LocomotiveScroll();

  const GoogleWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      </GoogleOAuthProvider>
    );
  };

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              }
            />
            <Route path="/login" element={<GoogleWrapper />} />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Signup />
                </Suspense>
              }
            />
            <Route
              path="/signup/otp/:email"
              element={
                <Suspense fallback={<PageLoader />}>
                  <OTP />
                </Suspense>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ForgotPassword />
                </Suspense>
              }
            />
            <Route element={<Private allowedRoles={["admin"]} />}>
              <Route
                path="/admin/dashboard"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <DashBoard />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="/post/:postId"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SinglePost />
                </Suspense>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ResetPassword />
                </Suspense>
              }
            />

            {/* ADMIN AND USER ROUTES */}

            <Route element={<Private allowedRoles={["admin", "user"]} />}>
              <Route
                path="/create"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Create />
                  </Suspense>
                }
              />
              <Route
                path="/myprofile"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <MyProfile />
                  </Suspense>
                }
              />
              <Route
                path="/post/user/:uid"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <MyQuestions />
                  </Suspense>
                }
              />
              <Route
                path="/post/bookmarks"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <BookMarks />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
