import React, { Component } from 'react';

// react native specific components
import { StyleSheet, Text, View, Button } from 'react-native';
class Chat extends Component {
  constructor(props){
    super()
  }
  render() {
    // name holds the name value from the route prop/hook
    let { name } = this.props.route.params
    // Add the name to top of screen
    this.props.navigation.setOptions({ title: name})
    return (
      <View style={styles.container}>
        <Text>CHAT</Text>
        {/* using the 'name' container */}
        <Text>
          {name}
        </Text>
        <Button
          title='Go back'
          // calls on the navigation's navigate prop.
          // Navigates you to 'Start'
          onPress={() => this.props.navigation.navigate('Start')}
        >
        </Button>
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
