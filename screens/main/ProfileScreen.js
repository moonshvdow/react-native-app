import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, ImageBackground, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

import { MaterialIcons, MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';

import { signOutUser } from "../../redux/auth/auth-operations";

const ProfileScreen = ({ navigation }) => {
  const { login, id } = useSelector(state => state.auth.user)
  const [profilePosts, setProfilePosts] = useState([])
  const dispatch = useDispatch();


  useEffect(() => {
    getAllProfilePosts()
  }, [getAllProfilePosts])


  const getAllProfilePosts = async () => {
    const data = await getDocs(query(collection(db, 'posts'), where('userId', "==", id)))
    const posts = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    setProfilePosts(posts)

  }

  const signOut = () => {
    dispatch(signOutUser())
  }
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/background.jpg')}>
        <View style={styles.contentWrapper}>
          <TouchableOpacity style={styles.profileLogOut} activeOpacity={0.8} onPress={signOut}>
            <MaterialIcons name="logout" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <View style={styles.profileTitleWrapper}>
            <Text style={styles.profileTitle}>{login}</Text>
          </View>
          {profilePosts && <FlatList
            data={profilePosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <View style={styles.postWrapper}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item.photo }} style={styles.image} />
                </View>
                <View style={styles.photoCaptionWrapper}>
                  <Text>{item.photoCaption}</Text>
                </View>
              <View style={styles.buttonsWrapper}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Comments', { postId: item.id })}>
                  <EvilIcons name="comment" size={25} color="#BDBDBD" />
                </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Map', { location: item.photoLocation })}>
                  <MaterialCommunityIcons name="map-marker" size={25} color="#BDBDBD" />
                </TouchableOpacity>
              </View>
              </View>} />}
        </View>

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end'
  },
  contentWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
    paddingTop: 85,
    paddingBottom: 10,
    maxHeight: "70%"
  },
  profileTitle: {
    fontSize: 30,
    alignItems: "center"
  },
  profileTitleWrapper: {
    alignItems: 'center',
    marginBottom: 30
  },
  profileLogOut: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  image: {
    height: 240,
    borderRadius: 8
  },
  imageWrapper: {
    borderRadius: 8,
    marginBottom: 8,
  },
  postWrapper: {
    marginBottom: 20
  },
  buttonsWrapper:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  photoCaptionWrapper: {
    marginBottom: 10
  },
});

export default ProfileScreen;