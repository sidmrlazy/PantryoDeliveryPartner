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
  Modal,
  FlatList,
  RefreshControl,
  ScrollView,
  LogBox,
  Platform,
} from 'react-native';

// Libraries
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
navigator.geolocation = require('@react-native-community/geolocation');
import StarRating from 'react-native-star-rating';
import messaging from '@react-native-firebase/messaging';

//my S Screens
import FeatureTest from './Component/FeaturesTest';
import NewOrders from './Orders/NewOrders';
import {setEnabled} from 'react-native/Libraries/Performance/Systrace';
import OrderHistory from './Orders/OrderHistory';

// Timer for Refreshing
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeScreen = ({navigation}) => {
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [bikeNo, setBikeNo] = React.useState('');
  const [profileImg, setProfileImg] = React.useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState(null);

  const [userId, setUserId] = React.useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newOrder, setNewOrder] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [lat, setLat] = React.useState('');
  const [long, setLong] = React.useState('');

  // Order Variables
  const [customerToken, setCustomerToken] = React.useState('');
  const [partnerToken, setPartnerToken] = React.useState('');
  const [orderId, setOrderId] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [verificationStatus, setVerificationStatus] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [customerMobile, setCustomerMobile] = React.useState('');
  const [partnerPinCode, setPartnerPincode] = React.useState('');
  const [shopName, setShopName] = React.useState('');
  const [productQty, setProductQty] = React.useState('');
  const [productUnit, setProductUnit] = React.useState('');
  const [itemQty, setItemQty] = React.useState('');
  const [productName, setProductName] = React.useState('');

  const [FCMToken, setFCMToken] = React.useState('');

  // Order Count Variables
  const [orderCountFtd, setOrderCountFtd] = React.useState('');
  const [totalOrdersLtd, setTotalOrdersLtd] = React.useState('');
  const [earnings, setEarnings] = React.useState('');

  // Rating
  const [rating, setRating] = React.useState(3.5);

  // API URL variables
  const ChangeOrderStatus =
    'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=deliveryPartnerStatus';
  const ReceiveOrders =
    'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=deliveryPartnerStatus';

  // OnRefresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // getOrderData();
    getDeviceToken();
    getDeliveryPartnerVerificationStatus();
    // updateDeliveryPartnerLocation();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // User Profile
  async function userProfileData() {
    setUserId(await AsyncStorage.getItem('user_id'));
    setName(await AsyncStorage.getItem('userName'));

    setVerificationStatus(await AsyncStorage.getItem('verificationStatus'));
    setMobile(await AsyncStorage.getItem('contactNumber'));
    setBikeNo(await AsyncStorage.getItem('bikeRegistrationNumber'));
    setProfileImg(await AsyncStorage.getItem('profileImage'));
    userProfileData();
  }

  // ======= Show Toast ========== //
  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  const CustomerServerKey =
    'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
  const PartnerServerKey =
    'AAAALC3Ugt8:APA91bFdhqYhHLlDedpHpuCBX7puDR5x1qsrmc6k3gh-pXIBaUoxTJ3t91pVuBwV51GdrSnYLb9McgZYbGnkVR6-A8BnqsUL8nQKN8Bg3qwwH9puZ01uCt4tnGU7w0qNXL0S-x8Ofnaf';

  async function requestLocationPermission() {
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
        }
        return Promise.resolve();
      } catch (err) {
        console.warn('requestLocationPermission: ' + err);
      }
    }
  }

  // Get Longitude and Latitude
  async function getOneTimeLocation() {
    setLoading(true);
    await navigator.geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        updateDeliveryPartnerLocation(currentLatitude, currentLongitude);
        setLat(currentLatitude);
        setLong(currentLongitude);
        setLoading(false);
        // console.log(
        //   'getOneTimeLocation: ' + currentLatitude + ', ' + currentLongitude,
        // );
      },
      error => {
        if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
          showToast('Please grant permission to access your location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000,
      },
    );
  }

  // Update Delivery Partner Location
  async function updateDeliveryPartnerLocation(lat, long) {
    let userId = await AsyncStorage.getItem('user_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartnerLocationUpdate.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/JSON',
          'Content-Type': 'application/JSON',
        },
        body: JSON.stringify({
          delivery_id: userId,
          delivery_partner_latitude: lat,
          delivery_partner_longitude: long,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        // console.log('Delivery Partner Location: ' + JSON.stringify(result));
        getOneTimeLocation();
      })
      .catch(error => {
        console.error('updateDeliveryPartnerLocation: ' + error);
      });
    // .finally(() => {
    //   getOneTimeLocation();
    // });
  }

  // FCM Token
  const getDeviceToken = async () => {
    messaging()
      .getToken()
      .then(token => {
        getDeviceToken();
        return setFCMToken(token);
      });
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

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);

    requestLocationPermission();
    getDeliveryPartnerVerificationStatus();
    getDeviceToken();
    userProfileData();

    // console.log('User Token: ' + FCMToken);
    // getOrderData();
    // getStatus();
    // orderCountToday();
    // totalOrders();
    // totalEarningFtd();
    // console.log('LAT: ' + lat);
    // console.log('LONG: ' + long);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* ====== Header Start ====== */}
        {/* <View style={styles.topHeader}>
          <View style={styles.profileBox}>
            {profileImg === '' ? (
              <Icons name="image-outline" size={25} color="#fff" />
            ) : (
              <Image source={{uri: profileImg}} style={styles.profImg} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.mobile}>{mobile}</Text>           
            <Text style={styles.bike}>
              <StarRating
                disabled={true}
                halfStarEnabled={true}
                maxStars={5}
                rating={rating}
                fullStarColor={'#fff'}
                starSize={17}
              />
            </Text>
          </View>
        </View> */}
        {/* ====== Header End ====== */}

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            width: '100%',
            backgroundColor: '#fff',
            paddingVertical: 20,
          }}>
          {/* ====== Switch Section Start ====== */}
          {/* <View style={styles.switchContainer}>
            <View style={styles.switchTab}>
              {isEnabled ? (
                <>
                  <Text style={styles.switchTxt}>आप ऑनलाइन हैं</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#a5a2a8'}}
                    thumbColor={isEnabled ? '#4d8751' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      updateWorkingStatus('2');
                      // toggleSwitch();
                    }}
                    value={isEnabled}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.switchTxt}>आप ऑफलाइन हैं</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#a5a2a8'}}
                    thumbColor={isEnabled ? '#4d8751' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      updateWorkingStatus('1');
                      // toggleSwitch();
                    }}
                    value={isEnabled}
                  />
                </>
              )}
            </View>
          </View> */}
          {/* ====== Switch Section End ====== */}

          {/* {isEnabled !== true ? (
            <>
              <View style={styles.notificationBtn}>
                <View
                  style={[
                    styles.notificationTab,
                    {backgroundColor: '#a83232'},
                  ]}>
                  <Text style={styles.notifHeading}>आप ऑफलाइन हैं!</Text>
                  <Text style={styles.notifTxt}>
                    ऑफलाइन होने के कारण कस्टमर आर्डर प्राप्त नहीं हो पाएंगे
                  </Text>
                </View>
              </View>
            </>
          ) : null} */}

          <View
            style={{
              width: '100%',
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: '#c7c7c7c7',
                borderRadius: 5,
                paddingHorizontal: 10,
                backgroundColor: '#1c457a',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  width: 130,
                  height: 130,
                }}>
                <LottieView
                  source={require('../../assets/lottie/refer.json')}
                  autoPlay
                  loop
                  size={{
                    width: 130,
                    height: 130,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: 28,
                    color: '#ffc400',
                  }}>
                  ऑन-बोर्डिंग ऑफर{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    fontSize: 20,
                    color: '#fff',
                    marginTop: 10,
                  }}>
                  लॉन्च की तारीख से पहले{' '}
                  <Text
                    style={{
                      fontFamily: 'FredokaOne-Regular',
                    }}>
                    PantrYO
                  </Text>{' '}
                  के साथ 5 राइडर्स कनेक्ट करें और ऑर्डर डिलीवर करने के पहले दिन
                  ₹10/Km प्राप्त करें।
                </Text>

                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    fontSize: 20,
                    color: '#fff',
                    marginTop: 10,
                  }}>
                  कृपया ध्यान दें: ऑफ़र केवल डिलीवरी के पहले दिन ही मान्य!
                </Text>
              </View>
            </View>
          </View>

          {isEnabled !== true ? (
            <>
              <View style={styles.notificationBtn}>
                <View
                  style={[
                    styles.notificationTab,
                    {backgroundColor: '#c7c7c7c7'},
                  ]}>
                  <Text
                    style={[
                      styles.notifHeading,
                      {
                        color: '#000',
                        fontSize: 18,
                        fontFamily: 'OpenSans-SemiBold',
                      },
                    ]}>
                    डिलीवरी ऑर्डर्स 1st Nov 2021 से शुरू किये जायेंगे
                  </Text>

                  {/* <Text
                    style={{
                      fontFamily: 'OpenSans-ExtraBold',
                      fontSize: 20,
                      marginTop: 20,
                      color: '#3252a8',
                    }}>
                    ऑन-बोर्डिंग ऑफर{' '}
                  </Text>
                  <Text
                    style={[
                      styles.notifTxt,
                      {color: '#3252a8', marginTop: 10},
                    ]}>
                    लॉन्च की तारीख से पहले{' '}
                    <Text
                      style={{
                        fontFamily: 'FredokaOne-Regular',
                      }}>
                      PantrYO
                    </Text>{' '}
                    के साथ 5 और राइडर्स कनेक्ट करें और ऑर्डर देने के अपने पहले
                    दिन 10 रुपये/किलोमीटर प्राप्त करें। कृपया ध्यान दें: ऑफ़र
                    केवल आपके डिलीवरी के पहले दिन पर ही मान्य है
                  </Text> */}
                </View>
              </View>
            </>
          ) : null}

          {/* ========== Verification Notification Start ========== */}
          {verificationStatus !== '1' ? (
            <TouchableOpacity style={styles.notificationBtn}>
              <View style={styles.notificationTab}>
                <Text style={styles.notifHeading}>प्रोफाइल वेरिफिकेशन</Text>
                {/* <Text style={styles.notifTxt}>
                  Please wait while we look at your documents. You may receive a
                  call from our side to confirm the details provided by you.
                </Text> */}
                <Text style={styles.notifTxt}>
                  कृपया प्रतीक्षा करें जब तक हम आपके द्वारा दिए गये डाक्यूमेंट्स
                  को वेरीफाई कर रहे है दस्तावेज़ देखें। आपके द्वारा प्रदान किए
                  गए विवरण की पुष्टि करने के लिए आपको हमारी ओर से एक कॉल प्राप्त
                  हो सकती है।
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {/* ========== Verification Notification End ========== */}

          {/* ====== Tab Row Start ====== */}
          {/* <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NewOrders')}
              style={styles.tab}>              
              <View style={styles.div}>
                <Text style={styles.label}>आज के आर्डर </Text>
                <Text style={styles.new}>
                  {orderCountFtd ? orderCountFtd : '0'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('OrderHistory')}
              style={styles.tab}>              
              <View style={styles.div}>
                <Text style={styles.label}>कम्प्लीटेड ऑर्डर्स</Text>
                <Text style={styles.new}>
                  {totalOrdersLtd ? totalOrdersLtd : '0'}
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* <View style={styles.row}>
            <TouchableOpacity style={styles.tab}>
              <View style={[styles.lottieContainer, {marginLeft: 10}]}>
                <LottieView
                  source={require('../../assets/lottie/wallet.json')}
                  autoPlay
                  loop
                  size={styles.lottie}
                />
              </View>
              <View style={[styles.div, {marginLeft: 15}]}>
                <Text style={styles.label}>आपने कमाए</Text>
                <Text style={styles.new}>
                  ₹{earnings ? earnings : '0'}{' '}
                  <Text
                    style={{
                      fontFamily: 'OpenSans-SemiBold',
                      fontSize: 16,
                    }}>
                    आज
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
        {/* ====== Tab Row End ====== */}

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../../assets/lottie/newOrders.json')}
              autoPlay
              loop
              size={styles.lottie}
            />
          </View>
        ) : newOrder !== '' ? (
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.modalBack}>
                <View style={styles.modalCard}>
                  <FlatList
                    data={newOrder}
                    style={{width: '100%'}}
                    keyExtractor={item => item.confirm_order_id}
                    renderItem={({item}) => (
                      <>
                        {/* ======== Setting Values ======== */}
                        {setCustomerToken(item.CustomerUserToken)}
                        {setPartnerToken(item.partnerUserToken)}
                        {setOrderId(item.order_id)}
                        {setCustomerName(item.customer_name)}
                        {setCustomerMobile(item.customerMobileNumber)}
                        {setItemQty(item.numberOfProduct)}
                        {setPartnerPincode(item.PartnerPickupAddress)}
                        {setShopName(item.setShopName)}
                        {setProductName(item.productName)}
                        {setProductQty(item.productQty)}
                        {setProductUnit(item.productUnit)}
                        {/* ======== Setting Values ======== */}
                        <View style={styles.flatListContainer}>
                          <View style={styles.lottieContainerNew}>
                            <LottieView
                              source={require('../../assets/lottie/Hurray.json')}
                              autoPlay
                              loop
                              size={styles.lottie}
                            />
                          </View>
                          <View style={styles.flatListRow}>
                            {/* <Text style={styles.newOrder}>
                              New Order Received!
                            </Text> */}
                            <Text style={styles.newOrder}>नया आर्डर!</Text>
                            <Text style={styles.orderIdLabel}>
                              Order ID:{' '}
                              <Text style={styles.orderId}>
                                {item.order_id}
                              </Text>
                            </Text>

                            <Text style={styles.description}>
                              Pick up {item.numberOfProduct} Item from{' '}
                              {item.shopName}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('NewOrders')}
                          style={styles.flatListAccept}>
                          <Text style={styles.flatListAcceptBtnTxt}>
                            डिटेल्स प्राप्त करें
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.rejectBtn}>
                          <Text style={styles.rejectBtnTxt}>रिजेक्ट</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </>
        ) : null}
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
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          title: 'Orders Completed',
          headerTitleStyle: {
            fontFamily: 'OpenSans-SemiBold',
          },
        }}
      />
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
    width: 120,
    height: 120,
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
    marginTop: 10,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  lottieContainer: {
    width: 70,
    height: 70,
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
    marginTop: 10,
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
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    flex: 1,
  },
  profImg: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 120,
  },
  modalBack: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
  },
  lottieContainerNew: {
    width: 100,
    height: 100,
  },
  flatListRow: {
    flex: 1,
  },
  newOrder: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    marginBottom: 10,
    color: '#5E3360',
  },
  orderIdLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
  orderId: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  description: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  flatListAccept: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'green',
    paddingVertical: 20,
    borderRadius: 5,
  },
  flatListAcceptBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#fff',
  },

  rejectBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'red',
    paddingVertical: 20,
    borderRadius: 5,
  },
  rejectBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#fff',
  },

  notificationBtn: {
    paddingHorizontal: 15,
    width: '100%',
    marginBottom: 5,
    marginTop: 10,
  },
  notificationTab: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#ed7b7b',
    paddingVertical: 20,
    borderRadius: 5,
  },
  notifHeading: {
    color: '#fff',
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 24,
  },
  notifTxt: {
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
});

