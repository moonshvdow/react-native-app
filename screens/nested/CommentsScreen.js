
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { useSelector } from 'react-redux';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const CommentsScreen = ({ route }) => {
  const { login } = useSelector(state => state.auth.user)
  const { postId } = route.params;
  const [comment, setComment] = useState('')
  const [allComments, setAllComments] = useState([])


  useEffect(() => {
    getAllComments()
  }, [getAllComments])

  const uploadCommentToServer = async () => {
    await addDoc(collection(db, `posts/${postId}/comments`), { comment, login });
    setComment('')
  }

  const getAllComments = async () => {
    const data = await getDocs(collection(db, `posts/${postId}/comments`))
    const comments = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    setAllComments(comments)

  }
  return (
    <View style={styles.container}>
      {allComments &&
      <FlatList 
      data={allComments}
      keyExtractor={(item) => item.id}
      renderItem={({item})=> 
      <View style={styles.commentWrapperOther}>
        <Text>{item.login}</Text>
        <View style={styles.commentTextWrapperOther}>
          <Text>{item.comment}</Text>
        </View>
      </View>}/>}
      <View style={{ marginBottom: 16 }}>
        <TextInput placeholder='Комментарий' style={styles.formInput} value={comment} onChangeText={(value) => setComment(value)} />
      </View>
      <TouchableOpacity style={styles.formSubmitButton} activeOpacity={0.8} onPress={uploadCommentToServer} >
        <Text style={styles.formSubmitButtonText}>Отправить</Text>
      </TouchableOpacity>
    </View>
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