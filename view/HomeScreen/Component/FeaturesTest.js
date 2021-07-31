import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';

// Library
import Icons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const NO_LOCATION_PROVIDER_AVAILABLE = 2;

const FeaturesTest = ({route, navigation}) => {
  const [shop, setShop] = React.useState(null);
  const [street, setStreet] = React.useState('');
  const [fromLocation, setFromLocation] = React.useState(null);
  const [toLocation, setToLocation] = React.useState({
    latitude: 26.9426,
    longitude: 80.9383,
  });
  const [region, setRegion] = React.useState(null);

  React.useEffect(() => {
    //     let {currentLocation} = route.params;
    let fromLoc = route.params.currentLocation;
    // console.log(fromLoc);
    let mapRegion = {
      latitude: fromLoc.latitude,
      longitude: fromLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    setFromLocation(fromLoc);
    setRegion(mapRegion);
  }, []);

  // Destination Marker
  const destinationMarker = () => {
    <Marker coordinate={fromLocation}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          height: 40,
          width: 40,
          backgroundColor: 'red',
        }}>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#8654ad',
          }}>
          <Icons name="pin" size={75} color="#777777" />
        </View>
      </View>
    </Marker>;
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {fromLocation && (
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}>
            <Marker coordinate={fromLocation} />
            <Marker coordinate={toLocation} />
            <MapViewDirections
              origin={fromLocation}
              destination={toLocation}
              apikey={'AIzaSyCGYq77KEoSXWWiV_a7wXaaNPw9mSJT_30'}
              strokeColor="red"
              strokeWidth={3}
            />
          </MapView>
        )}
      </View>
    </View>
  );
};
export default FeaturesTest;
