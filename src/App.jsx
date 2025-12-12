import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
  Home,
  Girls,
  Boys,
  AnimatedExplainer,
  FAQ,
  ParentsGuide,
  AskQuestion
} from './pages';

// Initialize i18n
import './i18n';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="girls" element={<Girls />} />
          <Route path="boys" element={<Boys />} />
          <Route path="animated" element={<AnimatedExplainer />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="parents" element={<ParentsGuide />} />
          <Route path="ask" element={<AskQuestion />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
