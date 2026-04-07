/**
 * PulseBox App
 * A React Native streaming app
 *
 * @format
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FormsProvider } from './src/context/FormsContext';
import { ClassesProvider } from './src/context/ClassesContext';
import { UserProvider } from './src/context/UserContext';

// Import screens
import GetStarted from './src/onboarding/GetStarted';
import Onboarding01 from './src/onboarding/Onboarding01';
import Onboarding02 from './src/onboarding/Onboarding02';
import Onboarding03 from './src/onboarding/Onboarding03';
import Login from './src/authentication/Login';
import SignUp from './src/authentication/SignUp';
import Home from './src/main/Home';
import MyForms from './src/main/MyForms';
import Responses from './src/main/Responses';
import Settings from './src/main/Settings';
import CreateForm from './src/forms/CreateForm';
import FormBuilder from './src/forms/FormBuilder';
import EditForm from './src/forms/EditForm.tsx';
import QuestionsScreen from './src/forms/QuestionsScreen.tsx';
import SwapQuestionsScreen from './src/forms/SwapQuestionsScreen.tsx';
import ShareForm from './src/forms/ShareForm.tsx';
// Teacher-specific screens
import MyClasses from './src/main/MyClasses';
import LessonPlanner from './src/teacher/LessonPlanner';
import Attendance from './src/teacher/Attendance';
import Quizzes from './src/teacher/Quizzes';
import CreateClass from './src/teacher/CreateClass';
import ClassDetails from './src/teacher/ClassDetails';

// Navigation types
import type { RootStackParamList } from './src/types/navigation';
import {
  getFocusedRouteNameFromState,
  isAuthFlowRoute,
} from './src/navigation/focusedRoute';
import BrandedTransitionOverlay from './src/navigation/BrandedTransitionOverlay';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Get Started + onboarding steps: no stack transition (instant). */
const onboardingScreenOptions = {
  animation: 'none' as const,
};

/** Fade for login + sign-up (not main app). */
const authFlowScreenOptions = {
  animation: 'fade_from_bottom' as const,
  animationDuration: 520,
  fullScreenGestureEnabled: true,
};

const ONBOARDING_ROUTE_NAMES = new Set([
  'GetStarted',
  'Onboarding01',
  'Onboarding02',
  'Onboarding03',
]);

function isOnboardingOnlyTransition(prev: string | undefined, next: string | undefined) {
  return (
    prev != null &&
    next != null &&
    ONBOARDING_ROUTE_NAMES.has(prev) &&
    ONBOARDING_ROUTE_NAMES.has(next)
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [navTick, setNavTick] = useState(0);
  const routeNameRef = React.useRef<string | undefined>(undefined);

  return (
    <SafeAreaProvider>
      <UserProvider>
      <FormsProvider>
        <ClassesProvider>
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
              // Purple overlay only between auth-flow screens (not when entering/leaving main app).
              if (!isAuthFlowRoute(name) || !isAuthFlowRoute(prev)) return;
              // No branded flash when moving only between Get Started + onboarding slides.
              if (isOnboardingOnlyTransition(prev, name)) return;
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
          <Stack.Screen name="GetStarted" component={GetStarted} options={onboardingScreenOptions} />
          <Stack.Screen name="Onboarding01" component={Onboarding01} options={onboardingScreenOptions} />
          <Stack.Screen name="Onboarding02" component={Onboarding02} options={onboardingScreenOptions} />
          <Stack.Screen name="Onboarding03" component={Onboarding03} options={onboardingScreenOptions} />
          <Stack.Screen name="Login" component={Login} options={authFlowScreenOptions} />
          <Stack.Screen name="SignUp" component={SignUp} options={authFlowScreenOptions} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MyForms" component={MyForms} />
          <Stack.Screen name="MyClasses" component={MyClasses} />
          <Stack.Screen name="Quizzes" component={Quizzes} />
          <Stack.Screen name="Responses" component={Responses} />
          <Stack.Screen name="Settings" component={Settings} />
          {/* Teacher-specific screens */}
          <Stack.Screen name="LessonPlanner" component={LessonPlanner} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="CreateClass" component={CreateClass} />
          <Stack.Screen name="ClassDetails" component={ClassDetails} />
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
        </ClassesProvider>
      </FormsProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

export default App;
