import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { MaterialIcons, MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const PostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([])

    const getAllPosts = async () => {
        const data = await getDocs(collection(db, "posts"))
        const posts = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setPosts(posts)
    };


    useEffect(() => {
        getAllPosts()
    }, [getAllPosts])
    return (
        <View style={styles.container}>
            {posts && <FlatList
                data={posts}
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingTop: 20
    }, image: {
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
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    photoCaptionWrapper: {
        marginBottom: 10
    },
});

export default PostsScreen;