import MapView, { Marker } from 'react-native-maps';
import { Text, View, StyleSheet } from 'react-native'

const MapScreen = ({route}) => {
  const {latitude, longitude} = route.params.location
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.022,
          longitudeDelta: 0.022,
        }}>
        <Marker 
        coordinate={{
          latitude,
          longitude,
        }} 
        title='Это было здесь!' />

      </MapView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1
  }
});
export default MapScreen;