import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';
import Navbar from '../components/Navbar'
import FontText from '../components/FontText';
import AboutUs from '../components/AboutUs';
import styles from './style/FinalApprovalStyle';
import ButtonValue from '../components/ButtonValue'

const {height, width} = Dimensions.get('window');

export default class FinalApproval extends Component {

static navigationOptions = {
        // title: 'Welcome',
        headerMode: 'none',
        header: null
    };

    render() {
        const leftButton = (
            <TouchableOpacity>
                <Image
                    style={styles.leftButton}
                    source={require('../assets/images/hamburger.png')}/>
            </TouchableOpacity>
        );
        return (
            <ScrollView style={{ backgroundColor:'white' }}>
                <View style={styles.mainContainer}>
                    <View
                        style={[
                          styles.statusBar, {
                            backgroundColor: '#ed018c'
                          }
                        ]}>
                        <StatusBar backgroundColor='#ed018c' barStyle='light-content'/>
                    </View>
                    <Navbar leftButton={leftButton} height={90}/>
                 </View>
                 <View style={{padding:20}}>
                     <View style={[{marginTop:14},styles.rowDecorate]}>
                     <Image style={[{marginRight:10},styles.checkedView]} source={require('../assets/images/checked.png')}/>
                     <FontText style={styles.approval}>Approved Credit Facility</FontText>
                     </View>
                     <View style={[{marginTop:33},styles.rowDecorate]}>
                        <Image style={[{marginRight:30},styles.imageView]} source={require('../assets/images/ic_launcher.png')}/>
                        <View style={{paddingLeft:5}} >
                            <View style={styles.rowDecorate}>
                                <FontText style={{color: '#031B5B',fontSize:18,paddingRight:15}}>Credit Limit:</FontText>
                                <FontText style={{color: '#031B5B',fontSize:18}}>£3,000</FontText>
                            </View>
                            <View style={styles.rowDecorate}>
                            <FontText style={{color: '#031B5B',fontSize:18,paddingRight:20}}>Rate (APR):</FontText>
                            <FontText style={{color: '#031B5B',fontSize:18}}>17.9%</FontText>
                            </View>
                            <View style={{flexDirection:'row',marginTop: 8}}>
                                <FontText style={{color: '#031B5B',fontSize:12,borderRightWidth:1,fontWeight:'bold',paddingRight:5}}>KUE</FontText>
                                <FontText style={{color: '#031B5B',fontSize:12,fontWeight:'bold',paddingLeft:5}}>Zeal Online Limited</FontText>
                            </View>
                        </View>
                      </View>
                     <FontText style={styles.TextFont}>For your records, the key contract information and credit agreement have been sent to the email address provided.</FontText>
                     <FontText style={styles.TextFont}>You are all set, click next to get started.</FontText>
                     <View style={{ padding:14}}>
                     </View>
                     <ButtonValue buttonText="Next" width={width/3} />
                 </View>
                 <View style={{ margin:20,marginBottom:0, paddingBottom:20, borderTopWidth:0.5,borderTopColor:'gray'}}>
                 </View>
                 <View style={styles.commentView}>
                    <AboutUs/>
                </View>
            </ScrollView>

        )
    }
}