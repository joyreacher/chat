import React, { Component } from 'react';
import { StyleSheet, Alert, Text, View, ImageBackground, TextInput, Button, Pressable, Modal} from 'react-native';
// background image
const image = require('../assets/project_assets/bg.png')
class Start extends Component {
  constructor(props){
    super(props)
    this.state = {
      name:'',
      modalVisible: false
    }
  }
  handleModal = () => {
    if(!this.state.modalVisible){
      return this.setState({modalVisible: true})
    }else{
      return this.setState({modalVisible:false})  
    }
    
  }

  render() {
    return (
      <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode='cover'
        style={styles.image}
      >
        {/* input */}
        <View style={styles.main}>
          <Text style={styles.title}>
            Chat
          </Text>
        </View>
        {/* call to action */}
        <View style={styles.containerCta}>
        <TextInput 
          placeholder='Enter Your Name'
          style={styles.input}
          onChangeText={(text) => this.setState({name: text})}
        />
        <View style={styles.colorSelectionContainer}>
          <Text>Choose a background color:</Text>
          <View style={styles.colorSelection}>
            {/* color selction */}
              <View 
                style={styles.purple}
              />
              <View
                style={styles.orange}
              />
              <View
                style={styles.green}
              />
          </View>
        </View>
          <View style={styles.cta}>
            <Pressable style={styles.button} onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name})}>
                <Text
                style={styles.text}
                >Go to Chat
              </Text>
            </Pressable>
          </View>      
        </View>
        
      </ImageBackground>
      </View>
    );
  }
}

export default Start;

const styles = StyleSheet.create({
  colorSelectionContainer:{
    marginTop:30,
    marginBottom:0,
    
  },
  colorSelection:{
    marginTop:15,
    marginBottom:40,
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-end',
    flexWrap:'wrap',
  },
  containerCta:{
    position:'relative',
    bottom:50,
    height:300,
    width:300,
    alignSelf:'center',
    padding:23,
    backgroundColor:'white',
    shadowOpacity:.5,
    shadowRadius:7,
    shadowColor:'black',
    shadowOffset:{
      width:-6,
      height:8
    },
    borderRadius:22
  },
  container: {
    flex:1,
    justifyContent:'space-around',
  },
  centeredView: {
    flex: 1,
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  main:{
    height:100,
    flex:1,
    justifyContent:'center'
  },
  cta:{
    marginBottom:150
  },
  // button text
  text:{
    color:'black',
    fontSize:35
  },
  title:{
    color:'white',
    fontSize: 56
  },
  input:{
    padding:10,
    borderWidth:1,
    borderColor:'black',
    borderRadius:5,
    backgroundColor:'white',
    height:50
  },
  image: {
    flex:1,
    // flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  button:{
    marginTop:50,
    backgroundColor:'whitesmoke',
    padding:10,
    borderRadius:10
  },
  purple :{
    backgroundColor: 'purple',
    width:50,
    height:50,
    borderRadius: 50
  },
  orange :{
    backgroundColor: 'orange',
    width:50,
    height:50,
    borderRadius: 50
  },
  green :{
    backgroundColor: 'green',
    width:50,
    height:50,
    borderRadius: 50
  }
});
