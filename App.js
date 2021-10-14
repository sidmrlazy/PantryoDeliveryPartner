import React, {useRef, useState, useEffect, useMemo, useReducer} from 'react';
import {
  ToastAndroid,
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';

// ===== Libraries ===== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import linking from './controller/linking';
import {AuthContext} from './controller/Utils';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

// ===== Screens ===== //
import SplashScreen from './controller/SplashScreen';
import LoginScreen from './controller/LoginScreen';
import Register from './controller/Register';
import Navigation from './controller/Navigation';

const Stack = createStackNavigator();

const App = () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [modalImage, setModalImage] = useState('');

  // const navigationNew = useNavigation();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Navigation');

  const window = useWindowDimensions();

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
        const {
          contactNumber,
          delivery_id,
          userToken,
          userName,
          userStatus,
          verificationStatus,
          bikeRegistrationNumber,
          profileImage,
          // drivingLicenseImage,
        } = data;
        AsyncStorage.setItem('contactNumber', contactNumber);
        AsyncStorage.setItem('userName', userName);
        AsyncStorage.setItem('userStatus', userStatus);
        AsyncStorage.setItem('verificationStatus', verificationStatus);
        AsyncStorage.setItem('user_id', delivery_id);
        AsyncStorage.setItem('bikeRegistrationNumber', bikeRegistrationNumber);
        AsyncStorage.setItem('profileImage', profileImage);
        // AsyncStorage.setItem('drivingLicenseImage', drivingLicenseImage);
        dispatch({type: 'SIGN_IN', token: 'userToken'});
        AsyncStorage.setItem('userToken', userToken);
        showToast('Welcome Partner!');
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {},
    }),
    [],
  );

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log(JSON.stringify(remoteMessage));
      setTitle(remoteMessage.data.title);
      setBody(remoteMessage.data.body);
      setModalImage(remoteMessage.data.image);
      setModalVisible(true);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });

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
    return unsubscribe;
  }, []);

  return (
    <>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() =>
            (routeNameRef.current =
              navigationRef.current.getCurrentRoute().name)
          }
          onReady={() =>
            (routeNameRef.current =
              navigationRef.current.getCurrentRoute().name)
          }
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName =
              navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              // await Analytics.setCurrentScreen(currentRouteName);
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }

            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
          }}
          linking={linking}>
          <Stack.Navigator initialRouteName={initialRoute} headerMode="none">
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
      {/* ========= Order Modal ========= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.orderTitle}>{title}</Text>
            {modalImage ? (
              <>
                <View style={styles.modalImgContainer}>
                  <Image
                    source={{uri: modalImage}}
                    style={{
                      width: window.width - 70,
                      height: window.height - 700,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              </>
            ) : null}

            <Text style={styles.orderBody}>{body}</Text>

            <TouchableOpacity
              style={styles.orderBtn}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.orderBtnTxt}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ========= Order Modal ========= */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 50,
    paddingHorizontal: 20,
    paddingTop: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  orderTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#5E3360',
  },
  orderBody: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
  },
  orderBtn: {
    marginTop: 40,
    width: '100%',
    backgroundColor: '#5E3360',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  orderBtnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#fff',
  },
  modalImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    maxWidth: '95%',
    maxHeight: '95%',
    alignSelf: 'center',
  },
});
