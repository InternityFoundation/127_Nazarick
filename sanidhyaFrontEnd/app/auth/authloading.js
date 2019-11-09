import React from 'react';
import { View, ActivityIndicator, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends React.Component {

    componentDidMount() {
        this.CheckLogin()
    }
    CheckLogin = async () => {
        const token = await AsyncStorage.getItem('token');

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