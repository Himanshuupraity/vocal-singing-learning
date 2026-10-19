import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Spinner } from './components/ui';
import { useApplyTheme } from './hooks/useTheme';
import { useAppData } from './state/AppData';
import { ErrorBoundary } from './components/ErrorBoundary';

const Welcome = lazy(() => import('./pages/Welcome'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearningPath = lazy(() => import('./pages/LearningPath'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const CheckpointPage = lazy(() => import('./pages/CheckpointPage'));
const Riyaz = lazy(() => import('./pages/Riyaz'));
const Studio = lazy(() => import('./pages/Studio'));
const Tutor = lazy(() => import('./pages/Tutor'));
const Songs = lazy(() => import('./pages/Songs'));
const SongPage = lazy(() => import('./pages/SongPage'));
const Videos = lazy(() => import('./pages/Videos'));
const Progress = lazy(() => import('./pages/Progress'));
const Settings = lazy(() => import('./pages/Settings'));
const Baseline = lazy(() => import('./pages/Baseline'));
const Privacy = lazy(() => import('./pages/Privacy'));

export function App() {
  useApplyTheme();
  const { data } = useAppData();
  const location = useLocation();
  const fallback = (
    <div className="grid min-h-[50vh] place-items-center">
      <Spinner />
    </div>
  );

  if (!data.profile.onboarded) {
    return (
      <Suspense fallback={fallback}>
        <Welcome />
      </Suspense>
    );
  }

  return (
    <Layout>
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<LearningPath />} />
            <Route path="/learn/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/learn/checkpoint/:level" element={<CheckpointPage />} />
            <Route path="/riyaz" element={<Riyaz />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/studio/:tool" element={<Studio />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/songs/:songId" element={<SongPage />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/baseline" element={<Baseline />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
