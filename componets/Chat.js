import React, { Component } from 'react';

// react native specific components
import { StyleSheet, Platform, View, Pressable, KeyboardAvoidingView } from 'react-native';

// Gifted chat
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

/**
   * @name renderBubble(props)
   * @summary Takes props given from the start screen
   * 
   * @param string
   * @returns string
   * Application chat screen: Displays the selected background color along with the users name
      entered on the Start.js screen
*/
class Chat extends Component {
  constructor(props){
    super()
    /**
     * Messages state initialized with empty array
     */
    this.state = {
      messages: []
    }
  }
  /* 
    componentDidMount does 2 things:
      1) Adds what the user types in the textbox to the top of the chat screen
      2) Set the name variable with the same textbox value to use in render()
      !IMPORTANT setOptions needs to be in component did mount to avoid console errors
  */
  componentDidMount() {
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
    /**
      When using Gifted Chat, each message needs to have an ID, creation date, and user object
      The user object requires user ID, name, and avatar.
      More https://github.com/FaridSafi/react-native-gifted-chat
     */
    this.setState({
      messages:[
          {
          _id:1,
          text: 'Hello ' + name,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any'
          }
        },
          {
            _id: 2,
            text: 'Hello ' + name,
            createAt: new Date(),
            // Make this message appear in the middle of the chat screen
            system: true
          }
      ]
    })
  }

  renderBubble(props) {
    return(
      <Bubble
      {...props}
      textStyle={{
        left: {
          color: 'yellow'
        }
      }}
      wrapperStyle={
        {
          left: {
            backgroundColor: '#000'
          }
        }
      }
      />
    )
  }

  render() {
    // store the prop values that are passed
    let { name, color } = this.props.route.params
    return (
      <View style={view.outer}>
        <GiftedChat
        // Add the prop necessary to change the bubble color
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id:1
        }} />
        {/* Condition that checks for Android OS to use KeybordAvoidingView /> */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
      </View>
      
    )
  }
}

export default Chat;

/**
 * Styles follow component names
 */
const view = StyleSheet.create({
  outer:{
    flex:1
  }
});
const giftedChat = StyleSheet.create({});
