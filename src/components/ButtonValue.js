import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';


export default class ButtonValue extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
			<View style={[styles.buttonWrapper,{height: this.props.height}]}>
                <TouchableOpacity>
                    <View style={[styles.getStartedBtn,{width:this.props.width}]}>
                        <FontText style={styles.getStartedText}>{this.props.buttonText}</FontText>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
        getStartedBtn: {
            shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 1
            },
            shadowRadius: 2,
            shadowOpacity: 1.0,
            width: 126,
            borderRadius: 10,
            alignItems: 'center',
            backgroundColor: '#ed018c'
        },
        getStartedText: {
            padding:10,
            color: '#f8fcff',
            fontSize: 19,
            fontFamily: 'Roboto'
        },
        buttonWrapper:{
            justifyContent:'center',
            alignItems:'center',
        },
})