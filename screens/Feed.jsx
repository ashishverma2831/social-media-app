import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import app from '../firebaseConfig';
import { Card, IconButton } from 'react-native-paper';

const db = getFirestore(app);
const FeedCard = ({data,index}) => {

  const likePost = async () => {
    const ref = collection(db,'socialposts');
    await ref.doc(data.id).update({
      likes: data.likes + 1
    })
  }

  return <Card style={styles.card} key={data.id}>
    <Card.Title title={data.title} subtitle={data.description} />
    <Text>{new Date(data.postedOn).toDateString()}</Text>
    <Card.Cover source={{ uri: data.image }} />
    <View style={styles.iconContainer}>
      <View style={styles.iconButton}>
      <IconButton icon='heart' mode='contained' />
      <Text>{data.likes?data.likes:'0'}</Text>
      </View>
      <IconButton icon='comment-outline' mode='contained' />
      <IconButton icon='share' mode='contained' />
    </View>
  </Card>
}

const Feed = () => {

  const [feedlist, setFeedlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const loadFeed = async () => {
    const ref = collection(db,'socialposts');
    setRefreshing(true);
    const snapshot = await getDocs(ref);
    // console.log(snapshot.docs[0].id);
    const data = snapshot.docs.map(doc =>{ 
      return {...doc.data(), id: doc.id}
    });
    console.log(data);
    setFeedlist(data);
    setRefreshing(false);
  }

  useEffect(()=>{
    loadFeed();
  },[])

  const displayFeed = () => {
    return <View>
      <FlatList 
        data={feedlist}
        renderItem={({item,index}) => <FeedCard data={item} index={index} />}
        keyExtractor={item => item.id}
        onRefresh={loadFeed}
        refreshing={refreshing}
      />
    </View>
  }

  return (
    <View>
      <Text>Feed</Text>
      {displayFeed()}
    </View>
  )
}

export default Feed

const styles = StyleSheet.create({
  card:{
    margin: 10
  },
  iconContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10 
  },
  iconButton:{
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  }
})