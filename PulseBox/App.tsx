/**
 * PulseBox App
 * A React Native streaming app
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FormsProvider } from './src/context/FormsContext';
import { ClassesProvider } from './src/context/ClassesContext';
import { GradesTasksProvider } from './src/context/GradesTasksContext';
import { UserProvider } from './src/context/UserContext';
import { AlertModalProvider } from './src/context/AlertModalContext';

// Import screens
import SplashScreen from './src/onboarding/SplashScreen';
import GetStarted from './src/onboarding/GetStarted';
import Onboarding01 from './src/onboarding/Onboarding01';
import Onboarding02 from './src/onboarding/Onboarding02';
import Onboarding03 from './src/onboarding/Onboarding03';
import Login from './src/authentication/Login';
import SignUp from './src/authentication/SignUp';
import ForgotPassword from './src/authentication/ForgotPassword';
import VerifyOtp from './src/authentication/VerifyOtp';
import TeacherTabShell from './src/main/TeacherTabShell';
import MyForms from './src/main/MyForms';
import CreateForm from './src/forms/CreateForm';
import FormBuilder from './src/forms/FormBuilder';
import EditForm from './src/forms/EditForm.tsx';
import QuestionsScreen from './src/forms/QuestionsScreen.tsx';
import SwapQuestionsScreen from './src/forms/SwapQuestionsScreen.tsx';
import ShareForm from './src/forms/ShareForm.tsx';
// Teacher-specific screens
import LessonPlanner from './src/teacher/LessonPlanner';
import Attendance from './src/teacher/Attendance';
import CreateClass from './src/teacher/CreateClass';
import ClassDetails from './src/teacher/ClassDetails';
import ViewStudents from './src/teacher/ViewStudents';

// Navigation types
import type { RootStackParamList } from './src/types/navigation';
import {
  getFocusedRouteNameFromState,
  isAuthFlowRoute,
} from './src/navigation/focusedRoute';
import BrandedTransitionOverlay from './src/navigation/BrandedTransitionOverlay';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Get Started, onboarding steps, login, sign-up: no stack transition. */
const instantAuthScreenOptions = {
  animation: 'none' as const,
};

const SPLASH_MS = 2000;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [navTick, setNavTick] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const routeNameRef = React.useRef<string | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaProvider>
      <AlertModalProvider>
      <UserProvider>
      <FormsProvider>
        <ClassesProvider>
        <GradesTasksProvider>
          {showSplash ? (
            <SplashScreen />
          ) : (
          <>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={{ flex: 1 }}>
          <NavigationContainer
            onStateChange={(state) => {
              const name = getFocusedRouteNameFromState(state);
              if (!name) return;
              const prev = routeNameRef.current;
              if (name === prev) return;
              routeNameRef.current = name;
              if (prev === undefined) return;
              const prevAuth = isAuthFlowRoute(prev);
              const nextAuth = isAuthFlowRoute(name);
              // No branded overlay while navigating inside auth (get started, onboarding, login, sign-up).
              if (prevAuth === nextAuth) return;
              setNavTick((t) => t + 1);
            }}
          >
        <Stack.Navigator 
          initialRouteName="GetStarted"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen name="GetStarted" component={GetStarted} options={instantAuthScreenOptions} />
          <Stack.Screen name="Onboarding01" component={Onboarding01} options={instantAuthScreenOptions} />
          <Stack.Screen name="Onboarding02" component={Onboarding02} options={instantAuthScreenOptions} />
          <Stack.Screen name="Onboarding03" component={Onboarding03} options={instantAuthScreenOptions} />
          <Stack.Screen name="Login" component={Login} options={instantAuthScreenOptions} />
          <Stack.Screen name="SignUp" component={SignUp} options={instantAuthScreenOptions} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={instantAuthScreenOptions} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtp} options={instantAuthScreenOptions} />
          <Stack.Screen name="Home" component={TeacherTabShell} />
          <Stack.Screen name="MyForms" component={MyForms} />
          {/* Teacher-specific screens */}
          <Stack.Screen name="LessonPlanner" component={LessonPlanner} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="CreateClass" component={CreateClass} />
          <Stack.Screen name="ClassDetails" component={ClassDetails} />
          <Stack.Screen name="ViewStudents" component={ViewStudents} />
          {/* Legacy form screens (for quizzes/assignments) */}
          <Stack.Screen name="CreateForm" component={CreateForm} />
          <Stack.Screen name="FormBuilder" component={FormBuilder} />
          <Stack.Screen name="EditForm" component={EditForm} />
          <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
          <Stack.Screen name="ShareForm" component={ShareForm} />
          <Stack.Screen 
            name="SwapQuestions" 
            component={SwapQuestionsScreen}
            options={{
              presentation: 'card',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
          <BrandedTransitionOverlay tick={navTick} />
          </View>
          </>
          )}
        </GradesTasksProvider>
        </ClassesProvider>
      </FormsProvider>
      </UserProvider>
      </AlertModalProvider>
    </SafeAreaProvider>
  );
}

export default App;
