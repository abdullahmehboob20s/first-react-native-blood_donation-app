import React , {useState,useEffect} from 'react'
import {View , Text , StyleSheet  , TextInput , ActivityIndicator , TouchableOpacity  , Dimensions , Image , ScrollView} from "react-native"
import firestore from '@react-native-firebase/firestore';
import Feather from "react-native-vector-icons/Feather"
import MaIcon from "react-native-vector-icons/MaterialIcons"
import {useSelector,useDispatch} from "react-redux"
import firebase from "@react-native-firebase/app"
import {get_user} from "../redux/actions/userReducerActions"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import ImagePicker from "react-native-customized-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {clear_user} from "../redux/actions/userReducerActions"

const YourInfo = ({navigation}) => {
    const userReducer = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

 
    

    let chooseFromGallery = async () => {
      try {
        let image = await ImagePicker.openPicker({cropping: true})

        const update = {
          photoURL : image[0].path ,
        };
        
        await firebase.auth().currentUser.updateProfile(update);
        let currentUser123 = await firebase.auth().currentUser
        
        dispatch(get_user(currentUser123))
      } catch (error) {
       console.log(error); 
      }
    }
    let takePhoto = async () => {
      try {
        let image = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true
        })

        const update = {
          photoURL : image[0].path,
        };
        
        await firebase.auth().currentUser.updateProfile(update);
        let currentUser123 = await firebase.auth().currentUser
        
        dispatch(get_user(currentUser123))
      } catch (error) {
        console.log(error);   
      }
    }

    let deleteYourAccount = async () => {
      try {
      let currentUser123 = await firebase.auth().currentUser
      await currentUser123.delete()
      dispatch(clear_user())
    } catch (error) {
      if(error.code === "auth/requires-recent-login"){
        alert("Please Login Again To Confirm That Its You Who Wants To Delete Account")
      }
      console.log(error);
    }
    }

  
    return (
      userReducer.user ?
        ( <View style={s.container}>
        <View style={s.todos}>
               <View style={s.todoImage}>


                   {
                      userReducer.user.photoURL ?
                       <Image source={{uri : userReducer.user.photoURL}} style={{width : 100 , height : 100 }} />
                    :
                    <FontAwesome5 name="user-circle" size={85} color="grey"  />
                   }



                <View>
                    <TouchableOpacity style={s.updatingPhoto}><Text style={{textAlign : "center" , color : "#034f84" , fontWeight : "bold"}} onPress={takePhoto}>Take Photo</Text></TouchableOpacity>
                    <TouchableOpacity style={s.updatingPhoto}><Text style={{textAlign : "center" , color : "#034f84" , fontWeight : "bold"}} onPress={chooseFromGallery}>Choose From Gallery</Text></TouchableOpacity>
                </View>
                <Text style={s.badge}>Profile Image :</Text>
               </View> 


               <View style={s.todo}>
                <Text style={{color : "#404040" , textTransform : "capitalize"  , width : 250}} >{userReducer.user.displayName}</Text>
            
                <Text style={s.badge}>User Name :</Text>
               </View> 



               <View style={s.todo}>
                 <Text style={{color : "#404040" , textTransform : "capitalize"  , width : 250}} >{userReducer.user.email}</Text>
                <Text style={s.badge}>Email :</Text>
               </View> 


                 <TouchableOpacity activeOpacity={.6} style={s.deleteAccountButton} onPress={deleteYourAccount}>
                    <Text style={{color : "white" , fontWeight : "bold"}}>Delete Account</Text>
                    <MaterialCommunityIcons name="delete" size={24} color="white" />
                </TouchableOpacity>

        </View>
      
        </View> )
        :
        (

          <View style={{flex : 1, justifyContent : "center"  , alignItems : 'center'}}>
            <ActivityIndicator color ="#004080" size={30} />
          </View>
          )
    )
}

export default YourInfo

const s = StyleSheet.create({
    container : {
        height : Dimensions.get("window").height,
      },
      inputAndButton : {
        width : "100%",
        height : 70,
        flexDirection : "row",
        backgroundColor : "#cce6ff",
        paddingVertical : 10,
        paddingHorizontal : 10
      },
      deleteAccountButton : {
        height : 50,
        alignItems : "center",
        backgroundColor : "#ff8080",
        paddingHorizontal : 20,
        marginTop : 20,
        borderRadius : 3,
        flexDirection : "row",
        justifyContent : "space-between"
      } ,
      input : {
        flex : 1,
        backgroundColor : "white",
        borderRadius : 4,
        paddingHorizontal : 20,
        color : "grey"
      },
      inputButton : {
        flex : .28,
        backgroundColor : "#4da6ff",
        justifyContent : "center",
        alignItems : "center",
        marginLeft : 7,
        borderRadius : 4
      },
      todos : {
        // flex : 1,
        padding : 15,
      },
      todo : {
        width : "100%",
        backgroundColor : "white",
        marginTop : 60,
        height : 70,
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        paddingHorizontal : 20,
        borderRadius : 3,
        position : "relative"
      },
      todoImage : {
        width : "100%",
        backgroundColor : "white",
        marginTop : 50,
        minHeight : 130,
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        paddingHorizontal : 20,
        borderRadius : 3,
        position : "relative"
      },
      updatingInut : {
        borderWidth : 2,
        borderColor : "#d9d9d9",
        width : 200,
        height :33,
        justifyContent : "center",
        borderRadius : 3,
        paddingHorizontal : 10,
        paddingVertical : 0
      },
      badge : {
        position : "absolute",
        top : -30,
        left : 19,
        color : "black",
        fontWeight : "bold"
      },
      updatingPhoto : {
          paddingVertical : 5,
          paddingHorizontal : 10,
          borderWidth : 2,
          borderColor : "#034f84",
          borderRadius : 3,
          marginTop : 4,
          textAlign : "center"
      }
})
