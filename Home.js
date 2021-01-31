import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {get_donors} from '../redux/actions/donorsReducerActions';
import firestore from '@react-native-firebase/firestore';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {get_comments} from '../redux/actions/CommentsReducerActions';

const Home = ({navigation}) => {
  let userReducer = useSelector((state) => state.userReducer);
  let donorsReducer = useSelector((state) => state.donorsReducer);
  let CommentsReducer = useSelector((state) => state.CommentsReducer);
  let [deleteLoading, setDeleteLoading] = useState('');
  let [loading, setLoading] = useState(true);
  let dispatch = useDispatch();

  useEffect(() => {
    firestore()
      .collection('donors')
      .onSnapshot(
        (querySanpshot) => {
          setLoading(false);
          const docs = [];
          querySanpshot.forEach((doc) => {
            docs.push({...doc.data(), id: doc.id});
          });
          if (docs) {
            dispatch(get_donors(docs));
          }
        },
        (err) => console.log(err),
      );

    firestore()
      .collection('comments')
      .onSnapshot(
        (querySanpshot) => {
          const docs = [];
          querySanpshot.forEach((doc) => {
            docs.push({...doc.data(), id: doc.id});
          });
          if (docs) return dispatch(get_comments(docs));
        },
        (err) => console.log(err),
      );
  }, []);

  let deleteingDocument = async (id) => {
    try {
      setDeleteLoading(id);
      await firestore().collection('donors').doc(id).delete();
      setDeleteLoading('');
    } catch (error) {
      console.log('DELETING ERROR ==> ' + error);
    }
  };

  return (
    <View style={s.container}>
      {!loading ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={donorsReducer.donors}
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
                    style={{fontWeight: 'bold', color: 'white', marginTop: 5}}>
                    {item.blood}
                  </Text>
                </View>
              </View>

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

              {userReducer.user.uid !== item.userId ? null : (
                <View style={s.deleteUpdate_Icon}>
                  {deleteLoading === item.id ? (
                    <ActivityIndicator
                      color="black"
                      style={{marginBottom: 10}}
                      size={24}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="delete"
                      onPress={() => deleteingDocument(item.id)}
                      size={28}
                      style={{marginBottom: 10}}
                      color="#ff6666"
                    />
                  )}
                  <FontAwesome5
                    name="edit"
                    onPress={() =>
                      navigation.navigate('UpdatingDonorPost', {item})
                    }
                    size={22}
                    color="#ffb31a"
                  />
                </View>
              )}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={s.ViewDetailsButton}
                  onPress={() => navigation.navigate('Comments', {item})}>
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
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color="black" size={30} />
        </View>
      )}
    </View>
  );
};

export default Home;

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#e6e6e6',
  },
  deleteUpdate_Icon: {
    position: 'absolute',
    bottom: 55,
    right: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: 80,
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
  ViewDetailsButton: {
    backgroundColor: '#004d99',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 3,
  },
});