// Notification to Partner
// async function sendNotificationToPartner() {
//   const userToken = partnerToken;
//   const DELIVERY_PARTNER_FIREBASE_API_KEY = PartnerServerKey;
//   const message = {
//     to: userToken,
//     notification: {
//       title: 'Order Confirmation',
//       body: name + ' has accepted your order and is on his way.',
//       vibrate: 1,
//       sound: 1,
//       show_in_foreground: true,
//       priority: 'high',
//       content_available: true,
//     },
//     data: {
//       title: 'Order Confirmation',
//       body: name + ' has accepted your order and is on his way.',
//     },
//   };

//   let headers = new Headers({
//     'Content-Type': 'application/json',
//     Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
//   });
//   let response = await fetch('https://fcm.googleapis.com/fcm/send', {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(message),
//   });
//   response = await response.json();
//   console.log(response);
// }

// Notification to Customer
// async function sendNotificationToCustomer() {
//   const userToken = customerToken;
//   const DELIVERY_PARTNER_FIREBASE_API_KEY = CustomerServerKey;
//   const message = {
//     to: userToken,
//     notification: {
//       title: 'Pantryo Delivery Partner Assigned',
//       body:
//         name +
//         ' has been assigned to pick up your order. Please wait while your order is being picked up',
//       vibrate: 1,
//       sound: 1,
//       show_in_foreground: true,
//       priority: 'high',
//       content_available: true,
//     },
//     data: {
//       title: 'Pantryo Delivery Partner Assigned',
//       body:
//         name +
//         ' has been assigned to pick up your order. Please wait while your order is being picked up',
//     },
//   };

