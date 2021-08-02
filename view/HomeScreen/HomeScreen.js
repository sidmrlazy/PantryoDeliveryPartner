import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  PermissionsAndroid,
  ToastAndroid,
  Image,
} from 'react-native';

// Notifications
import {
  sendNotification,
  jobStarted,
  jobStopped,
} from '../../model/notification';

// Libraries
import {createStackNavigator} from '@react-navigation/stack';
// import {sendNotification, testNotification} from '../../model/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
navigator.geolocation = require('@react-native-community/geolocation');

// Screens
import FeatureTest from './Component/FeaturesTest';
import NewOrders from './Orders/NewOrders';

const HomeScreen = ({navigation}) => {
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [bikeNo, setBikeNo] = React.useState('');
  const [profileImg, setProfileImg] = React.useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const userProfileData = async () => {
    setName(await AsyncStorage.getItem('userName'));
    setMobile(await AsyncStorage.getItem('contactNumber'));
    setBikeNo(await AsyncStorage.getItem('bikeRegistrationNumber'));
    setProfileImg(await AsyncStorage.getItem('profileImage'));
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs access to your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          showToast('Permission Denied');
          requestLocationPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // ======= Show Toast ========== //
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  // ====== Get Longitude and Latitude========== //
  const getOneTimeLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        let fromLoc = position.coords;
        let coordinate = {
          latitude: fromLoc.latitude,
          longitude: fromLoc.longitude,
        };
        // console.log(cordinate);
        setCurrentLocation(coordinate);
      },
      error => {
        if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
          showToast('Please on your Location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000,
      },
    );
  };

  useEffect(() => {
    requestLocationPermission();
    userProfileData();
    // console.log('Image' + ' ' + profile);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* ====== Header Start ====== */}
        <View style={styles.topHeader}>
          <View style={styles.profileBox}>
            {profileImg === '' ? (
              <Icons name="image-outline" size={25} color="#fff" />
            ) : (
              <Image
                source={{uri: profileImg}}
                style={styles.profImg}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.mobile}>{mobile}</Text>
            <Text style={styles.bike}>{bikeNo}</Text>
          </View>
        </View>
        {/* ====== Header End ====== */}

        {/* ====== Switch Section Start ====== */}
        <View style={styles.switchContainer}>
          <View style={styles.switchTab}>
            {isEnabled ? (
              <>
                <Text style={styles.switchTxt}>End Day</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#a5a2a8'}}
                  thumbColor={isEnabled ? '#4d8751' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </>
            ) : (
              <>
                <Text style={styles.switchTxt}>Start Delivering</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#a5a2a8'}}
                  thumbColor={isEnabled ? '#4d8751' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </>
            )}
          </View>
        </View>
        {/* ====== Switch Section End ====== */}

        {/* ====== Tab Row Start ====== */}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewOrders')}
            style={styles.tab}>
            <View style={styles.lottieContainer}>
              <LottieView
                source={require('../../assets/lottie/newOrders.json')}
                autoPlay
                loop
                size={styles.lottie}
              />
            </View>
            <View style={styles.div}>
              <Text style={styles.label}>New Orders</Text>
              <Text style={styles.new}>10</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={sendNotification} style={styles.tab}>
            <View style={styles.lottieContainer}>
              <LottieView
                source={require('../../assets/lottie/completed.json')}
                autoPlay
                loop
                size={styles.lottie}
              />
            </View>
            <View style={styles.div}>
              <Text style={styles.label}>Orders Completed</Text>
              <Text style={styles.new}>60</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* ====== Tab Row End ====== */}

        {/* ====== Tab Row Start ====== */}
        {currentLocation && (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FeatureTest', {
                  currentLocation: currentLocation,
                })
              }
              style={styles.tab}>
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../../assets/lottie/newOrders.json')}
                  autoPlay
                  loop
                  size={styles.lottie}
                />
              </View>
              <View style={styles.div}>
                <Text style={styles.label}>FeatureTest</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/* ====== Tab Row End ====== */}
      </View>
    </>
  );
};

const Stack = createStackNavigator();

function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewOrders"
        component={NewOrders}
        options={{
          title: 'New Orders',
          headerTitleStyle: {
            fontFamily: 'OpenSans-SemiBold',
          },
        }}
      />
      <Stack.Screen name="FeatureTest" component={FeatureTest} />
    </Stack.Navigator>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#5E3360',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  profileBox: {
    marginRight: 10,
    backgroundColor: '#777',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#fff',
  },
  mobile: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#fff',
  },
  bike: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    borderRadius: 5,
    flexDirection: 'row',
  },
  lottieContainer: {
    width: 100,
    height: 100,
  },
  lottie: {
    width: 50,
    height: 50,
  },
  div: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  new: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
  },
  profileImg: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  switchContainer: {
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#fff',
  },
  switchTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 5,
  },
  switchTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    flex: 1,
  },
  profImg: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  }
});
