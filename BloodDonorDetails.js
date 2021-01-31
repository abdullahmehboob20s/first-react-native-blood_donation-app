import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Zocial from 'react-native-vector-icons/Zocial';
import Communications from 'react-native-communications';
import {useSelector, useDispatch} from 'react-redux';

const BloodDonorDetails = (props) => {
  const userReducer = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  let [canDonate, setCanDonate] = useState(null);
  let [canTake, setCanTake] = useState(null);
  let {
    age,
    name,
    email,
    city,
    district,
    gender,
    number,
    type,
    location,
    blood,
    photoUrl,
    userId,
  } = props.route.params.item;

  useEffect(() => {
    if (blood == 'A+') {
      setCanDonate('A+ AB+');
      setCanTake('A+ A- O+ O-');
    }
    if (blood == 'O+') {
      setCanDonate('A+ AB+ O+ B+');
      setCanTake('O+ O-');
    }
    if (blood == 'B+') {
      setCanDonate('AB+ B+');
      setCanTake('B+ B- O+ O-');
    }
    if (blood == 'AB+') {
      setCanDonate('AB+');
      setCanTake('Every One');
    }
    if (blood == 'A-') {
      setCanDonate('AB+ AB- A+ A-');
      setCanTake('A- O-');
    }
    if (blood == 'O-') {
      setCanDonate('Every One');
      setCanTake('O-');
    }
    if (blood == 'B-') {
      setCanDonate('B+ B- AB+ AB-');
      setCanTake('B- O-');
    }
    if (blood == 'AB-') {
      setCanDonate('AB+ AB-');
      setCanTake('AB- A- B- O-');
    }
  }, [blood]);

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        {photoUrl ? (
          <Image
            source={{uri: photoUrl}}
            style={{
              width: 85,
              height: 85,
              borderRadius: 85 / 2,
              marginRight: 20,
            }}
          />
        ) : (
          <FontAwesome5
            name="user-circle"
            size={85}
            color="grey"
            style={{marginRight: 15}}
          />
        )}
        <View>
          <Text style={{marginBottom: 5}}>{name}</Text>
          <Text style={{marginBottom: 5, fontWeight: 'bold', color: '#004d99'}}>
            {type}
          </Text>
          <Text style={{fontSize: 12, color: 'grey'}}>{email}</Text>
          {userReducer.user.uid == userId ? null : (
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 5}}>
                <TouchableOpacity
                  style={s.comunicationButton}
                  onPress={() =>
                    Communications.email(
                      [email],
                      null,
                      null,
                      'Subject :',
                      'Body Text :',
                    )
                  }>
                  <Text style={{color: 'white'}}>Send Email</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={s.comunicationButton}
                  onPress={() => Communications.phonecall(number, true)}>
                  <Text style={{color: 'white'}}>Call Him</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{marginTop: 0, padding: 20}}>
        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Fontisto name="blood-drop" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Blood Type
            </Text>
            <Text>{blood}</Text>
          </View>
        </View>

        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Fontisto name="blood-test" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Can Donate Blood To
            </Text>
            <Text>{canDonate}</Text>
          </View>
        </View>

        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Fontisto name="blood" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Can Take Blood From
            </Text>
            <Text>{canTake}</Text>
          </View>
        </View>

        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name="filter-vintage" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Age
            </Text>
            <Text>{age}</Text>
          </View>
        </View>
        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Foundation name="torsos-all-female" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Gender
            </Text>
            <Text>{gender}</Text>
          </View>
        </View>
        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Fontisto name="holiday-village" size={30} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              City
            </Text>
            <Text>{city}</Text>
          </View>
        </View>
        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FontAwesome5 name="city" size={30} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              District
            </Text>
            <Text>{district}</Text>
          </View>
        </View>
        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="location" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Location
            </Text>
            <Text>{location}</Text>
          </View>
        </View>

        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="call" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Phone Number
            </Text>
            <Text>{number}</Text>
          </View>
        </View>
        <View style={s.donor_detail}>
          <View
            style={{
              height: '100%',
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Zocial name="email" size={40} color="#ff6666" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey', fontSize: 11, marginBottom: 8}}>
              Email
            </Text>
            <Text style={{fontSize: 11}}>{email}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BloodDonorDetails;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },
  header: {
    // backgroundColor : "red",
    flexDirection: 'row',
    height: 150,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  donor_detail: {
    width: '100%',
    height: 70,
    backgroundColor: 'white',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  comunicationButton: {
    backgroundColor: '#0078D4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
});
