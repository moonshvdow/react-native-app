import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../../firebase/firebase-config";

import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

const initialState = {
  photoCaption: null
}


const CreatePostsScreen = ({ navigation }) => {
  const [state, setState] = useState(initialState)
  const [photo, setPhoto] = useState(null)
  const [location, setLocation] = useState(null);
  const cameraRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(null);

  const { id, login } = useSelector(state => state.auth.user)


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const takePhoto = async () => {
    const options = { quality: 1, base64: true };
    const { uri } = await cameraRef.current.takePictureAsync(options);
    setPhoto(uri);
  }

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const imageRef = ref(storage, `images/${uniquePostId}`);

    await uploadBytes(imageRef, file);
    const uploadedPhoto = await getDownloadURL(ref(storage, `images/${uniquePostId}`))
    return uploadedPhoto;
  }

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer()
    const docRef = await addDoc(collection(db, 'posts'), { photo, photoLocation: location.coords, photoCaption: state.photoCaption, userId: id, login })
  }

  const sendPhoto = () => {
    uploadPostToServer()
    setState(initialState)
    navigation.navigate('Posts')
  }


  const handleChange = (input, value) => {
    setState(prevState => ({ ...prevState, [input]: value }))
  }

  const clearPhoto = () => {
    setPhoto(null)
  }



  return (
    <View style={styles.container}>
      {photo ?
        <>
          <Image style={styles.photo} source={{uri: photo}} />
          <TouchableOpacity onPress={clearPhoto}>
            <Text style={{color: '#BDBDBD'}}>Редактировать фото</Text>
          </TouchableOpacity>
        </> 
        :
        <Camera style={styles.camera} ref={cameraRef}>
          <TouchableOpacity activeOpacity={0.8} style={styles.cameraButtonWrapper} onPress={takePhoto}>
            <FontAwesome name="camera" size={20} color="white" />
          </TouchableOpacity>
        </Camera>}

      <View style={{ marginBottom: 16 }}>
        <TextInput placeholder='Название' style={styles.formInput} value={state.photoCaption} onChangeText={(value) => handleChange('photoCaption', value)} />
      </View>
      <TouchableOpacity style={styles.formSubmitButton} activeOpacity={0.8} onPress={sendPhoto} >
        <Text style={styles.formSubmitButtonText}>Отправить</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  photo: {
    height: 240,
    marginBottom: 18
  },
  camera: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraButtonWrapper: {
    backgroundColor: '#FFFFFF30',
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50

  },
  formSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,

  },
  formSubmitButton: {
    alignItems: 'center',
    backgroundColor: '#FF6C00',
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 100,
  },

  formInput: {
    height: 50,
    padding: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontSize: 16,
  }
});

export default CreatePostsScreen;