import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const FeatureTest = () => {
  const userToken =
    'd22zc9riTKSdL3inTev9KK:APA91bFL0wjx44r_z4py_Ajo6hHT6mIJJeFcwbHj-t342z-AoBEWaa5iNXVr50lvOhLZLZBR0mAzTmnpmspG4gTESJ2jM2KKNgKe4voRowqleio6beyPkeNci3gDA2Rt8DFMGLbEjRnv';

  const sendPushNotification = async () => {
    const DELIVERY_PARTNER_FIREBASE_API_KEY =
      'AAAA206GD2Q:APA91bEaq_P49bzza39abiiZgUe_-vVytc7JacVYblNvLgqGPWgKYWZhT-6zdw68tmAsM4wkDDyftgYlXNFaMA5C8IVbEFqaTUUqXLsDA21-6HuiEJqcz-QsDaVkPKVckTAIYL3u3glj';
    const message = {
      to: userToken,
      collapeKey: 'com.pantryodeliverypartner',
      notification: {
        title: 'Pantryo Delivery Partner',
        body: 'Test message',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Pantryo Delivery Partner',
        body: 'Test message',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
    });
    // https://fcm.googleapis.com/fcm/send
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text>Feature Test</Text>

        <TouchableOpacity
          onPress={sendPushNotification}
          style={{
            marginTop: 20,
            backgroundColor: 'lightblue',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 18,
            }}>
            Click here
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FeatureTest;
