import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput, Image } from 'react-native-paper'
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

const db = getFirestore(app);

const Addpost = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const publishPost = async (title,description) => {
    const docRef = await addDoc(collection(db, "socialposts"), { title, description });
    console.log("Document written with ID: ", docRef);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  })
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
    publishPost(data.title, data.description);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Text>Addpost</Text>

      <Button onPress={pickImage} >Pick an Image</Button>
      {image && <Image source={{ uri: image }} style={{with:'100%',height:300}} resizeMode='contain'  />}

      <Controller
        control={control}
        rules={{
          required: {message: 'Title is required.', value: true},
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder='Post Title'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label={"Post Title"}
            error={errors.title}
          />
        )}
        name='title'
      />
      {/* {errors.title && <Text>This is required.</Text>} */}
      <Text>{errors.title?.message}</Text>

      <Controller
        control={control}
        rules={{
          required: {message: 'Description is required.', value: true},
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder='Post Description'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label={"Post Description"}
            error={errors.description}
          />
        )}
        name='description'
      />
      {/* {errors.description && <Text>This is required.</Text>} */}
      <Text>{errors.description?.message}</Text>

      {/* <TextInput onChangeText={setTitle} label={"Post Title"} /> */}
      {/* <TextInput onChangeText={setDescription} label={"Post Description"} /> */}
      <Button onPress={handleSubmit(onSubmit)}>Publish Post</Button>
    </View>
  )
}

export default Addpost

const styles = StyleSheet.create({})