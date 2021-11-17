import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
class Start extends Component {
  constructor(props){
    super(props)
    this.state = {
      name:''
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>hello</Text>
        <TextInput 
          onChangeText={(text) => this.setState({name: text})}
        />
        <Button 
          title='Go to chat'
          onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name})}
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
