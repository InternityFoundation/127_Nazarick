/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator, withNavigationFocus } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Login from './app/auth/login';
import Missing from './app/post/missing';
import Found from './app/post/found';
import Profile from './app/profile';
import Public from './app/post/public';
import Camera from './app/camera';
import Register from './app/auth/register';
import AuthLoadingScreen from './app/auth/authloading';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const rootStack = createBottomTabNavigator({
  Missing: { 
    screen: Missing,
    navigationOptions: {
          tabBarLabel: 'Missing',
          tabBarIcon: ({tintColor, activeTintColor}) => (
             <Icon name={'search'} solid size={30} color={tintColor}/>
             )
        },
  },
  Found: { 
    screen: Found,
    navigationOptions: {
          tabBarLabel: 'Found',
          tabBarIcon: ({tintColor, activeTintColor}) => (
             <FontAwesome5 name={'search-location'} solid size={30} color={tintColor}/>
             )
        },
  },
  Camera: { 
    screen: withNavigationFocus(Camera),
    navigationOptions: {
          tabBarLabel: 'Camera',
          tabBarIcon: ({tintColor, activeTintColor}) => (
             <Icon name={'camera'} solid size={30} color={tintColor}/>
             )
        },
  },
  Public: { 
    screen: Public,
    navigationOptions: {
          tabBarLabel: 'Public',
          tabBarIcon: ({tintColor, activeTintColor}) => (
             <FontAwesome5 name={'user-friends'} solid size={30} color={tintColor}/>
             )
        },
  },
  Profile: { 
    screen: Profile,
    navigationOptions: {
          tabBarLabel: 'Profile',
          tabBarIcon: ({tintColor, activeTintColor}) => (
             <Icon name={'user'} solid size={30} color={tintColor}/>
             )
        },
  },
},
{
  initialRouteName: 'Missing',
  tabBarOptions: {
    activeTintColor: '#108942',
    inactiveTintColor: 'dodgerblue',
    showIcon: true,
    style: { height: 60,backgroundColor: '#fff',borderTopWidth:0.5},
    showLabel: true,
    labelStyle: {
     fontSize: 12,

    }
   }
})

const authStack = createStackNavigator({
  Login,
  Register
},
{
  initialRouteName: 'Login'
})

const switchStack = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: rootStack,
  Auth: authStack
})
const AppContainer = createAppContainer(switchStack)
class App extends React.Component {
  render() {

    return (
     <AppContainer/>
    );
  }
};



export default App;
