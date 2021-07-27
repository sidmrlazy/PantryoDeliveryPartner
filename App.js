import React, {useRef, useState, useEffect, useMemo, useReducer} from 'react';
import {ToastAndroid, View, Text} from 'react-native';

// ===== Libraries ===== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import linking from './controller/linking';
import {AuthContext} from './controller/Utils';

// ===== Screens ===== //
import SplashScreen from './controller/SplashScreen';
import LoginScreen from './controller/LoginScreen';
import Register from './controller/Register';
import Navigation from './controller/Navigation';

const Stack = createStackNavigator();

const App = () => {
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken', action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.clear();
          AsyncStorage.removeItem('userToken', action.token);
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        const {contactNumber} = data;
        AsyncStorage.setItem('contactNumber', contactNumber);
        dispatch({type: 'SIGN_IN', token: 'userToken'});
        showToast('Welcome Partner!');
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {},
    }),
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      const bootstrapAsync = async () => {
        let userToken;

        try {
          userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {}
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      };

      bootstrapAsync();
    }, 3000);
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator headerMode="none">
          {state.isLoading ? (
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
          ) : state.userToken == null ? (
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                title: 'Sign in',
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            <Stack.Screen
              name="Navigation"
              component={Navigation}
              options={{
                title: 'Home',
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
