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

///////////////
import Icons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');

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
  const [toLocation, setToLocation] = React.useState(null);
  const [region, setRegion] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState(null);
  const [lat, setLatitude] = React.useState(null);
  const [long, setLongitude] = React.useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs access to your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied');
          requestLocationPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // ======= Show Toast ========== //
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  // ====== Get Longitude and Latitude========== //
  const getOneTimeLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        //   const currentLongitude = JSON.stringify(position.coords.longitude);
        //   const currentLatitude = JSON.stringify(position.coords.latitude);
        let fromLoc = position.coords;
        let cordinate = {
          latitude: fromLoc.latitude,
          longitude: fromLoc.longitude,
        };
        let mapRegion = {
          latitude: fromLoc.latitude,
          longitude: fromLoc.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setFromLocation(fromLoc);
        setRegion(mapRegion);
        setCoordinates(cordinate);
      },
      error => {
        if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
          showToast('Please on your Location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000,
      },
    );
  };

  React.useEffect(() => {
    requestLocationPermission();
  }, []);

  //////////Destination Marker
  const destinationMarker = () => {
    <Marker title="You" description="Your Location" coordinate={coordinates}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          height: 40,
          width: 40,
          backgroundColor: '#777',
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
          <Icons name="location" size={25} color="#fff" />
        </View>
      </View>
    </Marker>;
  };
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {fromLocation && (
          <MapView
            style={{flex: 1}}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}>
            {destinationMarker()}
          </MapView>
        )}
      </View>
    </View>
  );
};
export default FeaturesTest;
