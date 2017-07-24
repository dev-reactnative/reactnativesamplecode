import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
  Text,
  View,
  Platform,
  Image,
} from 'react-native';
import * as Constant from '../../utils/const';
import CommonHelper from '../../utils/helper';
import StoreInteraction from '../../utils/storeInteraction';
import ImagePicker from 'react-native-image-picker';
import NavigationBar from '../components/navigationBar/navigationBar';
import BarcodeScanner from 'react-native-barcodescanner';
import styles from './barcodeScannerStyle';
import Camera from 'react-native-camera';
import { RNS3 } from 'react-native-aws3';
import uuid from 'react-native-uuid';

const {height, width} = Dimensions.get('window');

export default class Register extends Component {

  static navigationOptions = {
    headerMode: 'none',
    header: null,
    gesturesEnabled: false
  }

  constructor(props){
    super(props);
    this.takePicture = this.takePicture.bind(this);
    this.imageS3Upload = this.imageS3Upload.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      barcode: '',
      text: Constant.CAMERA_TXT,
      type: '',
      BarcodeAlert: true,
      loading: false,
      avatarSource: null,
      lat: this.props.navigation.state.params.lat,
      lng: this.props.navigation.state.params.long
    };
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        let id = CommonHelper._getUid(uuid);
        this.imageS3Upload(source.uri,id)
      }
    });
  }

  barcodeReceived(e) {
    const {lat, lng} = this.state;
    const {navigate} = this.props.navigation;
    if (e.data !== this.state.barcode || e.type !== this.state.type)
     {
       Vibration.vibrate()
       CommonHelper._commonAlert(Alert, Constant.BAR_CODE_DTECTED_TXT, this)
       StoreInteraction.insertCustomData(barcode,{"content" : e.data, "type": e.type, "lat": lat, "lng": lng}) 
          this.setState({
            barcode: e.data,
            text: `${e.data} (${e.type})`,
            type: e.type,
            BarcodeAlert: false,
          });
      }
  }

  takePicture() {
    let id = CommonHelper._getUid(uuid);
    this.setState({loading: true})
    this.camera.capture()
      .then((data) => {
        this.imageS3Upload(data.path,id)
      })
      .catch(err => console.error(err));
  }

  imageS3Upload(data,uuid) {
    const {lat, lng} = this.state;
    const file = {
      uri: data,
      name: uuid+'.jpg',
      type: 'image/jpeg'
    };
    const options = {
      keyPrefix: Constant.AWS_KEY_PREFIX,
      bucket: Constant.AWS_BUCKET,
      region: Constant.AWS_REGION,
      accessKey: Constant.AWS_ACCESS_KEY,
      secretKey: Constant.AWS_SECRET_KEY,
      successActionStatus: 201
    };

    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        console.log(response);
        throw new Error('Failed to upload image to S3', response);
      }
      console.log('*** BODY ***', response.body);
      var extradict = {'url' : response.body.postResponse.location, 'lat': lat, 'lng': lng}
      StoreInteraction.insertCustomData("image", extradict);
      this.setState({loading:false})
      Alert.alert('',Constant.PICTURE_SHARED_TXT,
          [{text: 'OK'}],
          {cancelable: false})
    });
  }

  barcode(){
    console.log("Barcode detected")
  }

  render() {
     const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
             <NavigationBar
              text = {Constant.BARCODE_TXT}
              image = {Constant.IMAGE_BACK}
              leftText = {Constant.ZURUCK_TXT}
              _onBackPress = { () => this.props.navigation.goBack(null) }
              rightView = {Constant.IMAGE_ALBUM}
              buttonClicked = {this.selectPhotoTapped}
              />
              <Camera
                  ref={(cam) => {
                  this.camera = cam;
                  }}
                aspect={Camera.constants.Aspect.fill}
                captureAudio={false}
                onBarCodeRead={this.state.BarcodeAlert?this.barcodeReceived.bind(this):this.barcode.bind(this)}
                style={styles.preview}
                barCodeTypes={Constant.BAR_CODE_TYPE}>
                <BarcodeScanner style={styles.container}>
                  <ActivityIndicator
                    color={'#fff'}
                    animating={this.state.loading}
                    style={[styles.centering, {height: 80}]}
                    size="large"
                  />
                </BarcodeScanner>
                <TouchableOpacity style={styles.barcodeView} onPress={this.takePicture}>
                    <Image style={styles.imageView} source={Constant.IMAGE_BARCODEICON}/>
                </TouchableOpacity>
              </Camera>
            </View>
        );
  }
}