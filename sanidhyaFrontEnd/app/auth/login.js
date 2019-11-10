import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import styles from '../styles'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal'; 




class Login extends React.Component {
    constructor(props) {
        super(props);
        OneSignal.init("b874ca8d-278b-4a27-a17b-2a3d98d3da42");

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        this.state = {
            serverData: '',
            email: '',
            password: '',
            isLoading: true,
            error: {},
        }
        this.checkLogin = this.checkLogin.bind(this);
        this.signup = this.signup.bind(this)

    }
    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        this.setState({isSetId: false})
      }
    
      onReceived(notification) {
        console.log("Notification received: ", notification);
      }
    
      onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
      }
      onIds(device) {
        AsyncStorage.setItem('deviceId', device.userId);
        //   this.setid(device.userId)
        //this.setState({deviceid: device.userId, isSetId: true})
        // console.log('Device info: ', device);
      }
    setToken = async (token,id, auth) => {
        // console.log(typeof id, "asdf" )
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userid', id);
        await AsyncStorage.setItem('authstatus',auth )
    }
     checkLogin = async () => {
        
        const loginDetail = {
            email: this.state.email,
            password: this.state.password,
            deviceid: await AsyncStorage.getItem('deviceId')
        }
        // if(loginDetail.email == 'piyush.bhargav70@gmail.com' && loginDetail.password == '123456') {
        //     this.setToken('abc');
        //         this.props.navigation.navigate('Missing');
        // }
        axios.post('http://192.168.43.209:8500/api/users/login', loginDetail)
            .then(res => {
                console.log(res.data)
                this.setState({ serverData: res.data })
                this.setToken(res.data.token,res.data.user._id.toString(), res.data.user.authorisation.toString());
                this.props.navigation.navigate('Missing');
            })
            .catch(err => {
                this.setState({ errors: errors.response.data })
            })

    }
    signup() {
        this.props.navigation.navigate('Register')
    }

    render() {

        return (

            <View style={styles.loginView}>
                <Text style={styles.heading}>
                    Login to App
                </Text>
                <TextInput placeholder="Email" style={styles.input} onChangeText={(text) => this.setState({ email: text })} />
                <TextInput placeholder="password" secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({ password: text })} />
                 <Button color='red' title="login" onPress={this.checkLogin} />
                 <Text>Don't Have an account! </Text><TouchableOpacity onPress={this.signup}><Text style={{color: 'red', fontSize: 18}}>SignUp</Text></TouchableOpacity>
                
            </View>
        )
    }
}
export default Login