import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import app from '../firebaseConfig';
import { Avatar, Button, Card, IconButton } from 'react-native-paper';
import Comments from './Comments';
import ReactTimeAgo, { useTimeAgo } from 'react-time-ago';
// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const db = getFirestore(app);

const FormatDate = ({date}) => {
  console.log(date);
  const result = useTimeAgo(date || new Date());
  return <Text>{result}</Text>
}

const FeedCard = ({ data, feedlist, setFeedlist, index }) => {

  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  const likePost = async () => {

    const ref = doc(db, 'socialposts', data.id);
    // await ref.doc(data.id).update({
    //   likes: data.likes + 1
    // })
    await setDoc(ref,
      { likes: (data.likes ? data.likes : 0) + (liked?-1:1) },
      { merge: true });

    const updateData = (await getDoc(ref)).data();

    const temp = feedlist;
    temp[index] = { ...data, likes: updateData.likes };
    setFeedlist([...temp]);
      setLiked(!liked);
  }

  return <>
    <Card style={styles.card} key={data.id}>
      <Card.Title 
        title={data.title}
        subtitle={new Date(data.postedOn).toDateString()}
        left={ props => <Avatar.Image {...props} size={40} source={{ uri: data.image }} /> }
        right={props=><IconButton {...props} icon='dots-vertical' />}
      /> 
      {/* <Text>{new Date(data.postedOn).toDateString()}</Text> */}
      {/* <FormatDate date={new Date(data.postedOn)} /> */}
      <Card.Cover source={{ uri: data.image }} />
      <View style={styles.iconContainer}>
        <View style={styles.iconButton}>
          <IconButton iconColor='red' onPress={likePost} icon={liked?'heart':'heart-outline'} mode='contained' />
          <Text>{data.likes ? data.likes : '0'}</Text>
        </View>
        <View style={styles.iconButton}>
          <IconButton onPress={() => { setShowComments(true) }} icon='comment-outline' mode='contained' />
          <Text>{data.comments ? data.comments.length : '0'}</Text>
        </View>
        <IconButton icon='share' mode='contained' />
      </View>
    </Card>
    <Comments index={index} feedlist={feedlist} setFeedlist={setFeedlist} visible={showComments} setVisible={setShowComments} postData={data} />
  </>
}

const tabs = ['Best Posts', 'Trending', 'Latest', 'My Posts'];
const TabList = ({activeTab,setActiveTab}) => {
  return <View style={{ flexDirection: 'row', gap:10 }}>
    {
      tabs.map((tab, index) => {
        return <Button key={index} mode={activeTab===tab?'contained':'outlined'}>{tab}</Button>
      })
    }
  </View>
}

const Feed = () => {

  const [feedlist, setFeedlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Best Posts');

  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const loadFeed = async () => {
    const ref = collection(db, 'socialposts');
    setRefreshing(true);
    const snapshot = await getDocs(ref);
    // console.log(snapshot.docs[0].id);
    const data = snapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id }
    });
    // console.log(data);
    setFeedlist(data);
    setRefreshing(false);
  }

  useEffect(() => {
    loadFeed();
  }, [])

  const displayFeed = () => {
    return <View>
      <FlatList
        data={feedlist}
        renderItem={({ item, index }) => <FeedCard feedlist={feedlist} setFeedlist={setFeedlist} data={item} index={index} />}
        keyExtractor={item => item.id}
        onRefresh={loadFeed}
        refreshing={refreshing}
      />
    </View>
  }

  return (
    <View>
      {/* <ScrollView horizontal={true} style={{flexDirection:'row'}}> */}
      <TabList activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* </ScrollView> */}
      {displayFeed()}

    </View>
  )
}

export default Feed

const styles = StyleSheet.create({
  card: {
    margin: 10
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  iconButton: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  }
})