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
  TextInput,
  TouchableOpacity,
} from 'react-native';

import TabBar from './components/tabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as images from '../../utils/const.js';
import SideMenu from './components/sideMenu';
import Drawer from 'react-native-drawer';
import styles from './dashboardStyle'
import * as actions  from '../../actions'
import { connect } from 'react-redux';
import ListView from './components/listView'
import _ from 'lodash'
import ToolBar from '../toolbar/header'

var { width, height } = Dimensions.get('window');
var drawerStyles = {
    drawer: {
        shadowColor: "#a3a3a3",
    },
    main: {paddingLeft: 3},
};
class DashBoard extends Component {
  static navigationOptions = {
    headerMode: 'none',
    header: null,
  }
 constructor(props) {
    super(props);
    this.state = {
          text: 'Add',
          type : true
      }
      this._onOrder=this._onOrder.bind(this)
      this._onBuySell=this._onBuySell.bind(this)
  }
  closeDrawer(){
    this.refs.drawer.close();
  }

  openDrawer(){
    this.refs.drawer.open();
  }
  _onWallet(){
    this.refs.drawer.close();
    const {navigate} = this.props.navigation;
    navigate('wallet')
  }
  _onProfile(){
    this.refs.drawer.close();
    const {navigate} = this.props.navigation;
    navigate('profile')
  }
  _onTransaction(){
    const {navigate} = this.props.navigation;
    navigate('transaction')
     this.refs.drawer.close();
    
  }
  _onOrder(){
    const {navigate} = this.props.navigation;
    navigate('order',{ price: this.props.stock
    },{mode:'modal'});
  }
  onHome(){
        this.refs.drawer.close();
  }
  _onBuySell(){

  }

  componentWillMount(){
    this.props.signIn();
    this.props.getStockPrice();
    this.props.getFeed();
  }
  render() {
      const { listItems } = this.props
      var _listView = _.reverse(listItems).map((data, i) => {
      return (
          <ListView key={i} date={data.time}   price={data.price} />
        )
      })
      return (
        <Drawer
                  ref="drawer"
                  type="overlay"
                  tapToClose={false}
                  onClose={this.closeDrawer.bind(this)}
                  content={
                    <SideMenu
                      closeDrawer={this.closeDrawer.bind(this)}
                      _onWallet={this._onWallet.bind(this)}
                      _onProfile={this._onProfile.bind(this)}
                      _onTransaction={this._onTransaction.bind(this)}
                      onHome={this.onHome.bind(this)}
                      user={this.props.user}
                    />}
                  tapToClose={true}
                  openDrawerOffset={0.3}
                  panCloseMask={0.5}
                  closedDrawerOffset={-3}
                  captureGestures={true}
                  negotiatePan={true}
                  styles={drawerStyles}
                  tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                  })}
                  >
                   <View style={styles.viewStyle}>
                       <ToolBar title="Dashboard"/>
                      <TouchableOpacity style={styles.drawableView} onPress={()=>this.openDrawer()}>
                          <Image
                            style={styles.drawableImage}
                            source={images.DRAWABLE}
                          />
                        </TouchableOpacity>
                   </View>
            <View style={styles.tabView}>
            <View style={styles.card}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>Current stock price</Text>
                <Text style={styles.stockValue}>{this.props.stock}</Text>
                 <Text style={styles.lastStock}>Last 5 stock prices</Text>
              </View>
              <View>
                    <View style={styles.listViewView}>
                      {_listView}
                    </View>
                <TouchableOpacity onPress={this._onOrder}>
                  <View style={styles.buySellTextView}>
                  <Text style={styles.buySellText}>BUY/SELL</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <StatusBar
              hidden = {true}
             />
            </View>
      </Drawer>
      );
  }
}
function mapStateToProps({stock, listItems, user}) {
  return {
    stock,
    listItems,
    user
  }
}
export default connect(mapStateToProps, actions )(DashBoard)
