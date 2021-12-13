import React, { Component } from 'react'

// react native specific components
import { StyleSheet, Platform, View, Pressable, KeyboardAvoidingView, Text } from 'react-native'

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
// If there is a firebase app initialized. Load it.
if(firebase.apps.length){
  firebase.app()
} else{
  // If there is NOT a firebase app initialized. Initialize it.
  firebase.initializeApp(FireBaseConfig)
}

// Check users internet connection using NetINfo

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
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
      this.showToast('error', 'No messages for user')
      console.log('getMessages() errorr')
      console.log(e.messages)
    }
  }
  // Iterates through message data stored in asyncStorage to return the user with the same name
  findUser() {
    const { name } = this.props.route.params
    // Copy the AsyncStorage parsed array
    let messages = this.state.messages.map(user => {return user})
    // If the user had no messages saved error toast will show
    if(messages = []){
      return this.showToast('error', 'You are offline', 'No messages to show')
    }
    messages.map(message => {
      if(message.user.name === name){
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
    })
  }
  // Authenticates the user if there is an internet connection
  // Loads and filters asyncStorage data if not
  async componentDidMount () {
    this.setState({_isMounted: true})
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    await this.checkInternet()
    await this.getMessages()
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
      return this.findUser()
    }
    // Authenticate user
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
      try{
        await this.showToast('info', 'Authenticating')
        if (!message) {
          return await Promise.resolve(firebase.auth().signInAnonymously())
        }
        this.setState({ user: { _id: message.uid, name: name, avatar: "https://placeimg.com/140/140/any"}})
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
        this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate) 
        if(this.state.user.name === ''){
          return this.showToast('success', `👍 Hello`, "Enter your name on Start screen to see stored messages")
        }
        this.showToast('success', `👍 Hello ${this.state.user.name}`, "Turn off internet to see stored messages")
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
      createdAt: messages[0].createdAt
    })
  }
  render () {
    // store the prop values that are passed
    const { color } = this.props.route.params
    return (
      <View style={[{ backgroundColor: color }, view.outer]}>
        {/* FOR TESTING PURPOSES ONLY */}
        <Pressable 
            onPress={() => this.deleteMessages()}
          >
          <Text>Delete AsyncStorage</Text>
        </Pressable>
        {/* MAIN UI */}
        <GiftedChat
        // Add the prop necessary to change the bubble color
          showUserAvatar={true}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={
            this.state.user
          }
          renderInputToolbar={messages => this.renderInputToolBar(messages)}
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
