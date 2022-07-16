import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../../firebase/firebase-config";

import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

const initialState = {
  photoCaption: null
}


const CreatePostsScreen = ({ navigation }) => {
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false)
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
    keyboardHide()
    navigation.navigate('Posts')
  }


  const handleChange = (input, value) => {
    setState(prevState => ({ ...prevState, [input]: value }))
  }
  const clearAll = () => {
    setPhoto(null)
    setState(initialState)

  }
  const clearPhoto = () => {
    setPhoto(null)
  }

  const keyboardHide = () => {
    setIsOpenKeyboard(false);
    Keyboard.removeAllListeners('keyboardDidHide')
    Keyboard.dismiss()
  }

  const keyboardShow = () => {
    setIsOpenKeyboard(true)
    Keyboard.addListener('keyboardDidHide', () => {
      setIsOpenKeyboard(false);
    })
  }


  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={{ ...styles.container, paddingBottom: isOpenKeyboard ? 0 : 50 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
          <View>
            {photo ?
              <>
                <Image style={styles.photo} source={{ uri: photo }} />
                <TouchableOpacity onPress={clearPhoto}>
                  <Text style={{ color: '#BDBDBD' }}>Редактировать фото</Text>
                </TouchableOpacity>
              </>
              :
              <Camera style={styles.camera} ref={cameraRef}>
                <TouchableOpacity activeOpacity={0.8} style={styles.cameraButtonWrapper} onPress={takePhoto}>
                  <FontAwesome name="camera" size={20} color="white" />
                </TouchableOpacity>
              </Camera>}

            <View style={{ marginTop: 45 }}>
              <TextInput placeholder='Название..' style={styles.formInput} value={state.photoCaption} onFocus={keyboardShow} onChangeText={(value) => handleChange('photoCaption', value)} />
            </View>

            <TouchableOpacity style={photo && state.photoCaption ? styles.formSubmitButton : styles.disabledFormSubmitButton} disabled={photo && state.photoCaption ? false : true} activeOpacity={0.8} onPress={sendPhoto} >
              <Text style={photo && state.photoCaption ? styles.formSubmitButtonText : styles.disabledFormSubmitButtonText}>Отправить</Text>
            </TouchableOpacity>
            {!isOpenKeyboard &&
              <View style={styles.clearButtonWrapper}>
                <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
                  <AntDesign name="delete" size={24} color="#DADADA" />
                </TouchableOpacity>
              </View>
            }
          </View>



        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 50,
  },
  photo: {
    height: 240,
    marginBottom: 18
  },
  camera: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 100,
  },
  disabledFormSubmitButton: {
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 100,
  },
  disabledFormSubmitButtonText: {
    color: '#BDBDBD',
    fontSize: 16,

  },
  clearButtonWrapper: {
    alignItems: "center",
    marginTop: 50
  },
  clearButton: {
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 70
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