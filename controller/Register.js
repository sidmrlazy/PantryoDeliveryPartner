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
} from 'react-native';

// Library
import Icons from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Register = () => {
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

  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
  }, []);

  return (
    <>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <View style={styles.imgSection}>
            <Pressable style={styles.box}>
              <Icons name="camera-outline" size={30} color="#fff" />
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
              autoCapitalize="words"
              autoCompleteType="name"
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              autoCompleteType="tel"
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Address"
              keyboardType="default"
              autoCapitalize="words"
              autoCompleteType="street-address"
              autoCorrect={true}
              style={styles.input}
              numberOfLines={5}
              multiline={true}
            />
          </View>

          <View style={styles.section}>
            <TextInput
              placeholder="Pincode"
              keyboardType="number-pad"
              autoCompleteType="postal-code"
              style={styles.input}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomSection}>
            <Text style={styles.bottomHeading}>Verification</Text>
            <Text style={styles.bottomCaption}>
              Please upload ID, Address Proof & other documents for veirfication
            </Text>

            <View style={styles.section}>
              <TextInput
                placeholder="Bike Registration Number"
                keyboardType="default"
                autoCapitalize="characters"
                style={styles.input}
              />
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <View style={styles.actionBox}>
                  <Icons name="image-outline" size={20} />
                </View>
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
                <View style={styles.actionBox}>
                  <Icons name="image-outline" size={20} />
                </View>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Driving License Image
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <View style={styles.actionBox}>
                  <Icons name="image-outline" size={20} />
                </View>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Bike's Registration Plate Image
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <View style={styles.actionBox}>
                  <Icons name="image-outline" size={20} />
                </View>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Bike's Insurance papers
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <View style={styles.actionRow}>
                <View style={styles.actionBox}>
                  <Icons name="image-outline" size={20} />
                </View>
                <View style={styles.actionDiv}>
                  <Text style={styles.actionTxt}>
                    Upload Pollution Papers Image
                  </Text>
                </View>
              </View>
            </View>

            <Pressable style={styles.loginBtn}>
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
    backgroundColor: '#c7c7c7c7',
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
  input: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
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
    backgroundColor: '#c7c7c7c7',
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
