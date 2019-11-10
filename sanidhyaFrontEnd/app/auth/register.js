import React from 'react';
import { View, Text, TextInput, Platform, PermissionsAndroid, Button, Picker } from 'react-native';
import styles from '../styles'
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            lastlocation: {},
            deviceid: '',
            contact: 0,
            authorisation: '',
            loading: true
        }
        this.handleSignup = this.handleSignup.bind(this)
    }
    hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
    }
    async componentDidMount() {
        const hasLocationPermission = await this.hasLocationPermission();

        if (hasLocationPermission) {

            this.setState({ loading: true }, () => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        this.setState({ lastlocation: position, loading: false });
                        console.log(position);
                    },
                    (error) => {
                        this.setState({ location: error, loading: false });
                        console.log(error);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
                );
            });
        }
    }
    async handleSignup() {
        console.warn('signup');
        const signupData = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            lastlocation: this.state.lastlocation,
            contact: this.state.contact,
            deviceid: await AsyncStorage.getItem('deviceId'),
            authorisation: this.state.authorisation == 'Police'? 0 : 1
        }

        // console.log(signupData)
        // this.props.navigation.navigate('Login')
        axios.post('http://192.168.43.209:8500/api/users/register', signupData)
            .then(res => {
                console.log(res.data.user)
                // this.setState({ serverData: res.data })
                // this.setToken(res.data.token);
                this.props.navigation.navigate('Login');
            })
            .catch(err => {
                this.setState({ errors: errors.response.data })
            })
    }
    render() {
        return (
            <View style={styles.loginView}>
                <Text style={{ fontSize: 40, textAlign: 'center' }}>
                    Register
                </Text>
                <TextInput placeholder="Name" style={styles.input} onChangeText={(text) => this.setState({ name: text })} />
                <TextInput placeholder="Email" style={styles.input} onChangeText={(text) => this.setState({ email: text })}  />
                <TextInput placeholder="Contact No." style={styles.input} onChangeText={(text) => this.setState({ contact: text })} keyboardType='numeric'/>
                <TextInput placeholder="Enter Password" secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({ password: text })} />
                <TextInput placeholder="Enter Password Again" secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({ password2: text })} />
                <Picker
                    selectedValue={this.state.authorisation}
                    style={{ height: 50, width: 120 }}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ language: itemValue })
                    }>
                    <Picker.Item label="Police" value="Police" />
                    <Picker.Item label="Public" value="Public" />
                </Picker>
                <Button title="SignUP" style={{}} onPress={this.handleSignup} />
            </View>
        )
    }
}
export default Register;