import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  LogBox,
  Platform,
  PermissionsAndroid,
  Image,
  ToastAndroid,
} from 'react-native';

// Library
import Icons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
navigator.geolocation = require('@react-native-community/geolocation');

// Loader Screeen
import LoaderScreen from '../controller/LoaderScreen';

const Register = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [profileImgPath, setProfileImgPath] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIFSCCode, setBankIFSCCode] = useState('');
  const [bankAccountType, setBankAccountType] = useState('');
  const [bikeNumber, setBikeNumber] = useState('');
  const [idImg, setIdImg] = useState('');
  const [idImgPath, setIdImgPath] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [drivingLicensePath, setDrivingLicensePath] = useState('');
  const [bikeRegImg, setBikeRegImg] = useState('');
  const [bikeRegImgPath, setBikeRegImgPath] = useState('');
  const [bikeInsuranceImg, setBikeInsuranceImg] = useState('');
  const [bikeInsuranceImgPath, setBikeInsuranceImgPath] = useState('');
  const [bikePollImg, setBikePollImg] = useState('');
  const [bikePollImgPath, setBikePollImgPath] = useState('');
  const [isMounted, setIsMounted] = useState(true);
  const [genderType, setGenderType] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  // Request Gallery Permission and then open Gallery if granted
  const requestGalleryPermission = async selectForImage => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Pantryo Delivery Partner App Camera Permission',
          message: 'Pantryo Delivery Partner App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let SelectFor = selectForImage;
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          maxWidth: 900,
          maxHeight: 900,
          quality: 1,
          videoQuality: 'medium',
          durationLimit: 30,
          includeBase64: true,
        };
        await ImagePicker.launchCamera(options, res => {
          if (res) {
            if (res.errorCode == 'permission') {
              alert('Permission not granted');
              return;
            } else if (res.errorCode == 'others') {
              alert(res.errorMessage);
              return;
            } else if (res.didCancel) {
              // console.log('User cancelled image picker');
            } else {
              let temp = {
                name: res.fileName,
                uri: res.uri,
                type: res.type,
              };
              // console.log(temp);
              if (SelectFor == 'Profile') {
                setProfileImgPath(res.uri);
                setProfileImg(temp);
              }
              if (SelectFor == 'IdProof') {
                setIdImgPath(res.uri);
                setIdImg(temp);
              }
              if (SelectFor == 'DL') {
                setDrivingLicensePath(res.uri);
                setDrivingLicense(temp);
              }
              if (SelectFor == 'RegBikePlate') {
                setBikeRegImgPath(res.uri);
                setBikeRegImg(temp);
              }
              if (SelectFor == 'bikeInsure') {
                setBikeInsuranceImgPath(res.uri);
                setBikeInsuranceImg(temp);
              }
              if (SelectFor == 'PollutionImg') {
                setBikePollImgPath(res.uri);
                setBikePollImg(temp);
              }
            }
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Toast
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  // Registeration Function
  const registrationApi = async () => {
    if (!profileImg) {
      showToast('Profile Image is required');
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
    } else if (!bankAccountNumber) {
      showToast('Please Enter Your  Bank Account Number');
      return;
    } else if (!bankAccountType) {
      showToast('Please Choose Your  Bank Account Type');
      return;
    } else if (!bankIFSCCode) {
      showToast('Please Enter Your  Bank IFSC Code');
      return;
    } else if (!genderType) {
      showToast('Please Choose Your  Gender');
      return;
    } else if (!vehicleType) {
      showToast('Please Choose Your  Vechile Type');
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
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=DeliveryPartnerRegister',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body: JSON.stringify({
            contactNumber: contactNumber,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // console.log(result);
          if (result.error == 0) {
            navigation.navigate('OtpVerification', {
              profileImg: profileImg,
              fullname: name,
              contactNumber: contactNumber,
              address: address,
              pincode: pincode,
              bankAccountNumber: bankAccountNumber,
              bankAccountType: bankAccountType,
              bankIFSCCode: bankIFSCCode,
              deliveryPartnerGender: genderType,
              deliveryPartnerVechileType: vehicleType,
              bikeRegistrationNumber: bikeNumber,
              idProofImage: idImg,
              drivingLicenseImage: drivingLicense,
              bikeRegistrationPaperImage: bikeRegImg,
              bikeInsurancepaperImage: bikeInsuranceImg,
              pollutionPaperImage: bikePollImg,
              generatedOtp: result.resend_otp,
            });
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

  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
    return setIsMounted(false);
  }, []);

  return (
    <>
      <ScrollView style={styles.scroll}>
        {isLoading == true ? <LoaderScreen /> : null}
        <View style={styles.container}>
          <View style={styles.imgSection}>
            <Pressable
              style={styles.box}
              onPress={() => requestGalleryPermission('Profile')}>
              {profileImg !== '' ? (
                <Image
                  source={{uri: profileImgPath}}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 100,
                  }}
                />
              ) : (
                <Icons name="camera-outline" size={30} color="#fff" />
              )}
            </Pressable>
            <Text style={styles.heading}>Take Picture</Text>
            <Text style={styles.caption}>
              Customers will be able to see this image of your when you deliver
              their order
            </Text>
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#777"
              autoCapitalize="words"
              autoCompleteType="name"
              style={styles.input}
              onChangeText={text => setName(text)}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Mobile Number"
              maxLength={10}
              placeholderTextColor="#777"
              keyboardType="phone-pad"
              autoCompleteType="tel"
              style={styles.input}
              onChangeText={text => setContactNumber(text)}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Address"
              placeholderTextColor="#777"
              keyboardType="default"
              autoCapitalize="words"
              autoCompleteType="street-address"
              autoCorrect={true}
              style={styles.input}
              numberOfLines={5}
              multiline={true}
              onChangeText={text => setAddress(text)}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Pincode"
              placeholderTextColor="#777"
              keyboardType="number-pad"
              autoCompleteType="postal-code"
              style={styles.input}
              onChangeText={text => setPincode(text)}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Bank account number"
              placeholderTextColor="#777"
              keyboardType="number-pad"
              style={styles.input}
              onChangeText={text => setBankAccountNumber(text)}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Bank IFSC Code"
              placeholderTextColor="#777"
              keyboardType="default"
              autoCapitalize="characters"
              style={styles.input}
              onChangeText={text => setBankIFSCCode(text)}
            />
          </View>

          <View style={styles.bankTypeSection}>
            <Text style={styles.label}>Bank Account Type</Text>
            <View style={styles.bankTypeContainer}>
              <Picker
                selectedValue={bankAccountType}
                style={{height: 50, width: '100%'}}
                onValueChange={(itemValue, itemIndex) =>
                  setBankAccountType(itemValue)
                }>
                <Picker.Item
                  label="Choose Bank Account Type?"
                  value=""
                  color="#000"
                />
                <Picker.Item label="Current" value="Current" color="#000" />
                <Picker.Item label="Savings" value="Savings" color="#000" />
              </Picker>
            </View>
          </View>

          <View style={styles.bankTypeSection}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.bankTypeContainer}>
              <Picker
                selectedValue={genderType}
                style={{height: 50, width: '100%'}}
                onValueChange={(itemValue, itemIndex) =>
                  setGenderType(itemValue)
                }>
                <Picker.Item label="Choose Gender" value="" color="#000" />
                <Picker.Item label="Male" value="Male" color="#000" />
                <Picker.Item label="Female" value="Female" color="#000" />
                <Picker.Item label="Other" value="Other" color="#000" />
              </Picker>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomSection}>
            <Text style={styles.bottomHeading}>Verification</Text>
            <Text style={styles.bottomCaption}>
              Please upload ID, Address Proof & other documents for veirfication
            </Text>

            <View style={styles.bankTypeSection}>
              <Text style={styles.label}>Select Vehicle Type</Text>
              <View style={styles.bankTypeContainer}>
                <Picker
                  selectedValue={vehicleType}
                  style={{height: 50, width: '100%'}}
                  onValueChange={(itemValue, itemIndex) =>
                    setVehicleType(itemValue)
                  }>
                  <Picker.Item
                    label="Choose Vechile Type"
                    value=""
                    color="#000"
                  />
                  <Picker.Item
                    label="Motorcycle"
                    value="Motorcycle"
                    color="#000"
                  />
                  <Picker.Item label="Bicycle" value="Bicycle" color="#000" />
                  <Picker.Item
                    label="3 Wheeler"
                    value="3 Wheeler"
                    color="#000"
                  />
                  <Picker.Item
                    label="Mini truck"
                    value="Mini truck"
                    color="#000"
                  />
                </Picker>
              </View>
            </View>

            <View style={styles.section}>
              <TextInput
                placeholder="Bike Registration Number"
                placeholderTextColor="#777"
                keyboardType="default"
                autoCapitalize="characters"
                style={styles.input}
                onChangeText={text => setBikeNumber(text)}
              />
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.actionBox}
                  onPress={() => requestGalleryPermission('IdProof')}>
                  {idImgPath == '' ? (
                    <Icons name="image-outline" size={20} />
                  ) : (
                    <Image
                      source={{uri: idImgPath}}
                      style={{
                        height: 95,
                        width: 95,
                        borderRadius: 5,
                      }}
                    />
                    // <Icons name="checkbox-outline" size={30} color="green" />
                  )}
                </Pressable>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>Upload ID Proof Image</Text>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5,
                    }}>
                    (Aadhaar Card, Pan Card, Voter ID, Ration Card)
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.actionBox}
                  onPress={() => requestGalleryPermission('DL')}>
                  {drivingLicensePath == '' ? (
                    <Icons name="image-outline" size={20} />
                  ) : (
                    <Image
                      source={{uri: drivingLicensePath}}
                      style={{
                        height: 95,
                        width: 95,
                        borderRadius: 5,
                      }}
                    />
                    // <Icons name="checkbox-outline" size={30} color="green" />
                  )}
                </Pressable>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Driving License Image
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.actionBox}
                  onPress={() => requestGalleryPermission('RegBikePlate')}>
                  {bikeRegImgPath == '' ? (
                    <Icons name="image-outline" size={20} />
                  ) : (
                    <Image
                      source={{uri: bikeRegImgPath}}
                      style={{
                        height: 95,
                        width: 95,
                        borderRadius: 5,
                      }}
                    />
                    // <Icons name="checkbox-outline" size={30} color="green" />
                  )}
                </Pressable>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Bike's Registration Plate Image
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.actionBox}
                  onPress={() => requestGalleryPermission('bikeInsure')}>
                  {bikeInsuranceImgPath == '' ? (
                    <Icons name="image-outline" size={20} />
                  ) : (
                    <Image
                      source={{uri: bikeInsuranceImgPath}}
                      style={{
                        height: 95,
                        width: 95,
                        borderRadius: 5,
                      }}
                    />
                    // <Icons name="checkbox-outline" size={30} color="green" />
                  )}
                </Pressable>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Bike's Insurance papers
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.actionBox}
                  onPress={() => requestGalleryPermission('PollutionImg')}>
                  {bikePollImgPath == '' ? (
                    <Icons name="image-outline" size={20} />
                  ) : (
                    <Image
                      source={{uri: bikePollImgPath}}
                      style={{
                        height: 95,
                        width: 95,
                        borderRadius: 5,
                      }}
                    />
                    // <Icons name="checkbox-outline" size={30} color="green" />
                  )}
                </Pressable>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Pollution Papers Image
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => registrationApi()}
              // onPress={() => navigation.navigate('OtpVerification')}
              style={styles.loginBtn}>
              <Text style={styles.loginBtnTxt}>SUBMIT</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  box: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0e0',
    borderRadius: 100,
    marginBottom: 20,
  },
  heading: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  caption: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderColor: '#5E3360',
    paddingVertical: 5,
  },
  bankTypeSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  bankTypeContainer: {
    width: '100%',
    borderWidth: 1.5,
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 5,
    borderColor: '#5E3360',
    paddingHorizontal: 10,
  },
  input: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000',
  },
  divider: {
    width: '100%',
    borderWidth: 0.5,
    marginTop: 50,
    marginBottom: 30,
    borderColor: '#c7c7c7c7',
  },
  bottomSection: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  bottomHeading: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  bottomCaption: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  actionSection: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 40,
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  actionBox: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0e0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDiv: {
    flex: 1,
    marginLeft: 20,
  },
  actionTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  loginBtn: {
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#5E3360',
    borderRadius: 5,
  },
  loginBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
});
