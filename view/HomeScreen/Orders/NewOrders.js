import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

import Loader from '../../../controller/LoaderScreen';

const NewOrders = ({route, navigation}) => {
  const [userId, setUserId] = React.useState('');
  const [customerToken, setCustomerToken] = React.useState('');
  const [partnerToken, setPartnerToken] = React.useState('');
  const [orderId, setOrderId] = React.useState('');
  const [status, setStatus] = React.useState('1');
  const [customerName, setCustomerName] = React.useState('');
  const [customerMobile, setCustomerMobile] = React.useState('');
  const [partnerPinCode, setPartnerPincode] = React.useState('');
  const [shopName, setShopName] = React.useState('');
  const [productQty, setProductQty] = React.useState('');
  const [productUnit, setProductUnit] = React.useState('');
  const [itemQty, setItemQty] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [allData, setAllData] = React.useState('');
  const [Data, setData] = React.useState('');
  const [isLoading, setLoading] = React.useState(true);
  const [mounted, setmounted] = React.useState(true);
  const [toggleCheckBoxOne, setToggleCheckBoxOne] = React.useState(false);

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
        getOrderData();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  // Accept Order or Cancel
  const AcceptCancel = async (
    activitytype,
    orderId,
    customerToken,
    partnerToken,
  ) => {
    console.log(partnerToken);
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
        // console.log(result);
        if (result.error == 0) {
          if (activitytype == '1') {
            notificationToCustomer(customerToken);
            notificationToPartner(partnerToken);
          }
        }
        getOrderData();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  // Send Notification to customer
  const notificationToCustomer = async customerToken => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    const CUSTOMER_FIREBASE_API_KEY = customer_firebase_key;
    const message = {
      to: customerToken,
      notification: {
        title: 'Order Confirmation',
        body: deliveryPartner + ' ' + 'is on his way to pickup your order',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Order Confirmation',
        body: deliveryPartner + ' ' + ' is on his way to pickup your order',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });
    // https://fcm.googleapis.com/fcm/send
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  // Send Notification to Partner
  const notificationToPartner = async partnerToken => {
    let deliveryPartner = await AsyncStorage.getItem('userName');
    const FIREBASE_API_KEY = delivery_partner_firebase_key;
    const message = {
      to: partnerToken,
      notification: {
        title: 'Order Confirmation',
        body:
          deliveryPartner +
          ' ' +
          'name has confirmed your order and is on his way',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Order Confirmation',
        body:
          deliveryPartner +
          ' ' +
          'name has confirmed your order and is on his way',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });
    // https://fcm.googleapis.com/fcm/send
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

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

  // status update
  const updtateStatus = async (status, customername, orderId) => {
    await fetch(
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
        if (result.error == 0) {
        } else {
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

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
          <FlatList
            style={{width: '100%'}}
            data={Data}
            keyExtractor={item => item.confirm_order_id}
            renderItem={({item}) => (
              <>
                <View style={styles.container}>
                  <View style={styles.card}>
                    <Text style={styles.cardHeading}>New Order Received!</Text>

                    <View style={styles.orderDetailRow}>
                      <View style={styles.div}>
                        <Text style={styles.divLabel}>Order ID</Text>
                        <Text style={styles.orderResponse}>
                          {item.order_id}
                        </Text>
                      </View>
                      <View style={styles.div}>
                        <Text style={styles.divLabel}>Pickup from</Text>
                        <Text style={styles.orderResponse}>
                          {item.shopName}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.itemDetailsSection}>
                      <Text style={styles.caption}>
                        Total products to pick up:{' '}
                        <Text style={styles.innerCaption}>
                          {item.numberOfProduct}
                        </Text>
                      </Text>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemName}>{item.productName}</Text>
                        <Text style={styles.Qty}>
                          {item.productQty}
                          {item.productUnit}
                        </Text>
                      </View>
                    </View>

                    {/* ======== Status 0 Start ======== */}
                    {item.delivery_status == '0' ? (
                      <>
                        <View style={styles.btnRow}>
                          <View style={styles.btn}>
                            <Text style={styles.btnTxt}>Accept Order</Text>
                          </View>

                          <View
                            style={[styles.btn, {backgroundColor: '#a83d36'}]}>
                            <Text style={styles.btnTxt}>Cancel</Text>
                          </View>
                        </View>
                      </>
                    ) : null}
                    {/* ======== Status 0 End ======== */}

                    {/* ======== Status 1 Start ======== */}
                    {item.delivery_status == '1' ? (
                      <>
                        <View style={styles.btnRow}>
                          <View style={styles.btn}>
                            <Text style={styles.btnTxt}>
                              Open Partner's Location
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : null}
                    {/* ======== Status 1 End ======== */}

                    {/* ======== Status 2 Start ======== */}
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
                            Cancelled by you
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {/* ======== Status 2 End ======== */}
                  </View>
                  {item.delivery_status == '1' ? (
                    <View style={styles.tabRow}>
                      <Text style={styles.statusName}>
                        Reached at Pickup Destination
                      </Text>
                      {toggleCheckBoxOne == false ? (
                        <CheckBox
                          disabled={false}
                          value={toggleCheckBoxOne}
                          onValueChange={() => {
                            updtateStatus(
                              '3',
                              item.customer_name,
                              item.order_id,
                            );
                            // setCustomerName();
                          }}
                          style={styles.statusOne}
                          lineWidth={2}
                          hideBox={false}
                          boxType={'circle'}
                          tintColors={'#9E663C'}
                          onCheckColor={'#6F763F'}
                          onFillColor={'#4DABEC'}
                          onTintColor={'#F4DCF8'}
                        />
                      ) : (
                        <CheckBox
                          disabled={true}
                          value={toggleCheckBoxOne}
                          style={styles.statusOne}
                          lineWidth={2}
                          hideBox={false}
                          boxType={'circle'}
                          tintColors={'#9E663C'}
                          onCheckColor={'#6F763F'}
                          onFillColor={'#4DABEC'}
                          onTintColor={'#F4DCF8'}
                        />
                      )}
                    </View>
                  ) : null}
                </View>
              </>
            )}
          />
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
});
