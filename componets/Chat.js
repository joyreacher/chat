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
    // Set system message on every snapshot
    let messages = [
      {
        _id: 2,
        text: 'Hello ' + name + ' you are now chatting.',
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

  componentDidMount (messages = []) {
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    
    // Setup Firebase auth() to sign users in Anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
      if (!message) {
        return await firebase.auth().signInAnonymously()
      }
      // Set the user using Anonymous sign in and props
      this.setState({
        user: {
          _id: message.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any'
        }
      })
      // Observe the users message by uid
      this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', message.uid)
      this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate)
    })
    
    // Observe all messages
    this.referenceMessages = firebase.firestore().collection('messages')
  }

  componentWillUnmount() {
    // Stop listening to authentication and collection changes
    this.referenceMessagesUser
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
    // Sets the message to the user sends
    await this.referenceMessages.add({
      // set uid to reference a user's message
      uid: this.state.user._id,
      _id: messages[0]._id,
      user:this.state.user,
      text:messages[0].text ,
      createdAt: messages[0].createdAt
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
          user={
            this.state.user
          }
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
