import React, { Component } from 'react'

// Expo
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'

// react native specific components
import { Animated, StyleSheet, Platform, View, Pressable, KeyboardAvoidingView, Text, Image } from 'react-native'

// Gifted chat
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

// Firebase
import * as firebase from 'firebase'
require('firebase/firestore')

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

// NetInfo
import NetInfo from '@react-native-community/netinfo'
import reactotron from 'reactotron-react-native'

// Firestore credentials
import FireBaseConfig from '../firestore/config'

//React Toast
import Toast from 'react-native-toast-message'

// Components
import CustomActions from './CustomActions'
import Buttons from './Buttons'
// If there is a firebase app initialized. Load it.
if(!firebase.apps.length){
  // firebase.app()
  firebase.initializeApp(FireBaseConfig)
}
//  else{
//   // If there is NOT a firebase app initialized. Initialize it.
//   firebase.initializeApp(FireBaseConfig)
// }

// Check users internet connection using NetINfo

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null,
      _isMounted: Boolean,
      status: '...',
      messages: [],
      botMessages: [],
      isConnected: Boolean,
      user: {
        _id: '',
        name: '',
        avatar:''
      }
    }
  }
  // Show react toast message 
  showToast = async (type, text1, text2) => {
    Toast.show({
      type: type,
      text1:text1,
      text2: text2
    })
  }
  // Checks internet connection | returns isConnected State w/Bool
  async checkInternet(){
    if(this.state._isMounted){
      return NetInfo.fetch().then(connection => {
        if(connection.isConnected === true){
          this.setState({
            isConnected: true,
            status: 'now online'
          })
          return true
        } else {
          this.showToast('error', "You have lost internet connection", "Enter your name on start screen to retrieve messages in storage")
          this.setState({
            isConnected: false,
            status: 'now offline'
          })
          return false
        }
      })
    }
  }
  // Updates data with snapshot | returns message state with total number of messages in firebase db
  onCollectionUpdate = (querySnapShot) => {
    const { name } = this.props.route.params
    // Set system message on every snapshot
    let messages = [
      {
        _id: 2,
        text: 'Hello ' + name + ' you are ' + this.state.status,
        createAt: new Date(),
        system: true
      },
      {
        _id: Math.round(Math.random() * 1000000),
        text:"Hello you are " + this.state.status,
        createdAt: new Date(),
        user: {
          _id:Math.floor(Math.random() * 2000) + 1,
          name: 'Bot',
          avatar: 'https://placeimg.com/140/140/any'
        },
      },
    ]
    // go through each document
    querySnapShot.forEach((doc) => {
      // get data
      let data = doc.data()
      messages.push(
        {
          uid: data.uid,
          _id: data._id,
          text: data.text,
          createdAt: new Date(),
          image: data.image || null,
          location: data.location || null,
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
          }
        },
      )
    })
    return this.setState({
      messages,
    }) 
  }
  // Gets messages from asyncStorage (local storage for mobile devices)
  async getMessages(){
    let messages = ''
    try{
      messages = await AsyncStorage.getItem('messages') || []
      this.setState({
        messages: JSON.parse(messages)
      })
    }catch(e){
      // this.showToast('error', 'No messages for user')
      console.log('getMessages() errorr')
      console.log(e.messages)
    }
  }
  // Iterates through message data stored in asyncStorage to return the user with the same name
  async findUser() {
    await this.getMessages()
    const { name } = this.props.route.params
    // Copy the AsyncStorage parsed array
    let messages = this.state.messages.map(user => {return user})
    // If the user had no messages saved error toast will show
    messages.map(message => {
      // console.log(message.user.name)
      if(message.user.name === name && name !== ''){
        console.log(message.user.name)
        this.setState({
          user:{
            _id: message.user._id,
            name: message.user.name,
            avatar: message.user.avatar
          }
        })
        return console.log('found a match')
      }
      if(name === ''){
        this.props.navigation.navigate('Start')
        return this.showToast('error', 'Enter your name when offline')
      }
    })
  }
  // Authenticates the user if there is an internet connection
  // Loads and filters asyncStorage data if not
  async componentDidMount () {
    this.setState({_isMounted: true})
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    await this.checkInternet()
    if(!this.state.isConnected){
      this.setState({
        messages: [
        {
          _id: 2,
          text: 'Hello ' + name + ' you are ' + this.state.status,
          createAt: new Date(),
          system: true
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text:"Hello you are " + this.state.status,
          createdAt: new Date(),
          user: {
            _id:Math.floor(Math.random() * 2000) + 1,
            name: 'Bot',
            avatar: 'https://placeimg.com/140/140/any'
          },
        },
      
        ]
        })
      return await this.findUser()
    }
    await this.getMessages()
    
    // Authenticate user
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
      try{
        // await this.showToast('info', 'Authenticating')
        if (!message) {
          return await Promise.resolve(firebase.auth().signInAnonymously())
        }
        this.setState({ user: { _id: message.uid, name: name, avatar: "https://placeimg.com/140/140/any"}})
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
        this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate) 
        await this.saveMessages()
        if(this.state.user.name === ''){
          // return this.showToast('success', `👍 Hello`, "Enter your name on Start screen to see stored messages")
        }
        // this.showToast('success', `👍 Hello ${this.state.user.name}`, "Turn off internet to see stored messages")
      }catch(e){
        this.showToast('error',` 👎 Could not authenticate`, "Check your internet connection and try again")
      }
    })
  }
  // Terminates observers and asyncronus functions
  componentWillUnmount() {
    this.setState({_isMounted: false})
    // Stop listening to authentication and collection changes
    this.referenceMessagesUser
    this.unsubscribeMessagesUser
    this.referenceMessages
    
  }
  // Control how the message bubbles look
  renderBubble (props) {
    const { contrastColor, textColor } = this.props.route.params
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: `hsl(${textColor})`
          },
          right: {
            color: `hsl(${textColor})`
          }
        }}
        wrapperStyle={
        {
          left: {
            backgroundColor: '#000'
          },
          right: {
            backgroundColor: `hsl(${contrastColor})`
          }
        }
      }
      />
    )
  }
  // Hide the tool bar when there is no internet connection
  renderInputToolBar(props){
    if (this.state.isConnected === false){
      
    } else {
      return(
        <InputToolbar 
          {...props}
        />
      )
    }
  }
  // Function deletes message data saved to AsyncStorage as a string
  async deleteMessages(){
    try{
      await AsyncStorage.removeItem('messages')
      this.setState({
        messages:[]
      })
    }catch(e){
      console.log('delete message error')
    }
  }
  // Function saves message data to AsyncStorage as a string
  async saveMessages(){
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
        .then(() => this.showToast('success', 'Saved message to storage'))
    }catch(e){
      console.log('save message error')
    }
  }
  // Adds messages to messages state using GiftedChat | referanceMessages is used to write messages to firebase
  async onSend(messages = []){
    // messages state will contain the most recent message -- the thread will be stored in AsyncStorage
    this.setState(previousState => ({ messages: GiftedChat.append(previousState.messages, messages) }), () => { this.saveMessages() })
    this.referenceMessages = firebase.firestore().collection('messages')
    await this.referenceMessages.add({
      // set uid to reference a user's message
      uid: this.state.user._id,
      _id: messages[0]._id,
      user: this.state.user,
      text: messages[0].text,
      createdAt: messages[0].createdAt,
      image: this.state.image.url,
      location: messages.location || null,
    })
  }
  // Pick an image from the user's device
  pickImage = async () => {
    /*
      ? launchImageLibraryAsync returns object containing uri
      ? cancelled which is true if the user cancels the process and doesnt pick a file
    */
    // Ask permission
    const { status }  = await Camera.requestCameraPermissionsAsync()
    //? if permission IS granted
    if(status === 'granted'){
        //? Call launchImageLibraryAsync to let them pick a file
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images'}).catch(error => console.log('launch image Lib Async error'))
        //? Update image state if request is not cancelled
        if(!result.cancelled){
          console.log(result)
          this.setState({
            image: {
              height: result.height,
              type: result.type,
              uri: result.uri,
              url: ''
            }
          })
          const URL = await this.uploadImageFetch(result.uri)
          this.state.image.url = URL
        }
    }
  }
  // Take a photo with users device
  async takePhoto() {
    const { status } = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
      if (!result.cancelled) {
        this.setState({
          image: result
        });
      }
    }
  }
  // Custom actions
  renderCustomActions = (props) => {
    return <CustomActions
      // Add functions as props
      getLocation={this.getLocation}
      pickImage={this.pickImage} 
      takePhoto={this.takePhoto}
      {...props} 
    />
  }
  // Get location
  getLocation = async() => {
    // const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND)
    const { status } = await Location.requestForegroundPermissionsAsync()
    console.log(status)
    if(status === 'granted'){
      let result = await Location.getCurrentPositionAsync()
      console.log(result)
      if(result){
        this.setState({
          location: result
        })
      }
    }
  }
  // uploadImageFetch takes a selected image's uri
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError("Network request failed"))
      }
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true)
      xhr.send(null)
    })
    // Runs while blob is working
    const imageNameBefore = uri.split('/')
    const imageName = imageNameBefore[imageNameBefore.length - 1]
    // Reference to the image storage
    // const ref = firebase.storage().ref().child(`gs://chat-app-8deeb.appspot.com/${imageName}`)
    const ref = firebase.storage().ref().child(`images/${imageName}`)
    
    const snapshot = await ref.put(blob)
    
    blob.close()
    return await snapshot.ref.getDownloadURL()
  }
  // Main render 
  render () {
    // store the prop values that are passed
    const { color } = this.props.route.params
    return (
      <View style={[{ backgroundColor: color }, view.outer]}>
        {/* <Buttons
          // Add functions as props
          getLocation={this.getLocation}
          pickImage={this.pickImage} 
          takePhoto={this.takePhoto}
        /> */}
        {/* MAIN UI */}
        {/* //!TEST MAP VIEW */}
        {this.state.location && <MapView
          style={{width: 300, height: 300}}
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />}
        {/* //!TEST IMPORT IMAGE */}
        {/* {this.state.image && <Image source={{ uri: this.state.image.uri }} style={{ width: 200, height: 200 }} />} */}
        <GiftedChat
          showUserAvatar={true}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={
            this.state.user
          }
          renderInputToolbar={messages => this.renderInputToolBar(messages)}
          renderActions={() => this.renderCustomActions()}
        />
        {/* Condition that checks for Android OS to use KeybordAvoidingView /> */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
      </View>

    )
  }
}

export default Chat

/**
 * Style variables follow component names
 */
const view = StyleSheet.create({
  outer: {
    flex: 1
  }
})
