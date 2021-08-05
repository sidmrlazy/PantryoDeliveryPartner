import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

// Library
import {AuthContext} from '../../controller/Utils';
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';

// Screens
import ProfileScreen from './ProfileScreen';

const Settings = ({navigation}) => {
  const {signOut} = React.useContext(AuthContext);

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate('ProfileScreen')}
          style={styles.btn}>
          <Icons name="person-outline" size={25} color="#5E3360" />
          <Text style={styles.btnTxt}>Profile</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={signOut}>
          <Icons name="log-out-outline" size={25} color="#5E3360" />
          <Text style={styles.btnTxt}>Logout</Text>
        </Pressable>
      </View>
    </>
  );
};

// export default Settings;

const Stack = createStackNavigator();

function SettingScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    marginLeft: 20,
  },
});
