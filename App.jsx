import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Feed from './screens/Feed';
import Addpost from './screens/Addpost';
import { NavigationContainer } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
import Signup from './screens/Signup';
import { useEffect, useRef, useState } from 'react';
import Login from './screens/Login';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const auth = getAuth(app);
const Tab = createBottomTabNavigator();

export default function App() {

  const theme = useTheme();
  const runOnce = useRef(false);

  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userLoggedin, setUserLoggedin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedin(true);
      } else {
        setUserLoggedin(false);
      }
    });
  }, []);

  const openLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  }

  const openSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  }

  return (
    <NavigationContainer>
      <Signup visible={signupOpen} setVisible={setSignupOpen} openLogin={openLogin} />
      <Login visible={loginOpen} setVisible={setLoginOpen} openSignup={openSignup} />
      <Tab.Navigator
        screenOptions={({ route }) => {
          return {
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Feed') {
                iconName = focused?'home':'home-outline';
              } else if (route.name === 'Addpost') {
                iconName = focused?'plus-circle':'plus-circle-outline';
              }
              return <Icon name={iconName} size={focused?30:25} color={focused ? theme.colors.primary : 'gray'} />
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
          }
        }}
      >
        <Tab.Screen name="Feed" component={Feed}
          options={{
            headerRight: () => !userLoggedin ? <IconButton onPress={() => { setLoginOpen(true) }} icon='account-circle' mode='contained' /> :
              <IconButton icon={'logout'}
                onPress={() => { setUserLoggedin(false); }}
              />
            ,
          }}
        />
        <Tab.Screen name="Addpost" component={Addpost} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
