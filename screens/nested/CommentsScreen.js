
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux';

import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

import { MaterialIcons } from '@expo/vector-icons';

const CommentsScreen = ({ route }) => {
  const { login } = useSelector(state => state.auth.user)
  const { postId } = route.params;
  const [comment, setComment] = useState('')
  const [allComments, setAllComments] = useState([])
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false)


  useEffect(() => {
    getAllComments()
  }, [getAllComments])

  const uploadCommentToServer = async () => {
    await addDoc(collection(db, `posts/${postId}/comments`), { comment, login });
    setComment('')
    keyboardHide()
  }

  const getAllComments = async () => {
    const data = await getDocs(collection(db, `posts/${postId}/comments`))
    const comments = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    setAllComments(comments)

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
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
          {allComments &&
            <FlatList
              data={allComments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                <View style={styles.commentWrapperOther}>
                  <Text>{item.login}</Text>
                  <View style={styles.commentTextWrapperOther}>
                    <Text>{item.comment}</Text>
                  </View>
                </View>} />}
          <View style={{ marginBottom: 16 }}>
            <TextInput placeholder='Комментировать...' style={styles.formInput} value={comment} onFocus={keyboardShow} onChangeText={(value) => setComment(value)} />
            <TouchableOpacity style={styles.formSubmitButton} activeOpacity={0.8} onPress={uploadCommentToServer} >
              <MaterialIcons name="send" size={15} color="#ffffff" />
            </TouchableOpacity>
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
    padding: 12,
    paddingBottom: 0
  },
  formSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,

  },
  formSubmitButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6C00',
    marginBottom: 16,
    padding: 10,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },

  formInput: {
    height: 50,
    padding: 16,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 100,
    fontSize: 16,
  },
  commentWrapperOther: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'

  },
  commentTextWrapperOther: {
    backgroundColor: '#00000008',
    padding: 16,
    borderRadius: 6,
    marginLeft: 5
  },
  commentText: {
    fontSize: 13,
  }
});
export default CommentsScreen;