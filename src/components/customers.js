import * as config from './config';
import moment from 'moment'
import { StackNavigator } from 'react-navigation';

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken
} = FBSDK;
import {
   AsyncStorage
} from 'react-native'


export function registerCustomer({name, surname, email, password}) {

    const CUSTOMER_API_BASE = `customer/customer-register/`;
    const ENDPOINT = `${config.API_URL}${CUSTOMER_API_BASE}`
    const data = {
        'first_name': name,
        'last_name': surname,
        'email': email,
        'password': password,
    }
    console.log('registerCustomer::data:', data);
    fetch(ENDPOINT, {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
     }).then((response) => response.json())
       .then(function(responseJson) {
         AsyncStorage.setItem('token', responseJson.token);
         console.log('CustomerId', responseJson);
         AsyncStorage.setItem('user_id', ''+responseJson.user_id);
         return true
     }).catch(function(error) {

        console.error(error);
        return false
     });
}

export async function updateCustomer({
    user_id=null, country=null, city=null, mobile=null, dob=null,
    financial_type=null, annual_income=null,
    monthly_rent=null, rent_type=null
}) {
    const token = await AsyncStorage.getItem('token');
    const customer_id = await AsyncStorage.getItem('customer_id');
    const CUSTOMER_API_BASE = `customer/customer-update/${user_id}/`;
    const ENDPOINT = `${config.API_URL}${CUSTOMER_API_BASE}`
    // GB_PK = 77
    let data = {}
    if (city!==null && dob!==null) {
        data['country']= 77
        data['city']=city
        data['phone_number']= mobile
        data['date_of_birth']= moment(dob).format('YYYY-MM-DD')
    }
    data['financial_type'] = financial_type
    data['annual_income']= annual_income
    data['monthly_rent']= monthly_rent
    data['rent_type']= rent_type

    console.log('Token  ' + JSON.stringify(token));
    console.log('Token ' + token);
    console.log('updateCustomer::data', data);

    fetch(ENDPOINT, {
         method: 'PUT',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
         },
         body: JSON.stringify(data)
     }).then((response) => response.json())
       .then(function(responseJson) {
         console.log('responseJson', responseJson )
         return true
     }).catch(function(error) {
        console.error(error);
        return false
     });
}

export async function getCustomerAddress() {
    const token = await AsyncStorage.getItem('token');
    console.log('Token ' + JSON.stringify(token));
    const ADDRESS_API_BASE = `customer/customer-address/`
    const ENDPOINT = `${config.API_URL}${ADDRESS_API_BASE}`

    return await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then(function(response){
        console.log(response);
        return response.json()
    }).then(function(responseJson) {
        console.log('getCustomerAdress::token', token);
        console.log('responseJson', responseJson);
        return responseJson
    }).catch(function(error){
        return false
    })
}
export async function createCustomerAddress({move_in, move_out, address1,
    address2, postcode, city, country}) {

    const token = await AsyncStorage.getItem('token');
    const payload = {
        'country': '77',
        'address1': address1,
        'address1': address2,
        'postal_code': postcode,
        'move_in_date': move_in,
        'move_out_date': move_out,
    }
    const ADDRESS_API_BASE = `customer/customer-address/`
    const ENDPOINT = `${config.API_URL}${ADDRESS_API_BASE}`
    console.log('PayLoad');
    return await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify(payload)
    }).then((response) => {
        console.log('createCustomerAddress::response', response);
    }).then(function(responseJson){
        console.log('Create customer address response', responseJson);
        return responseJson
    }).catch(function(error){
        console.log('createCustomerAddress::error', error);
        return false
    })

}

//--------- update customer address ------
export async function updateCustomerAddress(address_pk, move_in, move_out,
    address1, postcode, city, country, remove=false, address2=null) {

    const token = await AsyncStorage.getItem('token');
    const payload = {
        // 'country': country,
        'address1': address1,
        'address1': address2,
        'postal_code': postcode,
        'move_in_date': move_in,
        'move_out_date': move_out,
        'remove': remove
    }
    const ADDRESS_API_BASE = `customer/customer-address/${address_pk}/`;
    const ENDPOINT = `${config.API_URL}${ADDRESS_API_BASE}`

    console.log('Token updateCustomerAddress' + JSON.stringify(token));
    console.log('Token ' + token);

    fetch(ENDPOINT, {
         method: 'PUT',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
         },
         body: JSON.stringify(data)
     }).then((response) => response.json())
       .then(function(responseJson) {
         console.log('responseJson', responseJson)
         return true
     }).catch(function(error) {
        console.error(error);
        return false
     });
}


//--------- FB auth token for kue token ------
export function handleFBAuth(access_token, navigate) {
    // Move fb login in here.
    const payload = JSON.stringify({'access_token': access_token})
    //
    console.log('access_token: ', payload);
    const CUSTOMER_API_BASE = `rest-auth/facebook/`;
    const ENDPOINT = `${config.API_URL}${CUSTOMER_API_BASE}`
    //console.log(ENDPOINT)
    fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: payload,
    }).then((response) => response.json()).then(function(responseJson) {

        // r = responseJson.json()
        // body = responseJson.key
        // console.log(responseJson)
         //console.log(responseJson.key.trim())

        if(responseJson.key.trim() === ''){
            alert('Login error occured. Code 1');
            navigate('signUp');
        }
        else
        {
            AsyncStorage.setItem('token',responseJson.key.trim());
            navigate('Creditlink1');
        }
        //console.log('handleFBAuth::response:', responseJson.key);
        //AsyncStorage.setItem('token',responseJson.key);
        //console.log("AsyncStorage.getItem('token')", AsyncStorage.getItem('token'));
        return true
    }).catch(function(error){
        //console.log('handleFBAuth::error', error);
        alert('Login error occured. Code 2');
        return false
    });
}


export function handleFacebookLogin(navigate) {
    var value = 1;
    LoginManager.logInWithReadPermissions(['email', 'public_profile', 'user_friends'
        ]).then(function(result) {
            if (result.isCancelled) {
                navigate('signUp');
                alert('Login was cancelled');
            } else {
                AccessToken.getCurrentAccessToken().then(
                (data) => {
                    request = handleFBAuth(data.accessToken, navigate);
                });
            }
        },
        function (error) {
            alert('Login error: ' + error);
        }
    )
        return value
}

export function getCountryList(callback) {
	url = 'https://restcountries.eu/rest/v2/all';
	fetch(url)
	.then(response => {
		response.json()
		.then(json => {
				var array = json.map(element => {return { cc: element.alpha2Code, name: element.name}});
        callback(array);
	  	});
	});
}

