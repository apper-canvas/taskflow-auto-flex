import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/store'
import Root from '@/layouts/Root'
import Layout from '@/components/organisms/Layout'
import Loading from '@/components/ui/Loading'

// Route Components
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const TaskManager = lazy(() => import('@/components/pages/Dashboard'))
const StaffPage = lazy(() => import('@/components/pages/StaffPage'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))

// Loading fallback component
function LoadingFallback() {
  return <Loading message="Loading page..." />
}

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Suspense fallback={<LoadingFallback />}><ErrorPage /></Suspense>,
    children: [
      {
        path: 'login',
        element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>
      },
      {
        path: 'signup', 
        element: <Suspense fallback={<LoadingFallback />}><Signup /></Suspense>
      },
      {
        path: 'reset-password',
        element: <Suspense fallback={<LoadingFallback />}><ResetPassword /></Suspense>
      },
      {
        path: 'prompt-password',
        element: <Suspense fallback={<LoadingFallback />}><PromptPassword /></Suspense>
      },
      {
        path: 'callback',
        element: <Suspense fallback={<LoadingFallback />}><Callback /></Suspense>
      },
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Suspense fallback={<LoadingFallback />}><TaskManager /></Suspense>
          },
          {
            path: 'staff',
            element: <Suspense fallback={<LoadingFallback />}><StaffPage /></Suspense>
          }
        ]
      },
      {
        path: '*',
        element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>
      }
    ]
  }
])