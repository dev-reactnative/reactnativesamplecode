import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, Platform, Button} from 'react-native';
import Navbar from '../../components/Navbar'
import FontText from '../../components/FontText';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { registerCustomer, handleFacebookLogin } from '../../api/customers';

const {height, width} = Dimensions.get('window');
const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);


export default class SignUp extends React.Component {

  static navigationOptions = {
    // title: 'Welcome',
    headerMode: 'none',
    header: null,
  };

  // static navigationOptions = {
  //     title: 'Home',
  //     header:{ visible:false }
  //   };

    constructor(props) {
        super(props);

        this.state = {
          animating: true,
          static_value : ''
        }
    }

    onFBLogin() {
      const {navigate} = this.props.navigation;
      console.log('Calling FB auth');
      let response = handleFacebookLogin(navigate);
      this.setState({
        static_value : response
      })
    }


    // onSignUp() {
    //     console.log('Calling API with this.state', this.state);
    //     const data = this.state
    //     console.log('data: ', data);
    //     const response = registerCustomer(data);
    //     const { navigate } = this.props.navigation;
    //     navigate('Creditlink1');
    // }
    //navigation:
  //   static navigationOptions = {
  //   title: 'Kue Signup',
  // };

    render() {
        const { navigate } = this.props.navigation;
        const rightButton = (
            <View>
            </View>
        );
        let diplay_btn
        let fb_button = <TouchableOpacity style={{marginTop:height/3}} onPress={ this.onFBLogin.bind(this) }>
                            <View style={[styles.signButton, styles.facebookBtn, {flexDirection:'row', justifyContent:'space-around'}]}>
                                <FontAwesome style={styles.facebookIcon}>{Icons.facebookSquare}</FontAwesome>
                                <FontText style={styles.facebookText}>
                                    Sign up with Facebook
                                </FontText>
                            </View>
                        </TouchableOpacity>
        let _loader = <ActivityIndicator
                        animating={this.state.animating}
                        style={[styles.centering, {height: 80}]}
                        size="large"
                      />
        if(this.state.static_value){
          diplay_btn = _loader
        }
        else{
          diplay_btn = fb_button
        }
        return (
                <View style={{flex:1,backgroundColor:'#f8fcff'}}>
                   <Navbar rightButton={rightButton}/>
                    <View style={styles.mainContainer}>
                        {diplay_btn}
                    </View>
                </View>

        )
    }
}



const styles = StyleSheet.create({
  mainContainer: {
      margin: 35,
      marginTop: 19
  },
  rightButton: {
      marginTop:15,
      width: 20,
      height: 25,
      marginLeft: 5,
      resizeMode: 'contain'
  },
  signButton: {
      paddingTop: 13,
      paddingBottom: 13,
      borderRadius: 10,
      alignItems: 'center',
  },
  facebookBtn: {
      backgroundColor: '#3e599f'
  },
  centering: {
    zIndex: 1,
    position: 'absolute',
    top: height/4.5,
    left: width/3,
    padding: 8,
  },
  facebookText: {
      color: 'white',
      fontSize: 19,
      marginRight:20
  },
  facebookIcon: {
      color: 'white',
      paddingRight: 20,
      fontSize: 30,
      marginLeft: 20
  }

})

