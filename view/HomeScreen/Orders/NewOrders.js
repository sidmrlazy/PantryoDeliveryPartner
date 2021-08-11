import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        console.log(result);
        if (result.error == 0) {
          setData(result.allorder);
        }
        getOrderData();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  ///////////////////////Accept Order or Cancel
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
  ///////////////////////Accept Order or Cancel

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

  useEffect(() => {
    // DATA = [
    //   (userId = route.params.order_id),
    //   // setUserId(route.params.delivery_id);
    //   // setOrderId(route.params.delivery_id);
    //   // setCustomerToken(route.params.customerToken);
    //   // setPartnerToken(route.params.partnerToken);
    //   // setStatus(route.params.delivery_status);
    //   // setCustomerName(route.params.customerName);
    //   // setCustomerMobile(route.params.customerMobile);
    //   // setPartnerPincode(route.params.partnerPinCode);
    //   // setShopName(route.params.shopName);
    //   // setProductName(route.params.productName);
    //   // setProductQty(route.params.productQty);
    //   // setProductUnit(route.params.productUnit);
    //   // setItemQty(route.params.itemQty);
    // ];
    getOrderData();
    userProfileData();
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
                <View style={styles.orderDetails}>
                  <View style={styles.row}>
                    <Text style={[styles.customer, {fontSize: 17}]}>
                      Shop Name :
                    </Text>
                    <Text style={styles.customer}>{item.shopName}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.customer, {fontSize: 17}]}>
                      Order Id :
                    </Text>
                    <Text style={styles.customer}>{item.order_id}</Text>
                  </View>

                  {/* <View style={styles.row}>
                  <Text style={styles.product}>{productName}</Text>
                  <Text style={styles.weight}>
                    {item.productQty}
                    {item.productUnit}
                  </Text>
                  <Text style={styles.operator}>X</Text>
                  <Text style={styles.qty}>{item.numberOfProduct}</Text>
                </View> */}
                  <View style={styles.row}>
                    {item.delivery_status == '0' ? (
                      <>
                        <Pressable
                          onPress={() => {
                            AcceptCancel(
                              '1',
                              item.order_id,
                              item.CustomerUserToken,
                              item.partnerUserToken,
                            );
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'green',
                            paddingVertical: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            marginRight: 5,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'OpenSans-SemiBold',
                              fontSize: 19,
                              color: '#fff',
                            }}>
                            Accept
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            AcceptCancel(
                              '2',
                              item.order_id,
                              item.CustomerUserToken,
                              item.partnerUserToken,
                            );
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'orange',
                            paddingVertical: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            marginLeft: 5,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'OpenSans-SemiBold',
                              fontSize: 19,
                              color: '#fff',
                            }}>
                            Cancel
                          </Text>
                        </Pressable>
                      </>
                    ) : null}
                    {item.delivery_status == '1' ? (
                      <Pressable
                        onPress={() => {
                          AcceptCancel(
                            '1',
                            item.order_id,
                            item.CustomerUserToken,
                            item.partnerUserToken,
                          );
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: 'green',
                          paddingVertical: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          marginRight: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'OpenSans-SemiBold',
                            fontSize: 19,
                            color: '#fff',
                          }}>
                          Accept
                        </Text>
                      </Pressable>
                    ) : null}
                    {item.delivery_status == '2' ? (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: 'orange',
                          paddingVertical: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          marginLeft: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'OpenSans-SemiBold',
                            fontSize: 19,
                            color: '#fff',
                          }}>
                          Cancel
                        </Text>
                      </View>
                    ) : null}
                  </View>
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
    backgroundColor: '#fff',
  },
  orderDetails: {
    width: '100%',
    borderBottomWidth: 0.5,
    paddingBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 10,
    borderBottomColor: '#c7c7c7c7',
  },
  customer: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#5E3360',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  product: {
    fontFamily: 'OpenSans-Regular',
    flex: 1,
    fontSize: 18,
    color: '#5E3360',
  },
  weight: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
    color: '#5E3360',
  },
  operator: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
  },
  qty: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#5E3360',
  },
});
