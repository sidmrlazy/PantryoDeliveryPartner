import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  TextInput,
  ToastAndroid,
  LogBox,
  TouchableOpacity,
} from 'react-native';

// Library
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import LoaderScreen from './LoaderScreen';
import RazorpayCheckout from 'react-native-razorpay';
import {AuthContext} from './Utils';

const OtpVerification = ({navigation, route}) => {
  const {signIn} = React.useContext(AuthContext);
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
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountType, setBankAccountType] = useState('');
  const [bankIFSCCode, setBankIFSCCode] = useState('');
  const [bikeNumber, setBikeNumber] = useState('');
  const [idImg, setIdImg] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [bikeRegImg, setBikeRegImg] = useState('');
  const [bikeInsuranceImg, setBikeInsuranceImg] = useState('');
  const [bikePollImg, setBikePollImg] = useState('');
  const [genderType, setGenderType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [razorpayKey, setRazorpayKey] = useState('');
  const [referral, setReferral] = useState('');

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  // FCM Token
  const getDeviceToken = async () => {
    messaging()
      .getToken()
      .then(token => {
        // getDeviceToken();
        return setFCMToken(token);
      });
  };

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
    } else if (!pincode) {
      showToast('Please Enter Your  Pincode');
      return;
    } else {
      const data = new FormData();

      data.append('generatedOtp', otp);
      data.append('enteredOtp', internalVal);

      data.append('fullname', name);
      data.append('contactNumber', contactNumber);
      data.append('address', address);
      data.append('pincode', pincode);

      // ========= Bank =========
      data.append('bankAccountNumber', bankAccountNumber);
      data.append('bankAccountType', bankAccountType);
      data.append('bankIFSCCode', bankIFSCCode);
      // ========= Bank =========

      data.append('deliveryPartnerGender', genderType);
      data.append('deliveryPartnerVechileType', vehicleType);
      data.append('bikeRegistrationNumber', bikeNumber);

      // ========= Images =========
      data.append('profileImage', profileImg);
      data.append('idProofImage', idImg);
      data.append('drivingLicenseImage', drivingLicense);
      // ========= Images =========

      // data.append('bikeRegistrationPaperImage', bikeRegImg);
      // data.append('bikeInsurancepaperImage', bikeInsuranceImg);
      // data.append('pollutionPaperImage', bikePollImg);

      data.append('referral', referral);
      data.append('userToken', FCMToken);
      setLoading(true);
      await fetch(
        'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/PantryoDPOtpVerification.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body: data,
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          getDeviceToken();
          if (result.error == 0) {
            let delivery_id = result.delivery_id;
            let contactNumber = result.contactNumber;
            let userToken = result.userToken;
            let userName = result.fullname;
            let userStatus = result.userStatus;
            let verificationStatus = result.verificationStatus;
            let profileImage = result.profileImage;
            let bikeRegistrationNumber = result.bikeRegistrationNumber;
            let drivingLicenseImage = result.drivingLicenseImage;
            let idProofImage = result.idProofImage;
            signIn({
              delivery_id,
              contactNumber,
              userToken,
              userStatus,
              verificationStatus,
              userName,
              bikeRegistrationNumber,
              profileImage,
              drivingLicenseImage,
              idProofImage,
            });
            // RazorpayFunction(
            //   delivery_id,
            //   contactNumber,
            //   userToken,
            //   userName,
            //   userStatus,
            //   verificationStatus,
            //   bikeRegistrationNumber,
            //   profileImage,
            // );
          } else {
            showToast('Error 404 (otpMatch): ' + result.msg);
          }
        })
        .catch(error => {
          console.error('otpMatch function: ' + error);
        })
        .finally(() => setLoading(false));
    }
  };

  const reSendOtp = () => {
    console.log('OTP Resent!');
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);

    // getRazorpayKey();

    // textInputFocus();
    getDeviceToken();

    setOTP(route.params.generatedOtp);
    setContactNumber(route.params.contactNumber);
    setName(route.params.fullname);
    setAddress(route.params.address);
    setPincode(route.params.pincode);
    setBankAccountNumber(route.params.bankAccountNumber);
    setBankIFSCCode(route.params.bankIFSCCode);
    setGenderType(route.params.deliveryPartnerGender);
    setVehicleType(route.params.deliveryPartnerVechileType);
    setBankAccountType(route.params.bankAccountType);
    setBikeNumber(route.params.bikeRegistrationNumber);

    // =======Images=========
    setProfileImg(route.params.profileImage);
    setIdImg(route.params.idProofImage);
    setDrivingLicense(route.params.drivingLicenseImage);
    // =======Images=========

    setFCMToken(route.params.userToken);
    setReferral(route.params.referral);
    // setBikeRegImg(route.params.bikeRegistrationPaperImage);
    // setBikeInsuranceImg(route.params.bikeInsurancepaperImage);
    // setBikePollImg(route.params.pollutionPaperImage);
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Text
          style={{
            fontFamily: 'OpenSans-SemiBold',
            fontSize: 16,
            marginTop: 20,
          }}>
          Enter your 6 Digit OTP sent via SMS
        </Text>
        <View
          style={{
            width: '100%',
            marginTop: 20,
            borderWidth: 2.5,
            paddingVertical: 5,
            borderColor: '#400938',
            borderRadius: 5,
            paddingHorizontal: 10,
          }}>
          <TextInput
            placeholder=""
            style={{
              width: '100%',
              fontFamily: 'OpenSans-Regular',
              letterSpacing: 15,
              fontSize: 20,
              color: '#777',
            }}
            value={internalVal}
            onChangeText={setInternalVal}
            keyboardType="numeric"
            maxLength={6}
            onSubmitEditing={otpMatch}
          />
        </View>

        <TouchableOpacity
          style={{
            width: '100%',
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 18,
            backgroundColor: '#5E3360',
          }}
          onPress={otpMatch}>
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 18,
              color: '#fff',
            }}>
            SUBMIT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '100%',
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          onPress={reSendOtp}>
          <Text
            style={{
              fontFamily: 'OpenSans-SemiBold',
              fontSize: 18,
            }}>
            Re-Send OTP
          </Text>
        </TouchableOpacity>
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

