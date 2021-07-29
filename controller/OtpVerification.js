import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ToastAndroid,
  LogBox,
} from 'react-native';

// Library
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import LoaderScreen from './LoaderScreen';

const OtpVerification = ({navigation, route}) => {
  let textInput = useRef(null);
  const lengthInput = 6;
  const [internalVal, setInternalVal] = useState('');
  const [otp, setOTP] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [FCMToken, setFCMToken] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [bikeNumber, setBikeNumber] = useState('');
  const [idImg, setIdImg] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [bikeRegImg, setBikeRegImg] = useState('');
  const [bikeInsuranceImg, setBikeInsuranceImg] = useState('');
  const [bikePollImg, setBikePollImg] = useState('');

  // Show Toast
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  // OTP Match
  const otpMatch = async () => {
    if (!profileImg) {
      showToast('Upload Profile Image it`s Required');
      return;
    } else if (!internalVal) {
      showToast('OTP not found');
      return;
    } else if (!internalVal) {
      showToast('Enter your OTP');
      return;
    } else if (internalVal.length !== 6) {
      showToast('Enter valid OTP');
      return;
    } else if (!name) {
      showToast('Enter your Full Name');
      return;
    } else if (!contactNumber) {
      showToast('Please Enter your Mobile Number');
      return;
    } else if (contactNumber.length !== 10) {
      showToast('Please Enter Valid Mobile Number');
      return;
    } else if (!address) {
      showToast('Please Enter Your Address');
      return;
    } else if (!bikeNumber) {
      showToast('Please Enter Your Registered Bike Number');
      return;
    } else if (!idImg) {
      showToast('Upload your Id Proof it`s Required');
      return;
    } else if (!pincode) {
      showToast('Please Enter Your  Pincode');
      return;
    } else if (!drivingLicense) {
      showToast('Upload your Driving License it`s Required');
      return;
    } else if (!bikeRegImg) {
      showToast('Upload your Registered Bike Plate Image it`s Required');
      return;
    } else if (!bikeInsuranceImg) {
      showToast('Upload your Bike Insurance Paper it`s Required');
      return;
    } else if (!bikePollImg) {
      showToast('Upload your Bike Pollution paper it`s Required');
      return;
    } else {
      const data = new FormData();
      data.append('profileImg', profileImg);
      data.append('generatedOtp', otp);
      data.append('enteredOtp', internalVal);
      data.append('fullname', name);
      data.append('contactNumber', contactNumber);
      data.append('address', address);
      data.append('pincode', pincode);
      data.append('bikeRegistrationNumber', bikeNumber);
      data.append('idProofImage', idImg);
      data.append('drivingLicenseImage', drivingLicense);
      data.append('bikeRegistrationPaperImage', bikeRegImg);
      data.append('bikeInsurancepaperImage', bikeInsuranceImg);
      data.append('pollutionPaperImage', bikePollImg);
      data.append('userToken', FCMToken);
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=DeliveryPartnerRegistration',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body: JSON.stringify(data),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          console.log(result);
          if (result.error == 0) {
            // navigation.navigate('OtpVerification', {fullname});
          } else {
            showToast('Something went wrong');
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  // FCM Token
  const getDeviceToken = async () => {
    messaging()
      .getToken()
      .then(token => {
        return setFCMToken(token);
      });
  };

  const textInputFocus = () => {
    textInput.focus();
  };

  const onChangeText = val => {
    setInternalVal(val);
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
    textInputFocus();
    getDeviceToken();
    setOTP(route.params.generatedOtp);
    setContactNumber(route.params.contactNumber);
    setProfileImg(route.params.profileImg);
    setName(route.params.fullname);
    setAddress(route.params.address);
    setPincode(route.params.pincode);
    setBikeNumber(route.params.bikeRegistrationNumber);
    setIdImg(route.params.idProofImage);
    setDrivingLicense(route.params.drivingLicenseImage);
    setBikeRegImg(route.params.bikeRegistrationPaperImage);
    setBikeInsuranceImg(route.params.bikeInsurancepaperImage);
    setBikePollImg(route.params.pollutionPaperImage);
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <View style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior="padding"
          style={styles.containerAvoidingView}>
          <Text style={styles.textTile}>
            Enter your 6 Digit OTP sent via SMS
          </Text>

          <View>
            <TextInput
              placeHolder=""
              value={internalVal}
              maxLength={lengthInput}
              onChangeText={onChangeText}
              returnKeyType="done"
              keyboardType="numeric"
              style={styles.otpInput}
              ref={input => (textInput = input)}
            />
            <View style={styles.containerInput}>
              {Array(lengthInput)
                .fill()
                .map((data, index) => (
                  <View key={index} style={styles.cellView}>
                    <Text
                      style={styles.cellTxt}
                      onPress={() => textInput.focus()}>
                      {internalVal && internalVal.length > 0
                        ? internalVal[index]
                        : ''}
                    </Text>
                  </View>
                ))}
            </View>
            {/* <Pressable
              onPress={resentOTP}
              style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Medium',
                  color: 'blue',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                Resend OTP?
              </Text>
            </Pressable> */}
          </View>
          <Pressable
            // onPress={() => navigation.navigate('RegistrationForm')}
            onPress={() => otpMatch()}
            style={styles.btn}>
            <Text style={styles.btnTxt}>SUBMIT</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9E5',
  },
  containerAvoidingView: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textTile: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  otpInput: {
    width: 0,
    height: 0,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellView: {
    paddingVertical: 10,
    width: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5E3360',
  },
  cellTxt: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  btn: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#5E3360',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
  },
});