//   let headers = new Headers({
//     'Content-Type': 'application/json',
//     Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
//   });
//   let response = await fetch('https://fcm.googleapis.com/fcm/send', {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(message),
//   });
//   response = await response.json();
//   console.log(response);
// }

// Get Order Data
// async function getOrderData() {
//   let userId = await AsyncStorage.getItem('user_id');
//   await fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=showOrderDeliveryPartner',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/JSON',
//         'Content-Type': 'application/JSON',
//       },
//       body: JSON.stringify({
//         delivery_id: userId,
//         // userToken: FCMToken,
//       }),
//     },
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       if (result.error == 0) {
//         setNewOrder(result.allorder);
//       }
//     })
//     .catch(error => {
//       console.error(error);
//     })
//     .finally(() => {
//       setLoading(false);
//       getOrderData();
//       return Promise.resolve();
//     });
// }

// Order Count Today
// async function orderCountToday() {
//   let userId = await AsyncStorage.getItem('user_id');
//   fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartnerCount.php?flag=todayOrdercount',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/JSON',
//         'Content-Type': 'application/JSON',
//       },
//       body: JSON.stringify({
//         delivery_id: userId,
//       }),
//     },
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       if (result.error == 0) {
//         setOrderCountFtd(result.todayOrder);
//       }
//       return Promise.resolve();
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// Total Orders Life To Date
// async function totalOrders() {
//   let userId = await AsyncStorage.getItem('user_id');
//   fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartnerCount.php?flag=allOrdercount',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/JSON',
//         'Content-Type': 'application/JSON',
//       },
//       body: JSON.stringify({
//         delivery_id: userId,
//       }),
//     },
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       if (result.error == 0) {
//         setTotalOrdersLtd(result.todayOrder);
//       }
//       return Promise.resolve();
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// Total Earnings for the day
// async function totalEarningFtd() {
//   let userId = await AsyncStorage.getItem('user_id');
//   fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartnerCount.php?flag=todayearning',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/JSON',
//         'Content-Type': 'application/JSON',
//       },
//       body: JSON.stringify({
//         delivery_id: userId,
//       }),
//     },
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       if (result.error == 0) {
//         setEarnings(result.todayearn);
//       }
//       return Promise.resolve();
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// Partner Rating
// async function getRatingPoint() {
//   let delivery_id = await AsyncStorage.getItem('user_id');
//   await fetch('https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       delivery_id: delivery_id,
//     }),
//   })
//     .then(response => {
//       return response.json();
//     })
//     .then(result => {
//       if (result.error == 0) {
//         setRating(result.rating);
//       }
//       return Promise.resolve();
//       // getStatus();
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// Update Working Status
// async function updateWorkingStatus(workstatus) {
//   setLoading(true);
//   let userId = await AsyncStorage.getItem('user_id');
//   fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/UpdateDeliveryPartnerWorkingStatus.php',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/JSON',
//         'Content-Type': 'application/JSON',
//       },
//       body: JSON.stringify({
//         delivery_id: userId,
//         userStatus: workstatus,
//       }),
//     },
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       if (result.error == 0) {
//         let userStatus = result.userStatus;
//         if (userStatus == '1') {
//           setIsEnabled(true);
//         } else {
//           setIsEnabled(false);
//         }
//         setStatus(userStatus);
//         AsyncStorage.setItem('userStatus', userStatus);
//       }
//       return Promise.resolve();
//     })
//     .catch(error => {
//       console.log(error);
//     })
//     .finally(() => {
//       setLoading(false);
//     });
// }

// Partner Online/Offline Status
// async function getStatus() {
//   let delivery_id = await AsyncStorage.getItem('user_id');
//   await fetch(
//     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/checkpartnerStatus.php',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         delivery_id: delivery_id,
//       }),
//     },
//   )
//     .then(response => {
//       return response.json();
//     })
//     .then(result => {
//       if (result.error == 0) {
//         let userStatus = result.userStatus;
//         if (userStatus == '1') {
//           setIsEnabled(true);
//         } else {
//           setIsEnabled(false);
//         }

//         setStatus(userStatus);
//         AsyncStorage.setItem('userStatus', userStatus);
//         return Promise.resolve();
//       }
//       return Promise.resolve();
//       // getStatus();
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }
