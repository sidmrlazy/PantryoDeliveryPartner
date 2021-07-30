import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

// Libraries
import {createStackNavigator} from '@react-navigation/stack';
import {sendNotification, testNotification} from '../../model/notification';
import FeatureTest from './Component/FeaturesTest';

const HomeScreen = ({navigation}) => {
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              borderWidth: 0.5,
              height: 150,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 5,
              borderRadius: 5,
            }}>
            {/* <Text>New Orders</Text> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('FeatureTest')}>
              <Text>Features Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const Stack = createStackNavigator();

function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="FeatureTest" component={FeatureTest} />
    </Stack.Navigator>
  );
}

export default Home;
