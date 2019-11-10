import React from 'react';
import {View, Text, Button, TouchableOpacity} from  'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

class Profile extends React.Component {

    constructor() {
        super();
        this.state ={
            profile: {}
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    async handleLogout(){
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('authstatus');
        this.props.navigation.navigate('Auth')
    }
    async componentDidMount() {
        const token = await AsyncStorage.getItem('token')
        Axios.get('http://192.168.43.209:8500/api/users/current',{
            headers: {
                'Authorization': token
            }
        })
        .then(res=>{
            console.log(res)
            this.setState({profile: res.data})
        })
        .catch(err=>console.log(err))
    }
    render() {
        return(
            <View style={{flex:1}}>

            <Text style={{flex:1,color:'dodgerblue', fontSize:50, textAlign:'center',marginTop:50}}>Profile Info</Text>

            <View style={{flex:1, justifyContent: 'center', alignItems: 'center' , marginTop:-1200}}>
                <Text style={{fontSize: 20}}>
                   Name:- {this.state.profile.name}
                </Text>
                <Text style={{fontSize: 20}}>
                   contact:- {this.state.profile.contact}
                </Text>
                <Text style={{fontSize: 20}}>
                   Email:- {this.state.profile.email}
                </Text>
                <TouchableOpacity onPress={this.handleLogout} style={{flex:0, backgroundColor :"dodgerblue", borderRadius:3,padding:15,paddingHorizontal:20, alignSelf:'center', margin:50, width: 140}}>
              <Text style={{ fontSize: 20 , color:"white", textAlign: 'center'}}> LogOut</Text>
            </TouchableOpacity>
            </View>
            </View>
        )
    }
}
export default Profile;