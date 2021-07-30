import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

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
        <View>
          <Text>User name</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={sendNotification}
            style={{
              flex: 1,
              borderWidth: 0.5,
              height: 150,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 5,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 18,
              }}>
              New Orders
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HomeScreen;
