import React from 'react';
import {View, Text, Button} from  'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Profile extends React.Component {

    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this)
    }

    async handleLogout(){
        await AsyncStorage.removeItem('token');
        this.props.navigation.navigate('Auth')
    }
    render() {
        return(
            <View>
                <Text>
                    This is Profile route
                </Text>
                <Button title='Logout' onPress={this.handleLogout}/>
            </View>
        )
    }
}
export default Profile;