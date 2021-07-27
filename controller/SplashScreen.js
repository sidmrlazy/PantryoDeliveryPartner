import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

// Images
import Logo from '../assets/logo/Logo.png';
import flag from '../assets/logo/indianFlag.png';

const SplashScreen = () => {
  return (
    <>
      <View style={styles.topContainer}>
        <Image source={Logo} style={styles.brandLogo} />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.row}>
          <Image source={flag} style={styles.flag} />
          <Text style={styles.txt}>Made in India</Text>
        </View>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  topContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#5E3360',
    paddingBottom: 50,
  },
  brandLogo: {
    width: 250,
    height: 250,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#5E3360',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  txt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    marginLeft: 10,
    color: '#fff',
  },
});
