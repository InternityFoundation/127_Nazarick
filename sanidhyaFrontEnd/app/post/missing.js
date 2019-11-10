import React from 'react';
import { View, Text, ScrollView, Image, Button, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import styles from '../styles'



class Details extends React.Component {
    render() {
        return (
            <View>
                <Text>
                    this is details route
                </Text>
            </View>
        )
    }
}

class Add extends React.Component {
    constructor(){
        super()
      this.state = {
        photo: '',
        name: '',
        idetification: '',
        age: 0,
      }
    }
    
      handleChoosePhoto = () => {
        console.log("choose")
        const options = {
          noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
          if (response.uri) {
            this.setState({ photo: response })
          }
        })
      }
    
      createFormData = (photo, body) => {
        const data = new FormData();
      
        data.append("photo", {
          name: photo.fileName,
          type: photo.type,
          uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });
      
        Object.keys(body).forEach(key => {
          data.append(key, body[key]);
        });
      
        return data;
      };
       getItem = async() => {
          
          const userid =  await AsyncStorage.getItem("userid");
          console.log(userid,"userid")
          return userid
      }
      handleUploadPhoto = async() => {
        console.log("uploading")
       
            let id=await AsyncStorage.getItem("userid")
            console.log(id, typeof id)
        fetch("http://192.168.43.209:8500/api/children/add/0",{
            method:"POST",
            body: this.createFormData(this.state.photo,{addedby:id.toString(), name: this.state.name, age: this.state.age, identification: this.state.idetification})
        })
        // { 
         
        //   body: this.createFormData(this.state.photo, { addedby: "123" })
        // }
        // )
        //   .then(response => response.data)

          .then(response => {
            console.log("upload succes", response.data);
            alert("Upload success!");
            this.setState({ photo: null });
          })
          .catch(error => {
            console.log("upload error", error);
            alert("Upload failed!");
          });
      };
    
      render() {
        const { photo } = this.state
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{flex:1,color:'dodgerblue', fontSize:40, textAlign:'center',marginTop:20}}>Add Missing Child</Text>
             
            {/* {this.state.photo && (
              <View>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: 300, height: 300 }}/>
                
              </View>
            )} */}
                            <TextInput placeholder="Name" style={styles.input} onChangeText={(text) => this.setState({ name: text })} />
                            <TextInput placeholder="age" style={styles.input} onChangeText={(text) => this.setState({ age: text })} keyboardType='numeric'/>
                            <TextInput placeholder="Identification Marks" style={styles.input} onChangeText={(text) => this.setState({ identification: text })} />
                            {/* <Picker
                    selectedValue={this.state.authorisation}
                    style={{ height: 50, width: 120 }}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ language: itemValue })
                    }>
                    <Picker.Item label="Missing" value="0" />
                    <Picker.Item label="Found" value='1' />
                </Picker> */}
<View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.handleChoosePhoto} style={{flex:0, backgroundColor :"dodgerblue", borderRadius:5,padding:15,paddingHorizontal:20, alignSelf:'flex-end', margin:20}}>
              <Text style={{ fontSize: 14 , color:"white"}}>Choose a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleUploadPhoto} style={{flex:0, backgroundColor :"dodgerblue", borderRadius:3,padding:15,paddingHorizontal:20, alignSelf:'flex-end', margin:20, width: 140}}>
              <Text style={{ fontSize: 20 , color:"white", textAlign: 'center'}}> Report</Text>
            </TouchableOpacity>
            </View>
          </View>
        )
      }
}

