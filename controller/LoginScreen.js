import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ToastAndroid,
} from 'react-native';

// Libraries
import LottieView from 'lottie-react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './Utils';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import Register from './Register';
import OtpVerification from './OtpVerification';
import LoaderScreen from './LoaderScreen';

const LoginScreen = ({navigation}) => {
  const [contactNumber, setContactNumber] = React.useState('');
  const [token, setToken] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {signIn} = React.useContext(AuthContext);

  // FCM Token
  const getDeviceToken = async () => {
    messaging()
      .getToken()
      .then(token => {
        return setToken(token);
      });
  };

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const loginApi = async () => {
    if (!contactNumber) {
      showToast('Enter your Registered Mobile Number');
      return;
    } else if (contactNumber.length !== 10) {
      showToast('Enter valid Mobile Number');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=DeliveryPartnerLogin',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactNumber: contactNumber,
            userToken: token,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // console.log(result);
          if (result.error == 0) {
            let delivery_id = result.delivery_id;
            let contactNumber = result.contactNumber;
            let userToken = result.userToken;
            let userName = result.fullname;
            let profileImage = result.profileImage;
            let bikeRegistrationNumber = result.bikeRegistrationNumber;
            signIn({
              delivery_id,
              contactNumber,
              userToken,
              userName,
              bikeRegistrationNumber,
              profileImage,
            });
          } else {
            showToast('Error:' + ' ' + result.msg);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  React.useEffect(() => {
    getDeviceToken();
  }, []);
  return (
    <>
      {loading == true ? <LoaderScreen /> : null}
      <View style={styles.topContainer}>
        <View style={styles.topRow}>
          <View style={styles.div}>
            <Text style={styles.first}>Pantryo</Text>
            <Text style={styles.second}>Delivery</Text>
            <Text style={styles.third}>Partner</Text>
          </View>
          <LottieView
            source={require('../assets/lottie/delivery.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.loginContainer}>
          <Text style={styles.heading}>Login</Text>
          <Text style={styles.caption}>
            Enter your registered mobile number to login
          </Text>

          <View style={styles.loginRow}>
            <Icons name="phone-portrait-outline" size={20} color="#5E3360" />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="#777"
              keyboardType="phone-pad"
              style={styles.txtInput}
              onChangeText={text => setContactNumber(text)}
              onSubmitEditing={loginApi}
              maxLength={10}
            />
          </View>
        </View>

        <Pressable onPress={loginApi} style={styles.loginBtn}>
          <Text style={styles.loginTxt}>LOGIN</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={styles.registerBtn}>
          <Text style={styles.registerBtnTxt}>REGISTER</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

const Stack = createStackNavigator();

const LoginScreenContainer = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#FEF9E5',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontFamily: 'Nunito-Bold',
            fontSize: 18,
          },
        }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          title: 'Register',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontFamily: 'OpenSans-SemiBold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{
          title: 'OTP Verification',
          headerStyle: {
            backgroundColor: '#FEF9E5',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontFamily: 'OpenSans-SemiBold',
            fontSize: 18,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginScreenContainer;

const styles = StyleSheet.create({
  topContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FEF9E5',
    paddingHorizontal: 20,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  div: {
    flex: 1,
    paddingTop: 60,
  },
  first: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 30,
    color: '#C6B5C7',
  },
  second: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 40,
    color: '#5E3360',
  },
  third: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 44,
    color: '#5E3360',
  },
  animation: {
    width: 200,
    height: 200,
    paddingTop: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  heading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
    color: '#5E3360',
  },
  caption: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  loginRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#5E3360',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 30,
    paddingVertical: 10,
    marginBottom: 20,
  },
  txtInput: {
    marginLeft: 10,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  loginBtn: {
    marginTop: 20,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F4AA79',
    borderRadius: 5,
  },
  loginTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#fff',
  },
  registerBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#C6B5C7',
    borderRadius: 5,
  },
  registerBtnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#fff',
  },
});
