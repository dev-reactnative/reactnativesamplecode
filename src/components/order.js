import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Dimensions,
  ScrollView,
  Image,
  Modal,
  TextField,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import { connect } from 'react-redux';
import * as images from '../../utils/const.js';
import * as actions  from '../../actions'
import styles from './orderStyle';
import Switch from './components/toggleButton';
import PriceQuantity from './components/priceQuantity'
var { width, height } = Dimensions.get('window');

class Order extends Component {
  static navigationOptions = {
    headerMode: 'none',
    header: null,
  }
 constructor(props) {
    super(props);
    this.state = {
          type : true,
          editable:false,
          data: this.props.navigation.state.params,
          switchValue: true,
          calcValue: '',
          modalVisible:false,
          qty: ""
      }
      this._onDone=this._onDone.bind(this)
      this.submitOrder = this.submitOrder.bind(this)
  }
  submitOrder(){
    values = { 'quantity':this.state.qty,
        'price':this.state.data.price,
        'userid': this.props.user.id}
    if(this.state.switchValue){
      this.props.buyStock(values)
    }
    else {
      this.props.sellStock(values)
    }
  this.setModalVisible(true)
}
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  calculate(data) {
    let calc = this.state.data.price * data;
    let newCalc=calc.toString()
    this.setState({calcValue: newCalc})
    this.setState({qty: data})
  }
  _onDone(){
    const {navigate} = this.props.navigation;
    navigate('dashboard');
    this.setModalVisible(!this.state.modalVisible)
  }
  calculate(data) {
    let calc = this.state.data.price * data;
    let newCalc=calc.toString()
    this.setState({calcValue : newCalc})
  }
  render() {
    console.log("wallet", this.props.wallet)
    let dataObject = this.state.data;
      return (
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <View style={styles.crossNameView}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                <Image source={images.CROSS} style={styles.cross}/>
              </TouchableOpacity>
              <Text style={styles.name}>{dataObject.name}</Text>
              <Text style={styles.category}>{dataObject.category}</Text>
            </View>
            <View style={styles.priceView}>
              <Text style={styles.price}>₹{dataObject.price}</Text>
           </View>
         </View>
         <View style={styles.middleView}>
            <Switch data={(data) => this.setState({switchValue: data})}/>
            <View style={styles.priceQuanView}>
              <PriceQuantity quantity='QTY' totalQuantity={(value) =>this.calculate(value)}/>
              <PriceQuantity quantity='PRICE' priceData={this.state.calcValue} priceValuePlace={this.state.editable}/>
            </View>
            <Image source={images.SHORTDOWN} style={styles.shortdownIcon}/>
         </View>
         <TouchableOpacity onPress={this.submitOrder}>
           <View style={styles.buyView}>
               <Text style={styles.buyText}>{this.state.switchValue?'BUY':'SELL'}</Text>
           </View>
         </TouchableOpacity>
         <View>
         <Modal
            animationType={"none"}
            transparent={false}
            visible={this.state.modalVisible}
            >
           <View style={styles.modalView}>
              <View style={styles.responseView}>
                <View style={styles.response}>
                  <View style={styles.responseTitle}>
                    <View style={styles.titleView}>
                      <Text style={styles.responseTitleText}>{this.props.wallet.message}</Text>
                      </View>
                      <View style={styles.crossView}>
                      <TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                      <Image source={images.DELETE} style={styles.crossIcon}/>
                      </TouchableOpacity>
                      </View>
                  </View>
                    <View style={styles.messageView}>
                      <Text style={styles.message}>Your current wallet amount is {this.props.wallet.wallet}.</Text>
                    </View>
                        <TouchableOpacity onPress={this._onDone}>
                            <View style={styles.responsefinalView}>
                                <Text style={styles.doneText}>DONE</Text>
                           </View>
                        </TouchableOpacity>
                </View>
              </View>
           </View>
          </Modal>
         </View>
      </View>
      );
  }
}
function mapStateToProps({ user, wallet }) {
  return {
    user,
    wallet
  }
}
export default connect(mapStateToProps, actions )(Order)