// const getRazorpayKey = async () => {
//   const secretKey = 'ja3n4n31n2l35ncmnvlae979sdf73';
//   fetch('https://gizmmoalchemy.com/api/pantryo/razorpayKey.php', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       secretkey: secretKey,
//     }),
//   })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       setRazorpayKey(result.key);
//       getRazorpayKey();
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };

// RazorpayFunction Payment APi
// const RazorpayFunction = async (
//   delivery_id,
//   contactNumber,
//   userToken,
//   userName,
//   userStatus,
//   verificationStatus,
//   bikeRegistrationNumber,
//   profileImage,
// ) => {
//   var options = {
//     description: '',
//     image: 'https://gizmmoalchemy.com/api/pantryo/Logo/PantryoLogo.png',
//     currency: 'INR',
//     key: razorpayKey,
//     amount: '100',
//     name: 'Pantryo',
//     prefill: {
//       email: 'support@pantryo.com',
//       contact: contactNumber,
//       name: userName,
//     },
//     theme: {color: '#6a3091'},
//   };

//   RazorpayCheckout.open(options)
//     .then(data => {
//       let payment_id = `${data.razorpay_payment_id}`;
//       getPaymentStatus(
//         payment_id,
//         delivery_id,
//         contactNumber,
//         userToken,
//         userName,
//         userStatus,
//         verificationStatus,
//         bikeRegistrationNumber,
//         profileImage,
//       );
//     })
//     .catch(error => {
//       console.log(
//         'RazorPay Function Error: ' +
//           JSON.stringify(`${error.code} | ${error.description}`),
//       );
//     });
// };

// Check Payment Status
// const getPaymentStatus = async (
//   payment_id,
//   delivery_id,
//   contactNumber,
//   userToken,
//   userName,
//   userStatus,
//   verificationStatus,
//   bikeRegistrationNumber,
//   profileImage,
// ) => {
//   setLoading(true);
//   await fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/paymentdetails.php?flag=delivery_transaction',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         payment_id: payment_id,
//         delivery_id: delivery_id,
//       }),
//     },
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       if (result.payment_status === 'success') {
//         signIn({
//           delivery_id,
//           contactNumber,
//           userToken,
//           userStatus,
//           verificationStatus,
//           userName,
//           bikeRegistrationNumber,
//           profileImage,
//         });
//       } else {
//         showToast('Status of Payment' + ' ' + JSON.stringify(result));
//       }
//     })
//     .catch(error => {
//       console.error('getPaymentStatus function: ' + error);
//     })
//     .finally(() => setLoading(false));
// };
