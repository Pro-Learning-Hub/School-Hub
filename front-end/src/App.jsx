import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, Outlet} from 'react-router-dom';
import './App.css';
import './components/Login/css/util.css';
import './components/Login/css/main.css';
import './components/Register/css/util.css';
import './components/Register/css/main.css';
import Spinner from './components/utilityComponents/Spinner';
import Sidebar from './components/Sidebar/sidebar';
import useConnectSocket from './hooks/socketConnectionHooks';
import { selectIsLoggedIn } from './redux/selectors/uiSelectors';

// Lazy-loaded route components for code splitting
const Lectures = React.lazy(() => import('./components/Lectures/Lectures'));
const Announcements = React.lazy(() => import('./components/Announcements/Announcements'));
const GeneralDiscussion = React.lazy(() => import('./components/GeneralDiscussion/GeneralDiscussion'));
const Lecture = React.lazy(() => import('./components/Lecture/Lecture'));
const Replies = React.lazy(() => import('./components/Replies/Replies'));
const Login = React.lazy(() => import('./components/Login/Login'));
const Register = React.lazy(() => import('./components/Register/Register'));
const CreateNewLecture = React.lazy(() => import('./components/CreateLectureForm/CreateLectureForm'));
const EditLectureForm = React.lazy(() => import('./components/EditLectureForm/EditLectureForm'));

function ProtectedLayout() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (!isLoggedIn) {
    sessionStorage.setItem('intendedPath', window.location.pathname);
    return <Navigate to="/login" replace/>
  } else {
    return <Outlet />
  }
}

// Loading fallback component for code splitting
function RouteLoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      width: '100%'
    }}>
      <Spinner />
    </div>
  );
}

function App() {
  const isLoading = useSelector((state) => state.ui.get('isLoading'));
  const isLoggedIn = useSelector(selectIsLoggedIn);
  useConnectSocket();

  return (
    <div className="APP">
      {isLoading && <Spinner />}
      {isLoggedIn && <Sidebar />}
      <Suspense fallback={<RouteLoadingSpinner />}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Lectures />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/lectures/:lectureId" element={<Lecture />} />
            <Route path="/lectures/new" element={<CreateNewLecture />} />
            <Route path="/lectures/:lectureId/edit" element={<EditLectureForm />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/discussion" element={<GeneralDiscussion />} />
            <Route path="questions/:questionId" element={<Replies />} />
          </Route>
          <Route path="*" element={<h1>Oops, not found!</h1>} />
        </Routes>
      </Suspense>
      <Toaster reverseOrder={true} />
    </div>
  );
}

export default App;
