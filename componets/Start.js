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
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setState(!this.state.modalVisible);
          }}
        >
        {/* main modal section */}
        <View style={styles.innerModal}>
        
          {/* close button */}
          <View style={[styles.selectionContainer, styles.header]}>
            <Text>Set UI Background</Text>
            <Button
              title='Close'
              onPress={() => this.handleModal()}
            />
          </View>

          {/* color selction */}
          <View style={styles.colorSelectionContainer}>
            <View 
              style={styles.purple}
            />
            <View
              style={styles.orange}
            />
          </View>
          
        </View>
        </Modal>
      <ImageBackground
        source={image}
        resizeMode='cover'
        style={styles.image}
      >
        {/* navbar */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Chat</Text>
          <Pressable onPress={() => this.handleModal()}>
            <Text style={styles.headerText}>Colors</Text>
          </Pressable>
          
        </View>

          {/* input */}
        <View style={styles.main}>
          <TextInput 
                style={styles.input}
                onChangeText={(text) => this.setState({name: text})}
              />
        </View>
        {/* call to action */}
        <View style={styles.containerCta}>
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
  containerCta:{
    position:'relative',
    bottom:50,
    height:270,
    width:300,
    alignSelf:'center',
    padding:23,
    backgroundColor:'black',
    shadowOpacity:.5,
    shadowRadius:7,
    shadowColor:'black',
    shadowOffset:{
      width:-6,
      height:8
    },
    borderRadius:22
  },
  colorSelectionContainer:{
    marginTop:100,
    flex:1,
    flexDirection:'row',
    justifyContent:'space-evenly',
    flexWrap:'wrap',
    width:'100vw',
    width:300,
    maxWidth:'100%'
  },
  selectionContainer:{
    flex:1,
    alignItems: "center",
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom:100
  },
  container: {
    flex:1,
    justifyContent:'space-around',
  },
  innerModal:{
    flex:1,
    // flexDirection:'row',
    margin: 20,
    borderRadius: 20,
    padding:25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  header:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    position:'relative',
    alignSelf:'stretch',
    justifyContent:'space-between',
    top:0,
    maxHeight:'10%',
    width:'100%',
    paddingTop:15,
    paddingLeft:20,
    paddingRight:20
  },
  headerText:{
    color:'white',
    fontSize: 25
  },
  main:{
    height:100
  },
  cta:{
    marginBottom:150
  },
  // button text
  text:{
    color:'black',
    fontSize:35
  },
  input:{
    borderRadius:5,
    backgroundColor:'white',
    width:300,
    height:50
  },
  image: {
    flex:1,
    // flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  button:{
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
  }
});
