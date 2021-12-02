import React, { Component } from 'react';

// react native specific components
import { StyleSheet, Text, View, Pressable } from 'react-native';

// Gifted chat
import { GiftedChat } from 'react-native-gifted-chat'

/* 
  Application chat screen: Displays the selected background color along with the users name
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
    /**
      When using Gifted Chat, each message needs to have an ID, creation date, and user object
      The user object requires user ID, name, and avatar.
      More https://github.com/FaridSafi/react-native-gifted-chat
     */
    this.setState({
      messages:[{
        _id:1,
        text: 'Hello Developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      }]
    })
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
  }
  render() {
    // store the prop values that are passed
    let { name, color } = this.props.route.params
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id:1
        }} />
    )
  }
}

export default Chat;

const styles = StyleSheet.create({});
