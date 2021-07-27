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
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity
          style={{
            width: '80%',
            backgroundColor: '#777',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 18,
          }}
          onPress={sendNotification}>
          <Text>HomeScreen</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;
