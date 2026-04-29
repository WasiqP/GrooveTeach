import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import { PulseAlertProvider } from './context/PulseAlertContext'
import { ClassesProvider } from './context/ClassesContext'
import { FormsProvider } from './context/FormsContext'
import { GradesTasksProvider } from './context/GradesTasksContext'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/layout/ProtectedRoute'

/**
 * Marketing routes are heavy (Lenis, GSAP, Framer Motion). Lazy-load them so
 * the authenticated app doesn't pay for animation libs it never uses.
 */
const MarketingShell = lazy(() => import('./components/marketing/MarketingShell'))
const MarketingHome = lazy(() => import('./pages/marketing/Home'))
const MarketingAbout = lazy(() => import('./pages/marketing/About'))
const MarketingPricing = lazy(() => import('./pages/marketing/Pricing'))
const MarketingContact = lazy(() => import('./pages/marketing/Contact'))

import Splash from './pages/onboarding/Splash'
import Onboarding01 from './pages/onboarding/Onboarding01'
import Onboarding02 from './pages/onboarding/Onboarding02'
import Onboarding03 from './pages/onboarding/Onboarding03'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOtp from './pages/auth/VerifyOtp'
import Home from './pages/dashboard/Home'
import MyClasses from './pages/dashboard/MyClasses'
import CreateClass from './pages/dashboard/CreateClass'
import ClassDetails from './pages/dashboard/ClassDetails'
import ViewStudents from './pages/dashboard/ViewStudents'
import StudentRecords from './pages/dashboard/StudentRecords'
import Attendance from './pages/dashboard/Attendance'
import AttendancePicker from './pages/dashboard/AttendancePicker'
import Quizzes from './pages/dashboard/Quizzes'
import CreateForm from './pages/dashboard/CreateForm'
import EditForm from './pages/dashboard/EditForm'
import QuestionsScreen from './pages/dashboard/QuestionsScreen'
import ShareForm from './pages/dashboard/ShareForm'
import ViewGrades from './pages/dashboard/ViewGrades'
import TaskGradeReport from './pages/dashboard/TaskGradeReport'
import LessonPlanner from './pages/dashboard/LessonPlanner'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'
import NotificationSettings from './pages/dashboard/settings/NotificationSettings'
import LanguageSettings from './pages/dashboard/settings/LanguageSettings'
import StaticPage from './pages/dashboard/settings/StaticPage'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppSettingsProvider>
          <PulseAlertProvider>
            <ClassesProvider>
              <FormsProvider>
                <GradesTasksProvider>
                  <BrowserRouter>
                    <Routes>
                      {/* Public marketing pages — share a single shell with Lenis + nav + footer */}
                      <Route
                        element={
                          <Suspense fallback={<MarketingFallback />}>
                            <MarketingShell />
                          </Suspense>
                        }
                      >
                        <Route path="/" element={<MarketingHome />} />
                        <Route path="/about" element={<MarketingAbout />} />
                        <Route path="/pricing" element={<MarketingPricing />} />
                        <Route path="/contact" element={<MarketingContact />} />
                      </Route>

                      {/* Optional onboarding flow (kept at /welcome and /onboarding/* — no longer linked from anywhere) */}
                      <Route path="/welcome" element={<Splash />} />
                      <Route path="/onboarding/1" element={<Onboarding01 />} />
                      <Route path="/onboarding/2" element={<Onboarding02 />} />
                      <Route path="/onboarding/3" element={<Onboarding03 />} />

                      {/* Auth */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />

                      {/* Authenticated app shell */}
                      <Route
                        path="/app"
                        element={
                          <ProtectedRoute>
                            <AppShell />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Home />} />

                        {/* Classes */}
                        <Route path="classes" element={<MyClasses />} />
                        <Route path="classes/new" element={<CreateClass />} />
                        <Route path="classes/:classId" element={<ClassDetails />} />
                        <Route path="classes/:classId/students" element={<ViewStudents />} />
                        <Route
                          path="classes/:classId/students/:studentId"
                          element={<StudentRecords />}
                        />
                        <Route path="classes/:classId/attendance" element={<Attendance />} />

                        {/* Attendance shortcut */}
                        <Route path="attendance" element={<AttendancePicker />} />

                        {/* Quizzes / Forms */}
                        <Route path="quizzes" element={<Quizzes />} />
                        <Route path="quizzes/new" element={<CreateForm />} />
                        <Route path="quizzes/:formId" element={<EditForm />} />
                        <Route
                          path="quizzes/:formId/questions/:questionId"
                          element={<QuestionsScreen />}
                        />
                        <Route path="quizzes/:formId/share" element={<ShareForm />} />

                        {/* Grades */}
                        <Route path="grades" element={<ViewGrades />} />
                        <Route
                          path="grades/:classId/:taskId"
                          element={<TaskGradeReport />}
                        />

                        {/* Side flows */}
                        <Route path="lesson-planner" element={<LessonPlanner />} />
                        <Route path="profile" element={<Profile />} />

                        {/* Settings */}
                        <Route path="settings" element={<Settings />} />
                        <Route
                          path="settings/notifications"
                          element={<NotificationSettings />}
                        />
                        <Route path="settings/language" element={<LanguageSettings />} />
                        <Route
                          path="settings/help"
                          element={
                            <StaticPage
                              subtitle="Settings"
                              title="Help & Support"
                              body={`Need a hand?\n\nEmail support@teachtrack.app and the TeeTee crew will help.`}
                            />
                          }
                        />
                        <Route
                          path="settings/about"
                          element={
                            <StaticPage
                              subtitle="Settings"
                              title="About TeachTrack"
                              body={`TeachTrack v0.1.0\n\nA teacher’s personal assistant. Plan, run, and track class — without jumping between apps.\n\nMascot: TeeTee (the owl).`}
                            />
                          }
                        />
                        <Route
                          path="settings/terms"
                          element={
                            <StaticPage
                              subtitle="Settings"
                              title="Terms of Service"
                              body={`Use TeachTrack responsibly. Don’t share student data with anyone who shouldn’t see it.\n\nFull terms: coming soon.`}
                            />
                          }
                        />
                        <Route
                          path="settings/privacy"
                          element={
                            <StaticPage
                              subtitle="Settings"
                              title="Privacy Policy"
                              body={`Your students’ data stays yours. We never sell it. We store only what we need to make TeachTrack work.\n\nFull policy: coming soon.`}
                            />
                          }
                        />
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>
                </GradesTasksProvider>
              </FormsProvider>
            </ClassesProvider>
          </PulseAlertProvider>
        </AppSettingsProvider>
      </UserProvider>
    </AuthProvider>
  )
}

/**
 * Brand-aligned loader shown while marketing chunks load.
 * Stays subtle so it doesn't flash on warm caches.
 */
function MarketingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--ink-canvas)',
      }}
    >
      <div
        aria-hidden
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          border: '3px solid var(--ink-rowDivider)',
          borderTopColor: 'var(--primary)',
          animation: 'tt-mkt-spin 0.9s linear infinite',
        }}
      />
      <style>{`@keyframes tt-mkt-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
