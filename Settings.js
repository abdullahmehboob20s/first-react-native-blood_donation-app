import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firebase from '@react-native-firebase/app';
import {get_user} from '../redux/actions/userReducerActions';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {clear_user} from '../redux/actions/userReducerActions';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const Settings = ({navigation}) => {
  let userReducer = useSelector((state) => state.userReducer);
  let donorsReducer = useSelector((state) => state.donorsReducer);
  let CommentsReducer = useSelector((state) => state.CommentsReducer);
  let [posts, setPosts] = useState([]);
  let dispatch = useDispatch();
  let [deleteLoading, setDeleteLoading] = useState('');

  let update = async () => {
    const update = {
      displayName: 'Abdullah Mehboob',
      photoURL:
        'https://lh3.googleusercontent.com/a-/AOh14GjoM4bFtEx3Iamx6Ft4yb4MyaMNGI4R7q0aJfjF=s96-c',
    };

    await firebase.auth().currentUser.updateProfile(update);
    let currentUser = await firebase.auth().currentUser;

    dispatch(get_user(currentUser));
  };

  let logout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
      dispatch(clear_user());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let userPosts = donorsReducer.donors.filter(
      (donor) => donor.userId == userReducer.user.uid,
    );
    setPosts(userPosts);
  }, [donorsReducer.donors]);
  let deleteingDocument = async (id) => {
    try {
      setDeleteLoading(id);
      await firestore().collection('donors').doc(id).delete();
      setDeleteLoading('');
    } catch (error) {
      console.log('DELETING ERROR ==> ' + error);
    }
  };

  if (userReducer.user) {
    let newPhoto = posts.find(
      (item) => item.photoUrl !== userReducer.user.photoURL,
    );

    if (newPhoto) {
      firestore()
        .collection('donors')
        .doc(newPhoto.id)
        .update({photoUrl: userReducer.user.photoURL})
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return userReducer.user ? (
    <View style={{flex: 1}}>
      <View style={s.container}>
        <View style={s.profilePhoto}>
          {userReducer.user.photoURL ? (
            <Image source={{uri: userReducer.user.photoURL}} style={s.image} />
          ) : (
            <FontAwesome5
              name="user-circle"
              style={{marginRight: 20}}
              size={85}
              color="grey"
            />
          )}
          <View>
            <Text
              style={{
                color: 'black',
                marginTop: 15,
                marginBottom: 5,
                textTransform: 'capitalize',
              }}>
              {userReducer.user.displayName}
            </Text>
            <Text style={{color: 'grey', fontSize: 11}}>
              {userReducer.user.email}
            </Text>
          </View>
        </View>

        <View style={s.twoButtons}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={s.buttons}
            onPress={() => navigation.navigate('CreateDonor')}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Create Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={s.buttons}
            onPress={() => navigation.navigate('YourInfo')}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Your Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={s.buttons}
            onPress={logout}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={s.buttons}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Posts : {posts ? posts.length : null}
            </Text>
          </TouchableOpacity>
        </View>

        {posts ? (
          <View style={s.donorPosts}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={posts}
              renderItem={({item}) => (
                <View style={s.donor}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item.photoUrl ? (
                      <Image
                        source={{uri: item.photoUrl}}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50 / 2,
                          marginRight: 15,
                        }}
                      />
                    ) : (
                      <FontAwesome5
                        name="user-circle"
                        size={50}
                        color="grey"
                        style={{marginRight: 15}}
                      />
                    )}
                    <View>
                      <Text style={{color: '#4d4d4d', marginBottom: 3}}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: '#004d99',
                          fontSize: 13,
                          marginBottom: 3,
                          fontWeight: 'bold',
                        }}>
                        {item.type}
                      </Text>
                      <Text style={{color: 'grey', fontSize: 11}}>
                        {item.email}
                      </Text>
                    </View>
                  </View>

                  <View style={s.bloodView}>
                    <Fontisto
                      name="blood-drop"
                      style={s.bloodView_icon}
                      color="#ff6666"
                    />
                    <View style={s.bloodView_text}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'white',
                          marginTop: 5,
                        }}>
                        {item.blood}
                      </Text>
                    </View>
                  </View>

                  {userReducer.user.uid == item.userId ? (
                    <View style={s.deleteUpdate_Icon}>
                      {deleteLoading === item.id ? (
                        <ActivityIndicator
                          color="black"
                          size={24}
                          style={{marginBottom: 10}}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="delete"
                          size={28}
                          style={{marginBottom: 10}}
                          onPress={() => deleteingDocument(item.id)}
                          color="#ff6666"
                        />
                      )}
                      <FontAwesome5
                        name="edit"
                        size={23}
                        onPress={() =>
                          navigation.navigate('UpdatingDonorPost', {item})
                        }
                        color="#ffb31a"
                      />
                    </View>
                  ) : null}

                  <View>
                    {item.blood == 'A+' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'O+' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O+
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'B+' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B-
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'AB+' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            Every One
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'A-' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB-
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'O-' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            Every One
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'B-' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB-
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {item.blood == 'AB-' ? (
                      <>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Give Blood to
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB+
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB-
                          </Text>
                        </View>
                        <Text style={{color: 'grey', marginBottom: 5}}>
                          Can Receive Blood From
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            AB-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            A-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            B-
                          </Text>
                          <Text
                            style={{
                              marginRight: 8,
                              color: '#ff9999',
                              fontWeight: 'bold',
                            }}>
                            O-
                          </Text>
                        </View>
                      </>
                    ) : null}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={s.ViewDetailsButton}
                      onPress={() =>
                        navigation.navigate('Comments', {item}, {item})
                      }>
                      <Text style={{color: 'white'}}>
                        {
                          CommentsReducer.comments.filter(
                            (ab) => ab.toPost_id === item.id,
                          ).length
                        }{' '}
                        Comments
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.ViewDetailsButton}
                      onPress={() =>
                        navigation.navigate('BloodDonorDetails', {item})
                      }>
                      <Text style={{color: 'white'}}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color="#004080" size={30} />
          </View>
        )}
      </View>
    </View>
  ) : (
    <Text>Null</Text>
  );
};

export default Settings;

const s = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    backgroundColor: '#f2f2f2',
  },

  deleteUpdate_Icon: {
    position: 'absolute',
    bottom: 55,
    right: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: 80,
  },
  ViewDetailsButton: {
    backgroundColor: '#004d99',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 3,
  },
  yourPosts_title: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#e6e6e6',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginRight: 20,
  },
  profilePhoto: {
    height: 150,
    flexDirection: 'row',
    // justifyContent : "center",
    alignItems: 'center',
    backgroundColor: '#e6ffff',
    paddingHorizontal: 20,
  },
  twoButtons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: '#80bfff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 4,
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 3,
  },
  Donorposts: {
    flex: 1,
    backgroundColor: 'red',
  },
  donor: {
    backgroundColor: 'white',
    marginBottom: 10,
    height: 260,
    padding: 15,
    position: 'relative',
    justifyContent: 'space-between',
  },
  bloodView: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  bloodView_text: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodView_icon: {
    fontSize: 70,
  },
  // ViewDetailsButton : {
  //     position : "absolute",
  //     right : 15,
  //     bottom : 15,
  //     backgroundColor : "#004d99",
  //     paddingVertical : 5,
  //     paddingHorizontal : 25,
  //     borderRadius : 3
  // },
  donorPosts: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e6e6e6',
    paddingVertical: 20,
    paddingBottom: 70,
  },
});
