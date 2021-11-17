import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
class Start extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>hello</Text>
        <Button 
          title='Go to chat'
          onPress={() => this.props.navigation.navigate('Chat')}
        />
      </View>
    );
  }
}

export default Start;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
