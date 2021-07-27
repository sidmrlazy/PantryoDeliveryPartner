import React from 'react';
import {View, Text, Pressable} from 'react-native';

// Library
import {AuthContext} from '../../controller/Utils';

const SettingsScreen = () => {
  const {signOut} = React.useContext(AuthContext);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable onPress={signOut}>
          <Text>SettingsScreen</Text>
        </Pressable>
      </View>
    </>
  );
};

export default SettingsScreen;
