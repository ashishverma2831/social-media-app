import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { Button, TextInput } from 'react-native-paper';
import app from '../firebaseConfig';

const db = getFirestore(app);

const Comments = ({visible,setVisible,postData,feedlist,setFeedlist,index}) => {

    const [userInput, setUserInput] = useState('');
    const addComment = async () => {
        const ref = doc(db,'socialposts',postData.id);
        await setDoc(ref,
          {comments: (Array.isArray(postData.comments) ? [...postData.comments, userInput] : [userInput])},
          {merge: true});  
          
          const updateData = (await getDoc(ref)).data();
          const temp = feedlist;
            temp[index] = {...postData,comments:updateData.comments};
            setFeedlist([...temp]);
    }

  return (
    <Modal visible={visible} onRequestClose={()=>{setVisible(false)}} >
        <View>
            {
                (postData.comments ? postData.comments : []).map((comment,index) => {
                    return <Text key={index}>{comment}</Text>
            })}
        </View>
        <View style={styles.commentInput}>
            <TextInput style={{flex:5}} onChangeText={setUserInput} value={userInput} />
            <Button mode='contained' onPress={addComment} icon={'send'}>Post</Button>
        </View>
    </Modal>
  )
}

export default Comments

const styles = StyleSheet.create({
    commentInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap:10
    }
})