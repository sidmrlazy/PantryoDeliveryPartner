import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // User Profile
  const userProfileData = async () => {
    setUserId(await AsyncStorage.getItem('user_id'));
  };

  const getOrderData = async () => {
    await fetch(allData, {
      method: 'POST',
      headers: {
        Accept: 'application/JSON',
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        delivery_id: userId,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result.allData);
        setAllData(result.allData);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    DATA = [
      (userId = route.params.order_id),
      // setUserId(route.params.delivery_id);
      // setOrderId(route.params.delivery_id);
      // setCustomerToken(route.params.customerToken);
      // setPartnerToken(route.params.partnerToken);
      // setStatus(route.params.delivery_status);
      // setCustomerName(route.params.customerName);
      // setCustomerMobile(route.params.customerMobile);
      // setPartnerPincode(route.params.partnerPinCode);
      // setShopName(route.params.shopName);
      // setProductName(route.params.productName);
      // setProductQty(route.params.productQty);
      // setProductUnit(route.params.productUnit);
      // setItemQty(route.params.itemQty);
    ];
    userProfileData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={DATA}
          keyExtractor={item => item.confirm_order_id}
          renderItem={({item}) => (
            <>
              <View style={styles.orderDetails}>
                <Text style={styles.customer}>{item.customerName}</Text>

                <View style={styles.row}>
                  <Text style={styles.product}>{productName}</Text>
                  <Text style={styles.weight}>
                    {productQty}
                    {productUnit}
                  </Text>
                  <Text style={styles.operator}>X</Text>
                  <Text style={styles.qty}>{itemQty}</Text>
                </View>
              </View>
            </>
          )}
        />
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  product: {
    fontFamily: 'OpenSans-Regular',
    flex: 1,
    fontSize: 18,
  },
  weight: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
  },
  operator: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
  },
  qty: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
});
