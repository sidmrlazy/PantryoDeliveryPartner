import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NewOrders = () => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.orderDetails}>
          <Text style={styles.customer}>Customer Name</Text>

          <View style={styles.row}>
            <Text style={styles.product}>Tata Sampan Besan</Text>
            <Text style={styles.weight}>500gm</Text>
            <Text style={styles.operator}>X</Text>
            <Text style={styles.qty}>2</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.product}>
              Atta Maggi Masala Instant 2 Minute Soup
            </Text>
            <Text style={styles.weight}>250gm</Text>
            <Text style={styles.operator}>X</Text>
            <Text style={styles.qty}>2</Text>
          </View>

          {/* <View>
            <Text>Accept Lead</Text>
          </View> */}
        </View>
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
