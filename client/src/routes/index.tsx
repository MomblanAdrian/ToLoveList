import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { ProfileList } from '../pages/ProfileList';
import { CreateProfile } from '../pages/CreateProfile';
import { GroupSetup } from '../pages/GroupSetup';
import { GroupDetail } from '../pages/GroupDetail';
import { CategorySelection } from '../pages/CategorySelection';
import { Questionnaire } from '../pages/Questionnaire';
import { RecommendationFeed } from '../pages/RecommendationFeed';
import { RecommendationDetail } from '../pages/RecommendationDetail';
import { Settings } from '../pages/Settings';

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/profiles', element: <ProfileList /> },
          { path: '/profiles/new', element: <CreateProfile /> },
          { path: '/profiles/:id', element: <CreateProfile /> },
          { path: '/groups', element: <GroupSetup /> },
          { path: '/groups/:id', element: <GroupDetail /> },
          { path: '/categories', element: <CategorySelection /> },
          { path: '/questionnaire/:profileId/:categorySlug', element: <Questionnaire /> },
          { path: '/recommendations/:profileId/:categorySlug', element: <RecommendationFeed /> },
          { path: '/recommendations/group/:groupId/:categorySlug', element: <RecommendationDetail /> },
          { path: '/settings', element: <Settings /> },
        ],
      },
    ],
  },
]);
