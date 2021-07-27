import React from 'react';

// ===== Libraries ===== //
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/Ionicons';

// ===== Screens ===== //
import HomeScreen from '../view/HomeScreen/HomeScreen';
import SettingsScreen from '../view/SettingsScreen/SettingsScreen';

const Tab = createMaterialBottomTabNavigator();

const Navigation = ({navigation}) => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#5E3360"
        inactiveColor="#5E3360"
        backBehavior="initialRoute"
        labeled="true"
        barStyle={{backgroundColor: '#FFFFFF'}}
        style={{
          backgroundColor: '#00000000',
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="home-outline" color={color} size={25} />
            ),
          }}
        />

        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="settings-outline" color={color} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Navigation;
