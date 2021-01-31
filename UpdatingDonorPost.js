import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';

const UpdatingDonorPost = (props) => {
  let [userId, setUserId] = useState('');
  let [photoUrl, setPhotoUrl] = useState('');
  let [blood, setBlood] = useState('O+');
  let [gender, setGender] = useState('Male');
  let [type, setType] = useState('Wants To Donate Blood');
  let [name, setName] = useState('');
  let [age, setAge] = useState('');
  let [location, setLocation] = useState('');
  let [city, setCity] = useState('');
  let [district, setDistrict] = useState('');
  let [number, setNumber] = useState('');
  let [id, setId] = useState('');
  let [loading, setLoading] = useState(false);

  let [error, setError] = useState('');

  const donorsReducer = useSelector((state) => state.donorsReducer);
  const userReducer = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    let {
      id,
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
    setAge(age);
    setName(name);
    setCity(city);
    setGender(gender);
    setNumber(number);
    setType(type);
    setLocation(location);
    setBlood(blood);
    setUserId(userId);
    setPhotoUrl(photoUrl);
    setDistrict(district);
    setId(id);
  }, []);

  let submittingData = async () => {
    try {
      if (!blood || !name || !type || !gender || !city || !number || !age) {
        setError('Not All Fields Have Been Entered');
        return;
      }
      setLoading(true);

      let data = {
        name,
        email: userReducer.user.email,
        gender,
        type,
        age,
        number,
        district,
        city,
        blood,
        location,
        userId,
        photoUrl,
      };
      let upadte = await firestore().collection('donors').doc(id).update(data);
      props.navigation.goBack('');
      setLoading(false);
    } catch (error) {
      console.log('update Error' + error);
    }
  };

  return !loading ? (
    <ScrollView>
      <View style={s.container}>
        <View
          style={{
            backgroundColor: '#ffcc66',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: 1,
              fontSize: 21,
            }}>
            Update Post
          </Text>
        </View>
        <View style={s.formContainer}>
          {error ? (
            <View style={s.errorMessage}>
              <Text style={{color: '#ff3333'}}>{error}</Text>
              <Entypo
                name="squared-cross"
                size={24}
                color="#ff3333"
                onPress={() => setError('')}
              />
            </View>
          ) : null}
          <Picker
            style={s.picker}
            selectedValue={type}
            onValueChange={(value, index) => setType(value)}>
            <Picker.Item
              label="Want To Donate Blood"
              value="Wants To Donate Blood"
            />
            <Picker.Item label="Need A Blood" value="Needs A Blood" />
          </Picker>
          <Picker
            style={s.picker}
            mode="dialog"
            prompt="Select Your Blood Type"
            selectedValue={blood}
            onValueChange={(value, index) => setBlood(value)}>
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="O-" value="O-" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
          </Picker>
          <TextInput
            onSubmitEditing={submittingData}
            returnKeyLabel="Update"
            style={s.inputStyle}
            value={age}
            onChangeText={(e) => setAge(e)}
            placeholder="Enter Your Age"
          />
          <Picker
            style={s.picker}
            selectedValue={gender}
            onValueChange={(value, index) => setGender(value)}>
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Male" value="Male" />
          </Picker>
          <TextInput
            onSubmitEditing={submittingData}
            returnKeyLabel="Update"
            style={s.inputStyle}
            value={city}
            onChangeText={(e) => setCity(e)}
            placeholder="Enter Your City Name"
          />
          <TextInput
            onSubmitEditing={submittingData}
            returnKeyLabel="Update"
            style={s.inputStyle}
            value={district}
            onChangeText={(e) => setDistrict(e)}
            placeholder="Enter Your District"
          />
          <TextInput
            onSubmitEditing={submittingData}
            returnKeyLabel="Update"
            style={s.inputStyle}
            value={location}
            onChangeText={(e) => setLocation(e)}
            placeholder="Enter Your Location"
          />
          <TextInput
            onSubmitEditing={submittingData}
            returnKeyLabel="Update"
            style={s.inputStyle}
            value={number}
            onChangeText={(e) => setNumber(e)}
            placeholder="Enter Your Phone Number"
          />

          <TouchableOpacity
            style={s.CreateDoorButtons}
            onPress={submittingData}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.CreateDoorButtons, {backgroundColor: '#cc6600'}]}
            onPress={() => props.navigation.goBack()}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <ActivityIndicator color="darkslateblue" size={30} />
    </View>
  );
};

export default UpdatingDonorPost;

const s = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e6e6e6',
    height: Dimensions.get('window').height,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  formContainer: {
    width: '100%',
    marginTop: 10,
  },
  inputStyle: {
    backgroundColor: 'white',
    marginVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  picker: {
    marginVertical: 3,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  CreateDoorButtons: {
    width: '100%',
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: '#ffcc66',
  },
  errorMessage: {
    width: '100%',
    minHeight: 50,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#ff3333',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 3,
  },
});
