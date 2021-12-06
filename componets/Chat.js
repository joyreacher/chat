import React, { Component } from 'react'

// react native specific components
import { StyleSheet, Platform, View, Pressable, KeyboardAvoidingView } from 'react-native'

// Gifted chat
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

// Firebase
// const firebase = require('firebase')
import * as firebase from 'firebase'
require('firebase/firestore')

/**
   * CHAT SCREEN FUNCTIONS
   * =====================
   *
   * @name renderBubble(props)
   * @summary Takes props given from the start screen
   * @param string
   * @returns string
   *
   * @name componentDidMount()
   * @summary Adds what the user types in the textbox to the top of the chat screen
   *          Set the name variable with the same textbox value to use in render()
   *
   * @name Chat
   * @summary Application chat screen: Displays the selected background color along with the users name
   *          entered on the Start.js screen
   *
   * @name onSend(props)
   * @summary Used to send/add messages to messages state
   * @param string
   * @returns string
*/
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
    // Messages state initialized with empty array
    this.state = {
      messages: []
    }
  }
  // Pull message data
  onCollectionUpdate = (querySnapShot) => {
    const messages = []
    // go through each document
    querySnapShot.forEach((doc) => {
      // get data
      
      // format date
      let data = doc.data()
      let date = new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US')
      messages.push({
        _id: data.uid,
        text:data.text,
        createdAt: date ,
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      })
    })
    this.setState({
      messages,
    }) 
  }

  async componentDidMount () {
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    
    // Setup Firebase auth() to sign users in Anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (message) => {
      if(!message){
        await firebase.auth().signInAnonymously()
      }
      
      // Reference the users message by uid
      this.referenceMessagesUser = firebase.firestore().collection('messages')
      
      // Calls the onSnapShot 
      this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate)  
    })

    this.referenceMessagesUser = firebase.firestore().collection('messages')
    
    
    // this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate)  
    
    /**
      When using Gifted Chat, each message needs to have an ID, creation date, and user object
      The user object requires user ID, name, and avatar.
      More https://github.com/FaridSafi/react-native-gifted-chat
     */
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello ' + this.state.text,
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any'
    //       }
    //     },
    //     {
    //       _id: 2,
    //       text: 'Hello ' + name + ' you are now chatting.',
    //       createAt: new Date(),
    //       // Make this message appear in the middle of the chat screen
    //       system: true
    //     }
    //   ]
    // })
  }

  componentWillUnmount() {
    // Point to the snapShot
    this.unsubscribeMessagesUser
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

  onSend(messages = []){
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
    console.log('line 176')
    console.log(messages[0]._id)
    this.referenceMessagesUser.add({
      uid: messages[0]._id,
      user:messages[0].user,
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