class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            data: [],
            image:[],
            isset:false,
            auth:1
        }
        // this.showdetail = this.showdetail.bind(this)
    }
    async componentDidMount() {
        Axios.get('http://192.168.43.209:8500/api/children/0')
        .then(res=> {
            res.data.forEach(ele => {
                Axios.get('http://192.168.43.209:8500/api/children/getimage/'+ele.image)
                        .then(res=>{
                            let arr = this.state.image.concat(res.data)
                            // console.log(arr,'mount')
                            this.setState({image:arr})
                        })
                        this.setState({data: res.data})
        })
        .catch(err=>console.log(err))
        }
        )
        const token = await AsyncStorage.getItem('token')
        const authstatus = await AsyncStorage.getItem('authstatus')
        this.setState({auth: authstatus})
        console.log(authstatus,'asdfgh');
        // Axios.get('http://192.168.43.209:8500/api/users/current',{
        //     headers: {
        //         'Authorization': token
        //     }
        // })
        // .then(res=>{
        //     console.log(res)
        //     this.setState({auth: res.data.authorization})
        // })
        // .catch(err=>console.log(err))
    

}

    // showdetail= async() => {
    //     this.state.data.map(async data =>{
    //         console.log(data)
    //         await AsyncStorage.getItem('imageuri')
    //         return(
    //             <View key={data._id}>
    //                 <Image source ={{uri:imagePath}} style={{width: 50, height: 50}}/>
    //                 <Text>{data.name}</Text>
    //             </View>
    //         )
    //     })
    // }


    //  getimageuri = async() => {
    //     let app = await AsyncStorage.getItem('imageuri')
        // this.setState({
        //     image:app
        // })
    //    .then(data=>{
    //     //    console.log(data,'asyncdata')
    //        return data;
    //    })
    //    Debug.WriteLine("result:: " + app)
    // return app
    // }
    // async setimageuri(res){
    //     await AsyncStorage.setItem('imageuri', res.toString())
    // }
    //  getimages = () => {
    //      let arr = []
    //     this.state.data.forEach(ele => {
    //         Axios.get('http://192.168.43.209:8500/api/children/getimage/'+data.image)
    //                     .then( res=>{
    //                         arr.push
    //                     })
    //     })
    //  }

    render() {
        // console.log(this.state.image[0],'render')
        // this.getimages()
        // return (
        //    <ScrollView>
        //        <Button title = 'add items' onPress = {()=> this.props.navigation.navigate('Add')}/>
        //        {this.state.data.map(async data =>{
        //         //    var data2= ''
        //     // console.log(data)
        //     Axios.get('http://192.168.43.209:8500/api/children/getimage/'+data.image)
        //     .then(async res=>{
        //         // console.log(res.data)
        //         // data2 = res.data
        //         // this.setimageuri(res.data)
        //         await AsyncStorage.setItem('imageuri', res.data.toString())
        //     })
        //     // console.log(data2,'data2')

        //     // const imageuri = this.getimageuri()
        //     const imageuri = await AsyncStorage.getItem('imageuri')
        //     // console.log(imageuri, "123456")
        //     return(
        //         <View>
        //             {
        //                 // console.log(imageuri,'123456')
        //             }
        //             {/* <Image source ={{uri: 'data:image/jpg;base64,'+imageuri}} style={{width: 50, height: 50}}/> */}
        //             {/* <Text>{data.name}</Text> */}
        //         </View>
        //     )
        // })}
        //    </ScrollView>
        // )
        return(
            <View style= {{flex:1}}>
              <Text style={{flex:1,color:'dodgerblue', fontSize:50, textAlign:'center',marginTop:50}}>Missing Child</Text>
                {/* {this.state.auth === '0' ? <Button title = 'add items' onPress = {()=> this.props.navigation.navigate('Add')}/> : <></>} */}
            <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row', marginTop:-1000}}>
                {/* {let i =0} */}
                {this.state.data.map((data,index) =>{
                    {console.log(index)}
                    // Axios.get('http://192.168.43.209:8500/api/children/getimage/'+data.image)
                    //     .then(async res=>{
                    //         await AsyncStorage.setItem('imageuri', res.data.toString())
                    //     })
                    //     const imageuri = this.getimageuri()
                    //     console.log(imageuri,'imag')
                    // AsyncStorage.getItem('imageuri')
                    // .then(res => {
                        //     console.log('hi')
                        // })
                        
                        return(
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    
                    
                    <Image source ={{uri: 'data:image/jpg;base64,'+this.state.image[index]}} style={{width: 150, height: 150}}/> 
                     <Text>{data.name}</Text>
                     {/* {i++} */}
                </View>
            )
        })}
            </View>
            {this.state.auth === '0' ? <TouchableOpacity onPress={()=> this.props.navigation.navigate('Add')} style={{flex:0, backgroundColor :"dodgerblue", borderRadius:5,padding:15,paddingHorizontal:20, alignSelf:'flex-end', margin:20}}>
              <Text style={{ fontSize: 14 , color:"white"}}> Add Item </Text>
            </TouchableOpacity>
            :
            <></>
      }
        </View>
        )
    }
}

const missStack = createStackNavigator({
    Main,
    Add,
    Details
},
    {
        initialRouteName: 'Main'
    }
)

const MissContainer = createAppContainer(missStack)

class Missing extends React.Component {

    render() {
        return (
            <MissContainer />
        )
    }
}
export default Missing;