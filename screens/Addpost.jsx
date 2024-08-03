import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const db = getFirestore(app);

const Addpost = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const publishPost = async () => {
        const docRef = await addDoc(collection(db, "socialposts"), {title,description});
        console.log("Document written with ID: ", docRef);
    }

  return (
    <View>
      <Text>Addpost</Text>
      
      <TextInput onChangeText={setTitle} label={"Post Title"} />
      <TextInput onChangeText={setDescription} label={"Post Description"} />
      <Button onPress={publishPost}>Publish Post</Button>
    </View>
  )
}

export default Addpost

const styles = StyleSheet.create({})