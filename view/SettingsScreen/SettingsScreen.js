import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity,
} from 'react-native';

// Library
import {AuthContext} from '../../controller/Utils';
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionInfo from 'react-native-version-info';

// Screen
import Payments from './Component/WalletScreen';

const Settings = ({navigation}) => {
  const {signOut} = React.useContext(AuthContext);
  const [mounted, setmounted] = React.useState(true);
  const [userId, setUserId] = React.useState('');
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [bikeNo, setBikeNo] = React.useState('');
  const [profileImg, setProfileImg] = React.useState('');
  const [appV, setAppV] = React.useState('');
  const [status, setStatus] = React.useState('');

  // User Profile
  const userProfileData = async () => {
    setUserId(await AsyncStorage.getItem('user_id'));
    setName(await AsyncStorage.getItem('userName'));
    setMobile(await AsyncStorage.getItem('contactNumber'));
    setBikeNo(await AsyncStorage.getItem('bikeRegistrationNumber'));
    setProfileImg(await AsyncStorage.getItem('profileImage'));
    setStatus(await AsyncStorage.getItem('verificationStatus'));
  };

  const supportNumber = '+918808808888';

  const openWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${supportNumber}&text=${'Hi, I need help with: '}`,
    );
  };

  // Check Verification Status
  async function getDeliveryPartnerVerificationStatus() {
    let delivery_id = await AsyncStorage.getItem('user_id');
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/checkVerificationStatus.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_id: delivery_id,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          let verificationStatus = result.verificationStatus;
          AsyncStorage.setItem('verificationStatus', verificationStatus);
          userProfileData();
        }
        getDeliveryPartnerVerificationStatus();
        return Promise.resolve();
      })
      .catch(error => {
        console.error('getDeliveryPartnerVerificationStatus() : ' + error);
      });
  }

  React.useEffect(() => {
    userProfileData();
    setAppV(VersionInfo.appVersion);
    getDeliveryPartnerVerificationStatus();
    return function cleanup() {
      setmounted(false);
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.imgContainer}>
            {profileImg === '' ? (
              <Icons name="image-outline" size={25} color="#fff" />
            ) : (
              <Image source={{uri: profileImg}} style={styles.img} />
            )}
          </View>

          <View style={styles.div}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userContact}>{mobile}</Text>
            {status == '2' ? (
              <>
                <View style={styles.innerRow}>
                  <Icons name="checkmark-circle" size={25} color="#36c734" />
                  <Text style={styles.status}>Approved</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>
        {/* <Pressable
          onPress={() => navigation.navigate('Payments')}
          style={styles.btn}>
          <Icons name="wallet-outline" size={25} color="#5E3360" />
          <Text style={styles.btnTxt}>पेमेंट</Text>
        </Pressable> */}
        <Pressable
          onPress={() => {
            Linking.openURL('https://pantryo.in/tnc.php').catch(err => {
              console.error(err);
            });
          }}
          style={styles.btn}>
          <Icons name="information-circle-outline" size={25} color="#5E3360" />
          <Text style={styles.btnTxt}>नियम एवं शर्तें</Text>
        </Pressable>
        <TouchableOpacity onPress={openWhatsapp} style={styles.btn}>
          <Icons name="logo-whatsapp" size={25} color="#5E3360" />
          <Text style={styles.btnTxt}>सपोर्ट </Text>
        </TouchableOpacity>
        <Pressable style={styles.btn} onPress={signOut}>
          <Icons name="log-out-outline" size={25} color="#5E3360" />
          <Text style={styles.btnTxt}>लॉगआउट</Text>
        </Pressable>
        <View style={styles.copyRight}>
          <Text style={styles.copyRightLabel}>
            Designed & Developed by GizmmoAlchemy
          </Text>
          <Text style={styles.AppVersion}>App v ({appV})</Text>
        </View>
      </View>
    </>
  );
};

// export default Settings;

const Stack = createStackNavigator();

function SettingScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Payments"
        component={Payments}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderTopWidth: 0.5,
    borderTopColor: '#c7c7c7c7',
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 24,
    marginLeft: 20,
  },
  profileSection: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 40,
  },
  imgContainer: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  div: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
  },
  userContact: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    marginTop: 5,
  },
  innerRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  status: {
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: 5,
    fontSize: 16,
  },
  copyRight: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  copyRightLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginBottom: 5,
  },
  AppVersion: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
});
