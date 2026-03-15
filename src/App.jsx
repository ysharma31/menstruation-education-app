import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
  Home,
  Girls,
  Boys,
  AnimatedExplainer,
  FAQ,
  ParentsGuide,
  AskQuestion,
  Chat,
  UploadVideo,
  Auth
} from './pages';
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
              <Route path="animated" element={<AnimatedExplainer />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="parents" element={<ParentsGuide />} />
              <Route path="ask" element={<AskQuestion />} />
              <Route path="chat" element={<Chat />} />
              <Route path="upload-video" element={<UploadVideo />} />
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
