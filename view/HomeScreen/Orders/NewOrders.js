import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Linking,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import LottieView from 'lottie-react-native';
import Loader from '../../../controller/LoaderScreen';

// Timer for Refreshing
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const NewOrders = ({route, navigation}) => {
  const [userId, setUserId] = React.useState('');
  const [Data, setData] = React.useState('');
  const [isLoading, setLoading] = React.useState(true);
  const [mounted, setmounted] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [toggleCheckBoxOne, setToggleCheckBoxOne] = React.useState(false);
  const [toggleCheckBoxTwo, setToggleCheckBoxTwo] = React.useState(false);
  const [toggleCheckBoxThree, setToggleCheckBoxThree] = React.useState(false);
  const [toggleCheckBoxFour, setToggleCheckBoxFour] = React.useState(false);

  const customer_firebase_key =
    'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
  const delivery_partner_firebase_key =
    'AAAALC3Ugt8:APA91bFdhqYhHLlDedpHpuCBX7puDR5x1qsrmc6k3gh-pXIBaUoxTJ3t91pVuBwV51GdrSnYLb9McgZYbGnkVR6-A8BnqsUL8nQKN8Bg3qwwH9puZ01uCt4tnGU7w0qNXL0S-x8Ofnaf';

  // User Profile
  const userProfileData = async () => {
    setUserId(await AsyncStorage.getItem('user_id'));
  };

  const getOrderData = async () => {
    let userId = await AsyncStorage.getItem('user_id');
    setmounted(true);
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=showOrderDeliveryPartner',
      {
        method: 'POST',
        headers: {
          Accept: 'application/JSON',
          'Content-Type': 'application/JSON',
        },
        body: JSON.stringify({
          delivery_id: userId,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        // console.log(result);
        if (mounted) {
          if (result.error == 0) {
            setData(result.allorder);
          }
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        getOrderData();
      });
  };

  // Accept Order or Cancel
  const AcceptCancel = async (
    activitytype,
    orderId,
    customerToken,
    partnerToken,
  ) => {
    let userId = await AsyncStorage.getItem('user_id');
    setLoading(true);
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=deliveryPartnerStatus',
      {
        method: 'POST',
        headers: {
          Accept: 'application/JSON',
          'Content-Type': 'application/JSON',
        },
        body: JSON.stringify({
          delivery_id: userId,
          order_id: orderId,
          delivery_status: activitytype,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          if (activitytype == '1') {
            notificationToCustomerDeliveryAcceptOrder(customerToken);
            notificationToPartnerDeliveryAcceptOrder(partnerToken, orderId);
          }
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => getOrderData());
  };

  // notificationToCustomerDeliveryAcceptOrder
  const notificationToCustomerDeliveryAcceptOrder = async customerToken => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    const CUSTOMER_FIREBASE_API_KEY = customer_firebase_key;
    const message = {
      to: customerToken,
      notification: {
        title: 'Delivery Partner Found',
        body: deliveryPartner + ' ' + 'has been assigned to deliver your order',
        vibrate: 1,
        sound: 'default',
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Delivery Partner Found',
        body:
          deliveryPartner + ' ' + ' has been assigned to deliver your order',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  //////notificationToPartnerDeliveryAcceptOrder
  const notificationToPartnerDeliveryAcceptOrder = async (
    partnerToken,
    orderId,
  ) => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    const FIREBASE_API_KEY = delivery_partner_firebase_key;
    const message = {
      to: partnerToken,
      notification: {
        title: 'Delivery Partner En-Route',
        body:
          deliveryPartner +
          ' ' +
          'is on his way to pickup ORDER ID: ' +
          ' ' +
          orderId,
        vibrate: 1,
        sound: 'default',
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Delivery Partner En-Route',
        body:
          deliveryPartner +
          ' ' +
          'is on his way to pickup ORDER ID: ' +
          ' ' +
          orderId,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  //////////////////////notificationToPartnerDeliveryBoyAtLocation
  const notificationToPartnerDeliveryBoyAtLocation = async (
    partnerToken,
    customername,
  ) => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    const FIREBASE_API_KEY = delivery_partner_firebase_key;
    const message = {
      to: partnerToken,
      notification: {
        title: deliveryPartner + ' ' + 'is at your location',
        body:
          'Please enter the 6-digit OTP provided by ' +
          ' ' +
          deliveryPartner +
          ' ' +
          'to close Order No: ' +
          ' ' +
          orderId,
        vibrate: 1,
        sound: 'default',
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: deliveryPartner + ' ' + 'is at your location',
        body:
          'Please enter the 6-digit OTP provided by ' +
          ' ' +
          deliveryPartner +
          ' ' +
          'to close Order No: ' +
          ' ' +
          orderId,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  /////////////////notificationToCustomerDeliveryOnWay
  const notificationToCustomerDeliveryOnWay = async customerToken => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    // console.log('Call');
    const CUSTOMER_FIREBASE_API_KEY = customer_firebase_key;
    const message = {
      to: customerToken,
      notification: {
        title: deliveryPartner + ' ' + 'En-Route',
        body: 'Your order is en-route and will be reaching to you shortly',
        vibrate: 1,
        sound: 'default',
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: deliveryPartner + ' ' + 'En-Route',
        body: 'Your order is en-route and will be reaching to you shortly',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  ///////////////////notificationToCustomerDeliveryAtLocation
  const notificationToCustomerDeliveryAtLocation = async customerToken => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    const CUSTOMER_FIREBASE_API_KEY = customer_firebase_key;
    const message = {
      to: customerToken,
      notification: {
        title: deliveryPartner + ' ' + 'has reached',
        body: 'Your order has arrived.',
        vibrate: 1,
        sound: 'default',
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: deliveryPartner + ' ' + 'has reached',
        body: 'Your order has arrived.',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  // notificationToCustomerWhenOrderPickedUp
  const notificationToCustomerWhenOrderPickedUp = async customerToken => {
    const CUSTOMER_FIREBASE_API_KEY = customer_firebase_key;
    const message = {
      to: customerToken,
      notification: {
        title: 'Thank you',
        body: 'Thank you for shopping with us.',
        vibrate: 1,
        sound: 'default',
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Thank you',
        body: 'Thank you for shopping with us.',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  // status update
  const updtateStatus = async (
    status,
    customername,
    orderId,
    partnerToken,
    customerToken,
  ) => {
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=deliveryStatusAndOtp',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          order_id: orderId,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log('Status: ' + status);
        console.log(result);
        if (result.error == 0) {
          notificationToPartnerDeliveryBoyAtLocation(
            partnerToken,
            customername,
          );
        } else if (result.error == 11) {
          notificationToCustomerDeliveryOnWay(customerToken);
        } else if (result.error == 22) {
          notificationToCustomerDeliveryAtLocation(customerToken);
        } else if (result.error == 33) {
          notificationToCustomerWhenOrderPickedUp(customerToken);
        }
        getOrderData();
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Open Direction on Google Map to Customer and Partners Location
  const openMapDirection = async (latitude, longitude) => {
    const url = Platform.select({
      ios: `comgooglemaps://?center=${latitude},${longitude}&q=${latitude},${longitude}&zoom=14&views=traffic"`,
      android: `geo://?q=${latitude},${longitude}`,
    });
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browser_url = `https://www.google.de/maps/@${latitude},${longitude}`;

          return Linking.openURL(browser_url);
        }
      })
      .catch(() => {
        if (Platform.OS === 'ios') {
          Linking.openURL(`maps://?q=${latitude},${longitude}`);
        }
      });
  };

  // OnRefresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrderData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getOrderData();
    userProfileData();
    return function cleanup() {
      setmounted(false);
    };
  }, []);

  return (
    <>
      {isLoading === true ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          {Data !== '' ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              style={{width: '100%'}}
              data={Data}
              keyExtractor={item => item.confirm_order_id}
              renderItem={({item}) => (
                <>
                  <View style={styles.container}>
                    <View style={styles.card}>
                      {/* <Text style={styles.cardHeading}>
                        New Order Received!
                      </Text> */}

                      <View style={styles.orderDetailRow}>
                        <View style={styles.div}>
                          <Text style={styles.divLabel}>आर्डर ID</Text>
                          <Text style={styles.orderResponse}>
                            {item.order_id}
                          </Text>
                        </View>
                        <View style={styles.div}>
                          <Text style={styles.divLabel}>पिक अप पॉइंट </Text>
                          <Text style={styles.orderResponse}>
                            {item.shopName}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.itemDetailsSection}>
                        <Text style={styles.caption}>
                          प्रोडक्ट्स पिक अप करने के लिए :{' '}
                          <Text style={styles.innerCaption}>
                            {item.numberOfProduct}
                          </Text>
                        </Text>
                        <Text style={styles.caption}>
                          आपकी कमाई :{' '}
                          <Text style={styles.innerCaption}>
                            {item.deliveryBoyEarn} ₹
                          </Text>
                        </Text>
                        {/* <View style={styles.itemRow}>
                          <Text style={styles.itemName}>
                            {item.productName}
                          </Text>
                          <Text style={styles.Qty}>
                            {item.productQty}
                            {item.productUnit}
                          </Text>
                        </View> */}

                        {item.orderStatus === '4' ? (
                          <>
                            {item.delivery_otp !== '' ? (
                              <View style={{marginTop: 15}}>
                                <Text
                                  style={{
                                    fontFamily: 'OpenSans-SemiBold',
                                    fontSize: 16,
                                  }}>
                                  कस्टमर की लोकेशन प्राप्त करने के लिए यह कोड
                                  शॉप पार्टनर से शेयर करें
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: 'OpenSans-Bold',
                                    fontSize: 16,
                                    color: '#000',
                                  }}>
                                  {item.delivery_otp}
                                </Text>
                              </View>
                            ) : null}
                          </>
                        ) : null}

                        {item.delivery_status == '1' ? (
                          <>
                            {item.orderStatus == '3' ? (
                              <View style={styles.tabRow}>
                                <TouchableOpacity
                                  onPress={() => {
                                    updtateStatus(
                                      '4',
                                      item.customer_name,
                                      item.order_id,
                                      item.partnerUserToken,
                                      item.CustomerUserToken,
                                    );
                                  }}
                                  style={[styles.btn1, {borderColor: 'blue'}]}>
                                  <Text
                                    style={[styles.btn1Txt, {color: 'blue'}]}>
                                    पिकअप डेस्टिनेशन पे पोहुंच गयें
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : item.orderStatus == '5' ? (
                              <View style={styles.tabRow}>
                                <TouchableOpacity
                                  onPress={() => {
                                    updtateStatus(
                                      '6',
                                      item.customer_name,
                                      item.order_id,
                                      item.partnerUserToken,
                                      item.CustomerUserToken,
                                    );
                                  }}
                                  style={styles.btn1}>
                                  <Text style={styles.btn1Txt}>
                                    कस्टमर की लोकेशन प्राप्त करें
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : item.orderStatus == '6' ? (
                              <View style={styles.tabRow}>
                                <TouchableOpacity
                                  onPress={() => {
                                    updtateStatus(
                                      '7',
                                      item.customer_name,
                                      item.order_id,
                                      item.partnerUserToken,
                                      item.CustomerUserToken,
                                    );
                                  }}
                                  style={styles.btn1}>
                                  <Text style={styles.btn1Txt}>
                                    कस्टमर की लोकेशन पर पोहोच गयें
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : item.orderStatus == '7' ? (
                              <View style={styles.tabRow}>
                                <TouchableOpacity
                                  onPress={() => {
                                    updtateStatus(
                                      '8',
                                      item.customer_name,
                                      item.order_id,
                                      item.partnerUserToken,
                                      item.CustomerUserToken,
                                    );
                                  }}
                                  style={[styles.btn1, {borderColor: 'green'}]}>
                                  <Text
                                    style={[styles.btn1Txt, {color: 'green'}]}>
                                    आर्डर डेलीवर्ड
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </>
                        ) : null}
                      </View>

                      {/* ========Accept Cancel Order Start ======== */}
                      {item.delivery_status == '0' ? (
                        <>
                          <View style={styles.btnRow}>
                            <TouchableOpacity
                              onPress={() => {
                                AcceptCancel(
                                  '1',
                                  item.order_id,
                                  item.CustomerUserToken,
                                  item.partnerUserToken,
                                );
                              }}
                              style={styles.btn}>
                              <Text style={styles.btnTxt}>
                                आर्डर एक्सेप्ट करें{' '}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                AcceptCancel(
                                  '2',
                                  item.order_id,
                                  item.CustomerUserToken,
                                  item.partnerUserToken,
                                );
                              }}
                              style={[
                                styles.btn,
                                {backgroundColor: '#a83d36'},
                              ]}>
                              <Text style={styles.btnTxt}>कैंसिल </Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : null}
                      {/* ======== Accept Cancel Order End ======== */}

                      {/* ======== Partner Customer Location  Start ======== */}
                      {item.delivery_status == '1' ? (
                        <>
                          {item.orderStatus == '3' ? (
                            <TouchableOpacity
                              onPress={() =>
                                openMapDirection(
                                  item.patlatitude,
                                  item.patlongitude,
                                )
                              }
                              style={styles.btnRow}>
                              <View style={styles.btn}>
                                <Text style={styles.btnTxt}>
                                  शॉप पार्टनर की लोकेशन देखें
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : item.orderStatus == '6' ? (
                            <TouchableOpacity
                              onPress={() =>
                                openMapDirection(
                                  item.customerdeliveredlat,
                                  item.customerdeliveredlong,
                                )
                              }
                              style={styles.btnRow}>
                              <View style={styles.btn}>
                                <Text style={styles.btnTxt}>
                                  कस्टमर की लोकेशन देखें
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : null}
                        </>
                      ) : null}
                      {/* ========  Partner Customer Location End ======== */}

                      {/* ======== Item Delivered or Cancel By Start ======== */}
                      {item.delivery_status == '2' ? (
                        <>
                          <View style={{marginTop: 15}}>
                            <Text
                              style={{
                                fontFamily: 'OpenSans-SemiBold',
                                fontSize: 16,
                              }}>
                              Status
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'OpenSans-Bold',
                                fontSize: 18,
                                color: '#a83d36',
                              }}>
                              आपके द्वारा कैंसिल किया गया आर्डर
                            </Text>
                          </View>
                        </>
                      ) : null}
                      {item.orderStatus == '8' ? (
                        <>
                          {item.delivery_status == '1' ? (
                            <View style={{marginTop: 15}}>
                              <Text
                                style={{
                                  fontFamily: 'OpenSans-SemiBold',
                                  fontSize: 16,
                                }}>
                                Status
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'OpenSans-Bold',
                                  fontSize: 18,
                                  color: 'green',
                                }}>
                                आर्डर डेलीवर्ड
                              </Text>
                            </View>
                          ) : null}
                        </>
                      ) : null}
                      {/* ======== Item Delivered or Cancel By End ======== */}
                    </View>
                  </View>
                </>
              )}
            />
          ) : (
            <ScrollView
              style={{
                flex: 1,
                width: '100%',
                paddingTop: '25%',
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  paddingTop: 20,
                }}>
                <LottieView
                  source={require('../../../assets/lottie/nodata.json')}
                  autoPlay
                  loop
                  style={{
                    width: 200,
                    height: 200,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#777',
                  }}>
                  कस्टमर आर्डर को सर्च किया जा रहा है | कस्टमर आर्डर प्राप्त
                  होते ही आपको नोटिफिकेशन के द्वारा सूचित किया जाए गए
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </>
  );
};

export default NewOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tabRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  brandName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  cardHeading: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  orderDetailRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  div: {
    flex: 1,
  },
  divLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginTop: 10,
  },
  orderResponse: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#5E3360',
  },
  itemDetailsSection: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#c7c7c7c7',
  },
  caption: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginTop: 20,
  },
  innerCaption: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#5E3360',
  },
  itemRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  itemName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    marginRight: 10,
  },
  Qty: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  btnRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  btnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#fff',
  },
  btn1: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#9E663C',
    borderRadius: 5,
  },
  btn1Txt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#9E663C',
  },
});
