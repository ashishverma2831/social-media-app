import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { Avatar, Button, Icon, IconButton, TextInput } from 'react-native-paper';
import app from '../firebaseConfig';

const db = getFirestore(app);

const Comments = ({ visible, setVisible, postData, feedlist, setFeedlist, index }) => {

    const [userInput, setUserInput] = useState('');
    const addComment = async () => {
        const ref = doc(db, 'socialposts', postData.id);
        await setDoc(ref,
            { comments: (Array.isArray(postData.comments) ? [...postData.comments, userInput] : [userInput]) },
            { merge: true });

        const updateData = (await getDoc(ref)).data();
        const temp = feedlist;
        temp[index] = { ...postData, comments: updateData.comments };
        setFeedlist([...temp]);
    }

    return (
        <Modal visible={visible} onRequestClose={() => { setVisible(false) }} >
            <View style={styles.container}>
                <View style={styles.header}>
                    <IconButton icon={'arrow-left'} onPress={() => { setVisible(false) }}>Close</IconButton>
                    <Text style={styles.headerTitle}>Comments</Text>
                </View>
                <View style={{ padding: 20 }}>
                    {
                        (postData.comments ? postData.comments : []).map((comment, index) => {
                            return <View style={{ marginBottom: 20, borderBottomColor:'lightgray',borderBottomWidth:2 }}>
                                <View style={styles.comment}>
                                    <Avatar.Text size={40} label={comment[0]} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                        <View>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>John Doe</Text>
                                            <Text key={index}>{comment}</Text>
                                        </View>
                                        <IconButton icon='heart-outline' iconColor='red' size={20} />
                                    </View>
                                </View>
                                <Text>Reply</Text>
                            </View>
                        })}
                </View>
                <View style={styles.commentInput}>
                    <TextInput style={{ flex: 5 }} onChangeText={setUserInput} value={userInput} />
                    <Button mode='contained' onPress={addComment} icon={'send'}>Post</Button>
                </View>
            </View>
        </Modal>
    )
}

export default Comments

const styles = StyleSheet.create({
    commentInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    comment: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})