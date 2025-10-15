import { createBrowserRouter } from 'react-router-dom';
import { BaseLayout } from './layouts/base-layout';

import { NotFoundPage } from '../pages/not-found/page';

import { AboutPage } from '../pages/static/about';
import { ContactsPage } from '../pages/static/contacts';
import { PrivacyPage } from '../pages/static/privacy';

import { HomePage } from '../pages/home/HomePage';
import { UsersPage } from '../pages/users/UsersPage';
import { EventsPage } from '../pages/events/EventsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProfilePage } from '../pages/users/ProfilePage';
import { UserEditPage } from '../pages/users/UserEditPage';
import EventDetailPage from '../pages/events/EventDetailPage';
import VenuesList from '../pages/venue/VenuesPage';
import { VenueDetail } from '../pages/venue/VenueDetailPage';
import ResultsPage from '../pages/results/ResultsPage';
import VenueCreatePage from '../pages/venue/VenueCreatePage';
import EventCreatePage from '../pages/events/EventCreatePage';
import TeamsPage from '../pages/teams/TeamsPage';
import { TeamPage } from '../pages/teams/TeamPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      
      {
        path: 'events',
        children: [
          {
            index: true,
            element: <EventsPage/>,
          },
          {
            path: 'create',
            element: <EventCreatePage/>,
          },
          {
            path: ':id',
            element: <EventDetailPage />,
          },
        ],
      },
      {
        path: 'participants',
        element: <UsersPage />,
      },
      {
        path: 'teams',
        children : [
          {
            index : true,
            element: <TeamsPage/>
          }, 
          {
            path: ':id',
            element: <TeamPage/>
          }
        ]
      },
      {
        path: 'venues',
        children: [
          {
            index: true,
            element: <VenuesList/>,
          },
          {
            path: ":id",
            element: <VenueDetail/>,
          },
          {
            path: "create",
            element: <VenueCreatePage/>,
          },
        ]
      },
      {
        path: 'profile/:id',
        element: <ProfilePage />,
      },
      {
        path: 'profile/:id/edit',
        element: <UserEditPage />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <LoginPage/>,
          },
          {
            path: 'register',
            element: <RegisterPage/>,
          },
        ]
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'about',
        element: <AboutPage/>
      },
      {
        path: 'contacts',
        element: <ContactsPage/>
      }, 
      {
        path: 'privacy',
        element: <PrivacyPage/>  
      }
      
    ],
  },
]);