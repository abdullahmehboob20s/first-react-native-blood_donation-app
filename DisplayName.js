import React ,{useEffect,useState} from 'react'
import { StyleSheet, Text, View ,TextInput , TouchableOpacity , ActivityIndicator} from 'react-native'
import firebase from "@react-native-firebase/app"
import {useSelector,useDispatch} from "react-redux"
import {get_user} from "../redux/actions/userReducerActions"

const DisplayName = ({navigation}) => {
    const userReducer = useSelector(state => state.userReducer)
    let [inputValue,setinputValue] = useState("")
    const dispatch = useDispatch()
    let [loading,setLoading] = useState(false)


    let enterYourName = async () => {
        try {
        if(inputValue === ""){
            alert("Name should Not Be Emtpy")
            return
        }
        setLoading(true)
        await firebase.auth().currentUser.updateProfile({displayName : inputValue});
        let currentUser123 = await firebase.auth().currentUser
        
        dispatch(get_user(currentUser123))
        navigation.navigate("Home")
        setLoading(false)
    } catch (error) {
        console.log(error);       
    }
    }

    let get = async () => {
        let data = await firebase.auth().currentUser
        if(data.displayName){
            navigation.navigate("Home")
        }
    }
    get()


    return (
        !loading ? 
        <View style={{flex : 1 , paddingHorizontal : 20, backgroundColor : "#d9d9d9" , flexDirection : "column", justifyContent : "center",alignItems : "center"}}>
            <TextInput onChangeText={(e) => setinputValue(e)} onSubmitEditing={enterYourName} style={s.displayName} placeholder="First Provide Your Name" />
            <TouchableOpacity onPress={enterYourName} style={{width : "50%",backgroundColor : "#66ccff",height : 40 , borderRadius : 3 , marginTop : 20,justifyContent : 'center',alignItems : "center"}}>
                <Text style={{color : "white",fontWeight : "bold"}}>Submit</Text>
            </TouchableOpacity>
        </View>
        :
        <View style={{flex : 1, justifyContent : "center" , alignItems : "center"}}>
            <ActivityIndicator size={30} color="darkslateblue" />
        </View>
    )
  
}

export default DisplayName

const s = StyleSheet.create({
    displayName : {
        backgroundColor : "white",
        paddingHorizontal : 20,
        borderRadius : 3,
        width : "100%"
    },  
})
