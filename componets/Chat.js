import React, { Component } from 'react'

// react native specific components
import { StyleSheet, Platform, View, Pressable, KeyboardAvoidingView } from 'react-native'

// Gifted chat
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

// Firebase
import * as firebase from 'firebase'
require('firebase/firestore')


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

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      user: {
        _id: null,
        name: '',
        avatar:''
      }
    }
  }
  // Pull message data
  onCollectionUpdate = (querySnapShot) => {
    const { name } = this.props.route.params
    // Message array always set with system message
    const messages = [
      {
        
        _id: 2,
        text: 'Hello ' + name + ' you are now chatting.',
        createAt: new Date(),
        // Make this message appear in the middle of the chat screen
        system: true
      
      }
    ]
    // go through each document
    querySnapShot.forEach((doc) => {
      // get data
      let data = doc.data()
      // format date
      let date = new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US')
      messages.push(
        {
        uid: data.uid,
        text:data.text,
        createdAt: date ,
        // Mock user
        user: {
          _id: 2,
          name: 'Brian',
          avatar: 'https://placeimg.com/140/140/any'
          }
        }
      )
    })
    this.setState({
      messages,
    }) 
  }

  componentDidMount () {
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    // Setup Firebase auth() to sign users in Anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
      if(!message){
        await firebase.auth().signInAnonymously()
      }
      // Set the user using Anonymous sign in and props
      this.setState({
        user:{
          _id: message.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any'
        }
      })
      // Observe the users message by uid
      
      // this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
      this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
      
      // Calls the onSnapShot 
      this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate)  
    })
    this.referenceMessages = firebase.firestore().collection('messages')
  }

  componentWillUnmount() {
    // Stop listening to authentication and collection changes
    this.unsubscribeMessagesUser
    this.referenceMessages
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

  async onSend(messages = []){
    // Adds user messages (right side)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
    // Write to Firebase
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
    await this.referenceMessages.add({
      uid: messages[0]._id,
      user:this.state.user,
      text:messages[0].text ,
      createdAt: new Date()
    })
  }
  render () {
    // store the prop values that are passed
    const { name, color } = this.props.route.params
    return (
      <View style={[{ backgroundColor: color }, view.outer]}>
        <GiftedChat
        // Add the prop necessary to change the bubble color
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
            name: name,
            avatar: 'avatar value on 194'
          }}
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
