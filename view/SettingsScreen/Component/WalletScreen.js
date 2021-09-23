import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== Components ===== //
// import WalletActionScreen from './WalletActionScreen';
// import TransactionDetails from './TransactionDetails';

// Loader
import Loader from '../../../controller/LoaderScreen';

const WalletScreen = ({navigation}) => {
  const [transactionData, setTransactionData] = React.useState(null);
  const [totalAmount, setTotalAmount] = React.useState('0');
  const [isLoading, setLoading] = React.useState(true);
  const [mounted, setmounted] = React.useState(true);

  // Get Partner Transaction Details
  async function getDeliveryPartnerTransactionDetails() {
    let delivery_id = await AsyncStorage.getItem('user_id');
    setmounted(true);
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/getTotalDeliveryAmount.php',
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
        // console.log(result);
        if (mounted) {
          if (result.error == 0) {
            setTotalAmount(result.total_amount);
            setTransactionData(result.details);
          }
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        getDeliveryPartnerTransactionDetails();
        setLoading(false);
      });
  }

  React.useEffect(() => {
    getDeliveryPartnerTransactionDetails();
    return function cleanup() {
      setmounted(false);
    };
  }, []);

  return (
    <>
      {isLoading == true ? (
        <Loader />
      ) : (
        <>
          <View style={styles.topContainer}>
            <View style={styles.section}>
              <Text style={styles.screenName}>आपने आज तक कमाया </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 18,
                  color: '#000',
                }}>
                क्रेडिट आपके खाते में प्रतिदिन शाम 6:00 बजे आएगा{' '}
              </Text>
              <View style={styles.salesCard}>
                <View style={{flex: 1}}>
                  {/* <Text style={styles.salesCardHeading}>You have earned</Text> */}
                  <Text style={styles.totalSales}>
                    ₹ {totalAmount ? totalAmount : '0'}
                  </Text>
                </View>
                {/* <Icons name="add-circle" size={30} color="#5E3360" /> */}
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.btmScroll}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Transaction History</Text>
              </View>
              {transactionData !== null && transactionData !== '' ? (
                <FlatList
                  style={{width: '100%'}}
                  data={transactionData}
                  keyExtractor={(item, DTId) => String(DTId)}
                  renderItem={({item}) => (
                    <View style={styles.transaction}>
                      <View style={styles.div}>
                        <Text style={styles.transactionLabel}>Credited</Text>
                        <Text style={styles.date}>{item.payment_time}</Text>
                      </View>
                      <Text style={styles.amount}>₹ {item.amount}</Text>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.noDataDiv}>
                  <Text style={styles.noDataTxt}>No Payment Found!</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
};

const Stack = createStackNavigator();

function WalletScreenHolder() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      {/* <Stack.Screen name="WalletActionScreen" component={WalletActionScreen} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} /> */}
    </Stack.Navigator>
  );
}

export default WalletScreenHolder;

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  section: {
    paddingHorizontal: 10,
    width: '100%',
    marginVertical: 50,
  },
  screenName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#5E3360',
  },
  salesCard: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  salesCardHeading: {
    fontFamily: 'OpenSans-Regular',
  },
  totalSales: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 36,
    color: 'green',
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btmScroll: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
  },
  header: {
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: 'OpenSans-Regular',
  },
  transaction: {
    borderBottomWidth: 0.5,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  div: {
    flex: 1,
  },
  transactionLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#000',
  },
  date: {
    fontFamily: 'OpenSans-Regular',
    color: '#777777',
  },
  amount: {
    fontFamily: 'OpenSans-Bold',
    color: 'green',
    fontSize: 24,
    marginRight: 10,
    color: '#43a63a',
  },
  noDataDiv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noDataTxt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 24,
    color: '#731b85',
  },
});
