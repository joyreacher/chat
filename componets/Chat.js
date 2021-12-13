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

// For testing purposes | See what is stored in AsyncStorage
import reactotron from 'reactotron-react-native'

// Firestore credentials 
import firebaseConfig from '../firestore/config'


// Check for firebase when component mounts
if(firebase.apps.length){
  firebase.app()
} else {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
}


class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isConnected: null,
      isMounted: false,
      status: '',
      name: '',
      messages: [],
      isConnected: '',
      user: {
        _id: null,
        name: '',
        avatar:''
      }
    }
  }
  
  // Checks network connection with Netinfo | Sets isConnected state based on response
  // isMounted needs to be true
  async checkInternet(){
    if(this.state.isMounted){
      return NetInfo.fetch().then(connection => {
        if(connection.isConnected === true){
          this.setState({
            isConnected: true,
            status: 'now chatting'
          })
          return true
        } else {
          this.showToast('error', "It seems you have lost internet connection", "We'll try to reconnect you. Or you can refresh this page.")
          this.setState({
            isConnected: false,
            status: 'now offline'
          })
          return false
        }
      })
    }
  }

  // Pull message data
  onCollectionUpdate = (querySnapShot) => {
    // Set system message on every snapshot
    let messages = [
      {
        _id: 0,
        text: 'Hello ' + this.state.name + ' you are now chatting.',
        createAt: new Date(),
        system: true
      }
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

  async getMessages(){
    let messages = ''
    // Sets the system message
    const SystemMessage = {
      _id: 2,
      text: 'Hello ' + this.state.name + ` you are ${!this.state.status ? '...' : this.state.status}`,
      createAt: new Date(),
      system: true
    }
    // Try to get new messages
    try{
      messages =  AsyncStorage.getItem('messages') || []
      console.log(messages)
      if(this.state.isConnected){  
        return this.setState({
          isConnected: true,
          messages: messages.length === 0 ? [SystemMessage] : JSON.parse(messages),
          status: ' now chatting'
        })
      } else{
        messages = messages.length === 0 ? [] : JSON.parse(messages)
        return this.setState({
          isConnected: false,
          messages: messages.length === 0 ? [SystemMessage] : messages,
          status: ' now offline'
        })
      }
      
      // NetInfo.fetch().then(connection => {
      //   if(connection.isConnected != false){
      //     return this.setState({
      //       isConnected: true,
      //       messages: messages.length === 0 ? [SystemMessage] : JSON.parse(messages),
      //       status: ' now chatting'
      //     })
      //   } else {
      //     messages = messages.length === 0 ? [] : JSON.parse(messages)
      //     return this.setState({
      //       isConnected: false,
      //       messages: messages.length === 0 ? [SystemMessage] : JSON.parse(messages),
      //       status: ' now offline'
      //     })
      //   }
      // })
      
      
    }catch(e){
      console.log('getMessages() errorr')
      console.log(e)
    }
  }
  
  async componentDidMount() {
    // Set isMounted state
    this.setState({isMounted: true})
    // Get values from Start page
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    //! Get messages sets messages state
    await this.getMessages()
    // Sets isConnected and status state based on Netinfo
    await this.checkInternet()
    if(!this.state.isConnected){
      // console.log('isConnected is false')
      return this.findUser()
    }
    // Authenticate user
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
      try{
        if (!message) {
          return await Promise.resolve(firebase.auth().signInAnonymously())
        }
        // Set the user state | filters messages (left/right, receiver/sender)
        this.setState({ user: { _id: message.uid, name: name, avatar: "https://placeimg.com/140/140/any"}})
        // Create a reference to the sender's uid from anonymously signing in
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
        // Snapshot will run onCollectionUpdate to update message feed
        this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate) 
        // Add the UI message to let user know they've signed in
        this.showToast('success', `👍 Hello ${this.state.user.name}`, "To see your messages offline: Enter your name on Start screen")
      }catch(e){
        // Show when the user could not be signed in
        this.showToast('success', `👎  Could not sign you in`, "Try refreshing your page")
      }
    })
  }


  // componentDidMount (messages = []) {
  //   const { name, isConnected } = this.props.route.params
  //   this.setState({
  //     name: name,
  //     isConnected: isConnected
  //   })
  //   this.props.navigation.setOptions({ title: this.state.name })
  //   console.log(this.state.isConnected + ' Connected did mount')
     
  //     // Observe all messages
  //     this.referenceMessages = firebase.firestore().collection('messages')
  // }

  componentWillUnmount() {
    // Stop listening to authentication and collection changes
    this.referenceMessagesUser
    this.unsubscribeMessagesUser
    this.referenceMessages
    this.getMessages()
  }

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
      this.props.navigation.navigate('Start')
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

  onSend(messages = []){
    // Stores messages in local storage
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => { this.saveMessages() })
    /**
      {
        uid: number
        text: string
        createdAt: timestamp
        user: user state object
          {
            _id: number
            name: string
            avatar: string
          }
      }
     */
    // Sets the message to the user sends
    this.referenceMessages.add({
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
        <Pressable
          onPress={() => this.deleteMessages()}
        >
          <Text>Delete Messages</Text>
        </Pressable>
        <Pressable
          onPress={() => this.getMessages()}
        >
          <Text>Get Messages</Text>
        </Pressable>
        <GiftedChat
        // Add the prop necessary to change the bubble color
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
