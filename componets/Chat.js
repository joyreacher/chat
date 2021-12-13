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


// NetInfo.fetch().then(connection => {
//   if(connection.isConnected){
//     console.log(connection.isConnected + 'OUTSIDE CHAT You ARE Connected To The Internet')
//   } else {
//     console.log(connection.isConnected + 'OUTSIDE CHAT  You ARE NOT Connected To The Internet')
//   }
// })

// Config for chat-app
const firebaseConfig = {
  apiKey: "AIzaSyAkoN3FsqSE-AWET9Mz2VvH38fhlBMoeyg",
  authDomain: "chat-app-8deeb.firebaseapp.com",
  projectId: "chat-app-8deeb",
  storageBucket: "chat-app-8deeb.appspot.com",
  messagingSenderId: "909767210092",
  appId: "1:909767210092:web:495558fb2c88adb4629449",
  measurementId: "G-B9K5P8CW94"
};
// Check for firebase when component mounts
if(!firebase.apps.length){
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
}

// Check users internet connection using NetINfo

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      _isMounted: false,
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

  getMessages(){
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

  componentDidMount() {
    this.setState({ _isMounted: true})
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    const { isConnected } = this.props.route.params
    
      // Setup Firebase auth() to sign users in Anonymously
      this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
        if (!message) {
          await firebase.auth().signInAnonymously()
        }
        // Set the user using Anonymous sign in and props
        this.setState({
          user: {
            _id: message.uid,
            name: this.state.name,
            avatar: 'https://placeimg.com/140/140/any'
          }
        })
        // Observe the users message by uid
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
        this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate)
      })
      this.referenceMessages = firebase.firestore().collection('messages')
    
      // console.log(e)
      // return this.getMessages()
    
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
