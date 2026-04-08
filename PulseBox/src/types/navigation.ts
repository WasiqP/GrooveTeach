/** Bottom tab keys rendered in-place inside `TeacherTabShell` (single `Home` stack screen). */
export type MainTabRoute = 'Home' | 'MyClasses' | 'Quizzes' | 'ViewGrades' | 'Settings';

export type RootStackParamList = {
  GetStarted: undefined;
  Onboarding01: undefined;
  Onboarding02: undefined;
  Onboarding03: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: { email?: string } | undefined;
  /** After signup or forgot-password, verify the email with a 6-digit code. */
  VerifyOtp: { email: string; purpose: 'signup' | 'reset'; name?: string };
  /**
   * Main teacher shell: tab panels swap in place (see `TeacherTabShell`).
   * Use `tab` when returning from another screen to open a specific tab.
   */
  Home: { tab?: MainTabRoute } | undefined;
  MyForms: undefined; // Legacy route (now Quizzes)
  MainScreen: undefined;
  // Teacher-specific screens
  CreateClass: undefined;
  ClassDetails: { classId: string };
  /** Roster for a class (from saved Create Class data). */
  ViewStudents: { classId: string };
  LessonPlanner: undefined;
  /** Omit `classId` to choose a class on the Attendance screen first. */
  Attendance: { classId?: string };
  Grading: { assignmentId?: string; classId?: string };
  StudentProfile: { studentId: string };
  CreateAssignment: { classId: string };
  ParentCommunication: { studentId?: string };
  AIAssistant: undefined;
  Reports: undefined;
  // Legacy form screens (can be repurposed later)
  CreateForm: undefined;
  FormBuilder: { answers?: any };
  EditForm: { formId: string };
  QuestionsScreen: { formId: string; questionId: string };
  SwapQuestions: { formId: string };
  ShareForm: { formId: string };
};


