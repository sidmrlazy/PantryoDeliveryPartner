import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

// Libraries
import {sendNotification, testNotification} from '../../model/notification';

const HomeScreen = () => {
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
            <Text>New Orders</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeScreen;
