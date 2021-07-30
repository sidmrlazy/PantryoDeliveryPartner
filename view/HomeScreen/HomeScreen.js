import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Switch} from 'react-native';

// Libraries
import {
  sendNotification,
  jobStarted,
  jobStopped,
} from '../../model/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const HomeScreen = () => {
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [bikeNo, setBikeNo] = React.useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const userProfileData = async () => {
    setName(await AsyncStorage.getItem('userName'));
    setMobile(await AsyncStorage.getItem('contactNumber'));
    setBikeNo(await AsyncStorage.getItem('bikeRegistrationNumber'));
  };

  React.useEffect(() => {
    userProfileData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* ====== Header Start ====== */}
        <View style={styles.topHeader}>
          <View style={styles.profileBox}>
            <Icons name="image-outline" size={25} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.mobile}>{mobile}</Text>
            <Text style={styles.bike}>{bikeNo}</Text>
          </View>
          <View style={styles.startBtn}>
            {isEnabled ? (
              <>
                <Text style={styles.btntxt}>Stop</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#f4f3f4'}}
                  thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  onChange={jobStopped}
                />
              </>
            ) : (
              <>
                <Text style={styles.btntxt}>Start</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  onChange={jobStarted}
                />
              </>
            )}
          </View>
        </View>
        {/* ====== Header End ====== */}

        {/* ====== Tab Row Start ====== */}
        <View style={styles.row}>
          <TouchableOpacity onPress={sendNotification} style={styles.tab}>
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
              <Text style={styles.new}>10</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* ====== Tab Row End ====== */}
      </View>
    </>
  );
};

export default HomeScreen;

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
    width: 100,
    height: 100,
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
    marginTop: 30,
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
    fontSize: 24,
  },
  startBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    fontFamily: 'OpensSans-Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
});
