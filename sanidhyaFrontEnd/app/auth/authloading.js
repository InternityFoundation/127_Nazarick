import React from 'react';
import { View, ActivityIndicator, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

class AuthLoadingScreen extends React.Component {

    componentDidMount() {
        this.CheckLogin()
    }
    CheckLogin = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('test',token)
        Axios.defaults.headers.common['Authorisation'] = token
        this.props.navigation.navigate(token ? 'App' : 'Auth')
    }
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle='default' />
            </View>
        )
    }
}
export default AuthLoadingScreen;