import React ,{PureComponent}from 'react';
import {View, Text, TouchableOpacity, Platform,PermissionsAndroid} from  'react-native';
import Axios from 'axios';
import { RNCamera } from 'react-native-camera';
import styles from '../styles'
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, withNavigationFocus } from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';


class Camera extends PureComponent {
  constructor() {
    super();
    this.state={
      taken: false,
      location:{lat:"",long:""}
    }
    this.takePicture = this.takePicture.bind(this)
  }

  // componentDidMount() {
  //   this.setState({taken: false})
  // }
    render() {
      const { isFocused } = this.props;
      return (
        <View style={styles.container}>
          {isFocused && <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes);
            }}
          />}
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View>
         
        </View>
      );
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
    takePicture = async () => {
      const token = await AsyncStorage.getItem('token')
      if (this.camera) {
        const options = { quality: 0.5, base64: true, orientation: 'landscapeRight' };
        const data = await this.camera.takePictureAsync(options);
        console.log("photo taken")
        alert('Please stay with child for some time concerned authorities will contact you in a while');



        const hasLocationPermission = await this.hasLocationPermission();
        let lastlocation = ''
        if (hasLocationPermission) {

                Geolocation.getCurrentPosition(
                    (position) => {
                      this.setState({lastlocation:position})
                        lastlocation = position
                        console.log(lastlocation);
                    },
                    (error) => {
                        // this.setState({ location: error, loading: false });
                        console.log(error);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
                );
            
        }


        Axios.post('http://192.168.43.209:8500/api/children/imagereco', { base64Data: data.base64 , lat : this.state.lastlocation.coords.latitude, long: this.state.lastlocation.coords.longitude },{
          headers:{
            'Content-Type':'application/json',
            'Authorization':token
          }
        })
          .then(res => {
            console.log(res.data)
            
            // this.setState({taken: true})
            // this.props.navigation.navigate('Result')
          })
          .catch(err => {
            console.warn(err)
          })
        // console.log(data.base64);
      }
    };
  }
  

export default Camera;