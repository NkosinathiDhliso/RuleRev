import React, { Suspense, lazy, useEffect } from 'react';
import { LoadingSpinner } from './components/ui';
import { WebGLBackground } from './components/WebGLBackground/WebGLBackground';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { CallToAction } from './components/CallToAction/CallToAction';
import { Footer } from './components/Footer/Footer';
import './styles/global.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Lazy load page components with better error handling
const QuestionnairePage = lazy(() => 
  import('./components/Questionnaire/QuestionnairePage').then(module => ({ 
    default: module.QuestionnairePage 
  }))
);
const Connect = lazy(() => 
  import('./components/Connect/Connect').then(module => ({ 
    default: module.Connect 
  }))
);
const Privacy = lazy(() => 
  import('./components/Privacy/Privacy').then(module => ({ 
    default: module.Privacy 
  }))
);
const Terms = lazy(() => 
  import('./components/Terms/Terms').then(module => ({ 
    default: module.Terms 
  }))
);
const Projects = lazy(() => 
  import('./components/Projects/Projects').then(module => ({ 
    default: module.Projects 
  }))
);

// Enhanced loading component with themed spinner
const PageLoader = () => (
  <LoadingSpinner 
    fullScreen 
    size="large" 
    message="Loading page..." 
  />
);

function RootLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const showWebGL = !['/discovery', '/privacy', '/terms'].includes(pathname);

  return (
    <div className="min-h-screen" style={{ paddingTop: '80px' }}>
      {showWebGL && <WebGLBackground />}
      <Header />
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
      <Footer />
    </div>
  );
}

function App() {
  // Prefetch all lazy pages after initial render to make navigation instant
  useEffect(() => {
    const prefetch = () => {
      // Trigger dynamic imports to warm the module cache
      import('./components/Questionnaire/QuestionnairePage');
      import('./components/Connect/Connect');
      import('./components/Privacy/Privacy');
      import('./components/Terms/Terms');
      import('./components/Projects/Projects');
    };

    if (typeof (window as any).requestIdleCallback === 'function') {
      (window as any).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 500);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RootLayout>
              <Hero />
              <CallToAction />
            </RootLayout>
          }
        />
        <Route
          path="/discovery"
          element={
            <RootLayout>
              <QuestionnairePage />
            </RootLayout>
          }
        />
        <Route
          path="/connect"
          element={
            <RootLayout>
              <Connect />
            </RootLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <RootLayout>
              <Privacy />
            </RootLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <RootLayout>
              <Terms />
            </RootLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <RootLayout>
              <Projects />
            </RootLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;