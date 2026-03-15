import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TeacherLayout from './components/teacher/TeacherLayout';
import {
  Home,
  Girls,
  Boys,
  Teachers,
  AnimatedExplainer,
  FAQ,
  ParentsGuide,
  AskQuestion,
  Chat,
  UploadVideo,
  Auth
} from './pages';
import TeacherAuth from './pages/teacher/TeacherAuth';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';

// Initialize i18n
import './i18n';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="girls" element={<Girls />} />
              <Route path="boys" element={<Boys />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="animated" element={<AnimatedExplainer />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="parents" element={<ParentsGuide />} />
              <Route path="ask" element={<AskQuestion />} />
              <Route path="chat" element={<Chat />} />
              <Route path="upload-video" element={<UploadVideo />} />
            </Route>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherAuth />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
