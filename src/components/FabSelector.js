import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Image,
    Dimensions,
} from 'react-native'

var windowSize = Dimensions.get('window');
import * as CONSTANTS from '../../constants';
import {observer, inject} from 'mobx-react/native';
const MK = require('react-native-material-kit');

const {
    MKButton,
    MKColor,
} = MK;


const MainFab = MKButton.coloredFab()
    .withBackgroundColor("#c65622")
    .withStyle({
        width: 60,
        height: 60,
        bottom: 30,
        right: 20,
        elevation: 5,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    })
    .build();

const PublicAreaFAB = MKButton.coloredFab()
    .withBackgroundColor("#360324")
    .withStyle({
        width: 60,
        height: 60,
        bottom: 100,
        right: 90,
        elevation: 5,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    })
    .build();

const RoomFAB = MKButton.coloredFab()
    .withBackgroundColor("#360324")
    .withStyle({
        width: 60,
        height: 60,
        bottom: 130,
        right: 20,
        elevation: 5,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    })
    .build();

@inject('state', 'actions') @observer
export default class FabSelector extends Component {
// prev height 150

    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <View style={styles.fabModal} onStartShouldSetResponder={() => {
                this.props.setFABModalVisible(false)
            }}>
                <MainFab onPress={() => {
                    this.props.setFABModalVisible(false)
                }}>
                    <Image style={{height: 60, width: 60, alignItems: 'center', justifyContent: 'center'}}
                           source={require('../../img/FAB_icon.png')}/>
                </MainFab>
                {/*<RequestFAB onPress={() => {this.props.setRequestModalVisible(true)}}><Image style={{height:30,width:30, alignItems:'center', justifyContent:'center'}}*/}
                {/*source={require('../../img/Fab_request.png')}/>*/}
                {/*</RequestFAB>*/}
                <RoomFAB
                    onPress={() => {
                        this.props.setIncidentModalVisible(true);
                        this.props.state.ui.fab.type = CONSTANTS.FAB_TYPES.ROOM;
                    }}
                >
                    <Image style={{height: 35, width: 35, alignItems: 'center', justifyContent: 'center'}}
                           source={require('../../img/Fab_Rooms.png')}/>
                </RoomFAB>
                <PublicAreaFAB
                    onPress={() => {
                        this.props.setIncidentModalVisible(true);
                        this.props.state.ui.fab.type = CONSTANTS.FAB_TYPES.PUBLIC_AREA;
                    }}
                ><Image style={{height: 45, width: 45, alignItems: 'center', justifyContent: 'center'}}
                        source={require('../../img/Fab_Public_Area.png')}/>
                </PublicAreaFAB>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#360324',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    fabModal: {
        flex:1,
        // height: windowSize.height - 128.5,
        // width: windowSize.width,
        opacity: 0.9,
        backgroundColor: "#fff",
        // bottom: 0,
        // position: 'absolute'
    },
})
module.exports = FabSelector;