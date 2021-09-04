import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native';

// Libraries
import analytics from '@react-native-firebase/analytics';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Banners = () => {
  const [banner, setBanner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBanner();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Function to get banner images from the server
  async function getBanner() {
    setIsLoading(true);
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/getallsliderimages.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          setBanner(result.images);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useMemo(() => {
    getBanner();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" />
        </>
      ) : (
        <>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={banner}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
              <>
                <Pressable
                  onPress={async () =>
                    await analytics().logEvent('loginbanner', {
                      item: item.imageName,
                    })
                  }
                  style={styles.imgcontainer}>
                  <Image source={{uri: item.imageName}} style={styles.img} />
                </Pressable>
              </>
            )}
            keyExtractor={(item, imageName) => String(imageName)}
          />
        </>
      )}
    </>
  );
};

export default Banners;

const styles = StyleSheet.create({
  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    maxWidth: '100%',
    maxHeight: '100%',
  },
  img: {
    width: 500,
    height: 800,
  },
});
