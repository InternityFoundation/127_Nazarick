import React ,{PureComponent}from 'react';
import {View, Text, TouchableOpacity} from  'react-native';
import Axios from 'axios';
import { RNCamera } from 'react-native-camera';
import styles from '../styles'

class Camera extends PureComponent {
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
            flashMode={RNCamera.Constants.FlashMode.on}
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
  
    takePicture = async () => {
      if (this.camera) {
        const options = { quality: 0.5, base64: true, orientation: 'landscapeRight' };
        const data = await this.camera.takePictureAsync(options);
        Axios.post('http://192.168.43.181:5000/api/posts/imagereco', { base64Data: data.base64 })
          .then(res => {
            console.log(res.data)
          })
          .catch(err => {
            console.warn(err)
          })
        console.log(data.base64);
      }
    };
  }
  
export default Camera;