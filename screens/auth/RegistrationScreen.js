import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback  } from 'react-native';

import { signUp } from '../../redux/auth/auth-operations';

const initialState = {
  login: '',
  email: '',
  password: '',
}

export default function RegistrationScreen({navigation}) {
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false)
  const [state, setState] = useState(initialState)
  const [passwordHide, setPasswordHide] = useState(true)
  
  const dispatch = useDispatch()
  
  const handleChange = (input, value) => {
    setState(prevState => ({...prevState, [input]: value}))
  }
  
  const changePasswordHide = () => setPasswordHide(prevState => !prevState)

  const handleSubmit = () => {
    console.log(state)
    dispatch(signUp(state))
    setState(initialState)
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
    <TouchableWithoutFeedback onPress={keyboardHide} >
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/background.jpg')}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
          <View style={{...styles.formWrapper, paddingBottom: isOpenKeyboard ? 0 : 85}}>
            <View style={styles.formTitleWrapper}>
              <Text style={styles.formTitle}>Регистрация</Text>
            </View>
            <View style={{marginBottom: 16}}>
              <TextInput placeholder='Логин' style={styles.formInput} value={state.login} onFocus={keyboardShow} onChangeText={(value)=> handleChange('login', value)}/>
            </View>
            <View style={{marginBottom: 16}}>
              <TextInput placeholder='Адрес электронной почты' style={styles.formInput} value={state.email} onFocus={keyboardShow} onChangeText={(value)=> handleChange('email', value)} />
            </View>
            <View style={{marginBottom: 40}}>
              <TextInput placeholder='Пароль' style={styles.formInput} value={state.password} secureTextEntry={passwordHide} onFocus={keyboardShow} onChangeText={(value)=> handleChange('password', value)}/>
              <TouchableOpacity style={styles.hidePasswordButton} onPress={changePasswordHide}><Text style={styles.hidePasswordButtonText}>{passwordHide ? 'Показать' : 'Скрыть'}</Text></TouchableOpacity>
            </View>
            {!isOpenKeyboard && 
            <>
            <TouchableOpacity style={styles.formSubmitButton} activeOpacity={0.8} onPress={handleSubmit}>
              <Text style={styles.formSubmitButtonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.formNavigateButton} activeOpacity={0.8} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.formNavigateButtonText}>Уже есть аккаунт? Войти</Text>
            </TouchableOpacity>
            </>
            }
          </View>
      </KeyboardAvoidingView>   
      </ImageBackground>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage:{
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end'
  },
  formWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 85,
  },
  formTitle:{
    fontSize: 30,
    // fontFamily: 'Roboto_500Medium',
  },
  formTitleWrapper:{
    alignItems: 'center',
    marginBottom: 30
  },
  formInput: {
    height: 50,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    // fontFamily: 'Roboto_400Regular',
  },
  formInputWrapper: {

  },
  formSubmitButtonText:{
    color: '#FFFFFF',
    fontSize: 16,
    // fontFamily: 'Roboto_400Regular',

  },
  formSubmitButton:{
    alignItems: 'center',
    backgroundColor: '#FF6C00',
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 100,
  },
  formNavigateButton: {
    alignItems: 'center',
    backgroundColor: 'transparent'
    
  },
  formNavigateButtonText: {
    color: '#1B4371',
    fontSize: 16,
    // fontFamily: 'Roboto_400Regular',
  },
  hidePasswordButton: {
    position: 'absolute',
    top: 12,
    right: 16
  },
  hidePasswordButtonText: {
    fontSize: 16,
    color: '#1B4371'
  },
});
