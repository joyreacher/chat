import React, { Component } from 'react'

// Expo
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'

// react native specific components
import { StyleSheet, Platform, View, KeyboardAvoidingView, Text,  ActivityIndicator} from 'react-native'

// Gifted chat
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
//React Toast
import Toast from 'react-native-toast-message'

// Firebase
import * as firebase from 'firebase'
require('firebase/firestore')

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

// NetInfo
import NetInfo from '@react-native-community/netinfo'

// Firestore credentials
import FireBaseConfig from '../firestore/config'


// Components
import CustomActions from './CustomActions'
import reactotron from 'reactotron-react-native'
class Chat extends Component {
  constructor (props) {
    super(props)
    // Initialize Firebase
    if(!firebase.apps.length){
      // firebase.app()
      firebase.initializeApp(FireBaseConfig)
    }
    // Add observer
    this.referenceMessages = firebase.firestore().collection('messages')
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    // Initialize state
    this.state = {
      messages: [],
      uid: 0,
      isConnected: Boolean,
      image: null,
      location: null,
      _isMounted: Boolean,
      status: '...',
      systemMessageDate: new Date(),
      user: {
        _id: '',
        name: name,
        avatar:''
      }
    }
    
  }
  /**
   * @function showToast
   * @param {string} type 
   * @param {string} text1 
   * @param {string} text2 
   */
  showToast = async (type, text1, text2) => {
    Toast.show({
      type: type,
      text1:text1,
      text2: text2
    })
  }
  /**
   * @function setUser()
   * @returns User state Object
   * @param {number} uid 
   * @param {string} avatar 
   */
  setUser(uid, avatar){
    this.setState({
      user: {
        _id: uid,
        name: this.state.user.name,
        avatar:avatar
      }
    })
  }
  /**
   * @function getMessages()
   * @returns Gets messages from asyncStorage (local storage for mobile devices)
   */
  async getMessages(){
    let messages = ''
    try{
      messages = await AsyncStorage.getItem('messages') || []
      this.setState({
        messages: JSON.parse(messages)
      })
    }catch(e){
      this.showToast('error', 'No messages for user')
    }
  }
  /**
   * @function saveMessages()
   * @returns Function saves message data to AsyncStorage as a string
   */
  async saveMessages(){
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
        .then(() => this.showToast('success', 'Saved message to storage'))
    }catch(e){
      this.showToast('info', 'Could not save message to AsyncStorage')
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
      this.showToast('error', 'Could not delete messages')
    }
  }
  /**
   * @function checkInternet()
   * @returns Checks internet connection | returns isConnected State w/Bool
   */
  async checkInternet(){
    return NetInfo.fetch().then(connection => {
      if(connection.isConnected === true){
        this.setState({
          isConnected: true,
          status: 'now online'
        })
        return this.unsubscribe = this.referenceMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
      }
      this.showToast('error', "You have lost internet connection 🤔", "Please refresh the app") 
      return this.setState({
        isConnected: false,
        status: 'now offline'
      })
    
    })
  }
  // Updates data with snapshot | returns message state with total number of messages in firebase db
  onCollectionUpdate = (querySnapShot) => {
    // Set system message on every snapshot
    let messages = [
      {
        _id: 2,
        text: 'Hello ' + this.state.user.name + ' you are ' + this.state.status,
        system: true
      },
      {
        _id: Math.round(Math.random() * 1000000),
        text:`Hello ${this.state.user.name}`,
        createdAt: this.state.systemMessageDate,
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
          createdAt: data.createdAt.toDate(),
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
  /**
   * @function findUser()
   * @returns Iterates through message data stored in asyncStorage to return the user with the same name
   *  If users name matches, messages will show on the right. Otherwise they show on left.
   */
  async findUser() {
    // Retrieve messages in AsyncStorage
    await this.getMessages()
    // Copy the AsyncStorage parsed array
    let messages = this.state.messages.map(user => {return user})
    // If the user had no messages saved error toast will show
    messages.map(message => {
      if(message.user.name === this.state.user.name && this.state.user.name !== ''){
        this.showToast('info', `${message.user.name}'s messages are being served from memory`)
        return this.setState({
          user:{
            _id: message.user._id,
            name: message.user.name,
            avatar: message.user.avatar
          }
        })
      }
    })
  }
  /**
   * @function componentDidMount()
   * @returns Authenticates the user if there is an internet connection
   */
  async componentDidMount () {
    await this.getMessages()
    await this.showToast('info', 'Authenticating') 
    await this.checkInternet().then(async () => {
      if(this.state.isConnected){
      // Authenticate user
      this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (message) => {
          try{
            if (!message) {
              return await Promise.resolve(firebase.auth().signInAnonymously())
            }
            // this.setState({ user: { _id: message.uid, avatar: "https://placeimg.com/140/140/any"}})
            this.setUser(message.uid, "https://placeimg.com/140/140/any")
            this.unsubscribeMessagesUser = this.referenceMessages
              .orderBy('createdAt', 'desc')
              .onSnapshot(this.onCollectionUpdate)
            this.showToast('success', `📣 Hello ${this.state.user.name} 👏`, "Turn off internet to see stored messages")
          }catch(e){
            this.showToast('error',` 👎 Could not authenticate`, "Check your internet connection and try again")
          }
        })
      }
      if(!this.state.isConnected){
        this.findUser()
      }
    })
  }
  /**
   * @function componentWillUnmount()
   * @param object
   * @returns Terminates observers and asyncronus functions
   */
  componentWillUnmount() {
    this.setState({_isMounted: false})
    // Stop listening to authentication and collection changes
    this.referenceMessagesUser
    this.authUnsubscribe
    this.unsubscribeMessagesUser
    this.referenceMessages
    
  }
  /**
   * @function renderInputToolBar()
   * @param object
   * @returns Control how the message bubbles look
   */
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
  /**
   * @function renderInputToolBar()
   * @param object
   * @returns Hide the tool bar when there is no internet connection
   */
  renderInputToolBar(props){
    if (this.state.isConnected === false){
      return
    } else {
      return(
        <InputToolbar 
          {...props}
        />
      )
    }
  }
  /**
   * @function addMessage
   * @returns Adds current message to firebase
   */
  addMessage = async () =>{
    const messages = this.state.messages[0]
    await this.referenceMessages.add({
    // // // //   // set uid to reference a user's message
      uid: this.state.user._id,
      _id: messages._id,
      user: this.state.user,
      text: messages.text || '',
      createdAt: new Date(),
      image: messages.image || null,
      location: this.state.location || null,
    })
  }
  /**
   * @function onSend
   * @returns message data
   */
  onSend = (messages = []) => {
    this.setState(
    (previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    async () => {
      await this.addMessage();
      this.saveMessages();
    }
  )}

  /**
   * @function pickImage
   * @returns message data with image url
   */
  pickImage = async () => {
    // Ask permission
    const { status }  = await Camera.requestCameraPermissionsAsync()
    //? if permission IS granted
    if(status === 'granted'){
        //? Call launchImageLibraryAsync to let them pick a file
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images'}).catch(error => console.log('launch image Lib Async error'))
        //? Update image state if request is not cancelled
        if(!result.cancelled){
          const URL = await this.uploadImageFetch(result.uri)
          this.onSend({
            _id: Math.round(Math.random() * 1000000),
            image: URL,
            user: this.state.user
          });
        }
    }
  }
  /**
   *@function takePhoto
   *@returns URL of an image the user has taken
   */
  takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({mediaTypes: 'Images',}).catch(error => console.log(error));
      if (!result.cancelled) {
        const URL = await this.uploadImageFetch(result.uri)
        this.onSend({
          _id: Math.round(Math.random() * 1000000),
          image: URL,
          user: this.state.user
        });
      }
    }
  }
  // Get location
  getLocation = async() => {
    // const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND)
    const { status } = await Location.requestForegroundPermissionsAsync()
    if(status === 'granted'){
      let result = await Location.getCurrentPositionAsync()
      if(result){
        this.setState({
          location: {
            lat: result.coords.latitude,
            long: result.coords.longitude
          }
        })
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
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.lat,
            longitude: currentMessage.location.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }
  loading = () => {
    const { color, textColor } = this.props.route.params
    return (
      <View style={[loadingView.outer, {
          backgroundColor: !color ? 'white' : color ,
          } ] }>
        <Text style={[loadingView.outer, {color: `hsl(${textColor})`}]}>
          Loading ..
        </Text>
        <ActivityIndicator size='large' color={color}/>
      </View>
    )
  }
  // Main render 
  render () {
    // store the prop values that are passed
    const { color } = this.props.route.params
    return (
      <View style={[{ backgroundColor: color }, view.outer]}>
        <GiftedChat
          showUserAvatar={true}
          renderBubble={this.renderBubble.bind(this)}
          messages={!this.state.messages ? <ActivityIndicator size='large' color={color}/> : this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderLoading={this.loading}
          renderUsernameOnMessage={true}
          user={this.state.user}
          renderInputToolbar={messages => this.renderInputToolBar(messages)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          // renderSystemMessage={this.renderSystemMessage}
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

const loadingView = StyleSheet.create({
  outer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 1900,
    fontSize: 64,
  },
  text: {
    fontSize: 174,
    color: 'white'
  }
})
