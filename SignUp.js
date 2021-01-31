import React , {useState} from 'react'
import { StyleSheet, Text, View , TextInput , Button , Image , TouchableOpacity , KeyboardAvoidingView, Keyboard , FlatList , ScrollView , Dimensions , ActivityIndicator } from 'react-native'
import auth from "@react-native-firebase/auth"
import Entypo from "react-native-vector-icons/Entypo"
import Fontisto from "react-native-vector-icons/Fontisto"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"



const SignUp = ({navigation}) => {
    let [error,setError] = useState("")
    let [email,setEmal] = useState("")
    let [password,setPasword] = useState("")
    let [loading,setLoading] = useState(false)
    let [confirmPassword,setConfirmPaswword] = useState("")
    

    let signUn = async () => {
        try {
            
            if( email === "" || password === "" || confirmPassword === "" ){ 
                setError("Not All Fields Have Been Entered")
                Keyboard.dismiss() 
            return 
            }
            setLoading(true)

            if(password !== confirmPassword) {
                setError("Passwords Are Not Matching")
                Keyboard.dismiss()
                return
            } 
            let userCredential = await auth().createUserWithEmailAndPassword(email,password) 
            console.log(userCredential);


            setEmal("")
            setPasword("")
            setConfirmPaswword("")
            setLoading(false)
            Keyboard.dismiss() 
        } catch (error) {
            setLoading(false)
            if (error.code === 'auth/email-already-in-use') {
                setError("That email address is already in use!")
                Keyboard.dismiss() 
              }
            if (error.code === 'auth/invalid-email') {
                setError("That email address is invalid!")
                Keyboard.dismiss() 
              }
            if(error.code === "auth/weak-password"){
                setError("Password should be at least 6 characters Long")
                Keyboard.dismiss() 
            }
            console.log(error);
            Keyboard.dismiss() 
        }
    }

   

    return (
        !loading ?

        (<ScrollView style={{flex : 1}}>
        <View style={s.container}>
            <Image source={require("../Images/blood.jpg")} style={{width : 150 , height :150 , resizeMode : "cover" }} />
            <Text style={{fontSize : 25 , fontWeight : "bold" , marginTop : 10 , textTransform : "capitalize" , letterSpacing : 1 , color : "#7a3b2e"}}>Sign Up</Text>
            <View style={s.inputsContainer}>
              
                <View style={{flexDirection : "row",alignItems: "center",marginBottom : 10 , backgroundColor : "#f2f2f2"}}>
                    <View style={{ flex : .25 , justifyContent : "center" , flexDirection : "row"  }}>
                        <Fontisto name="email" size={30} color="grey" />
                    </View>
                    <TextInput style={s.inputOne}  onChangeText={(e) => setEmal(e)} keyboardType="email-address" placeholder="Enter Your Email" autoCorrect={false}  returnKeyLabel="Sign Up" onSubmitEditing={signUn}  />
                </View>
                <View style={{flexDirection : "row",alignItems: "center",marginBottom : 10 , backgroundColor : "#f2f2f2"}}>
                    <View style={{ flex : .25 , justifyContent : "center" , flexDirection : "row"  }}>
                        <MaterialIcons name="lock-outline" size={30} color="grey" />
                    </View>
                    <TextInput style={s.inputTwo} onChangeText={(e) => setPasword(e)} placeholder="Create Your Password" secureTextEntry={true} onSubmitEditing={signUn} returnKeyLabel="Sign Up" />
                </View>
                <View style={{flexDirection : "row",alignItems: "center",marginBottom : 10 , backgroundColor : "#f2f2f2"}}>
                    <View style={{ flex : .25 , justifyContent : "center" , flexDirection : "row"  }}>
                        <MaterialIcons name="lock-outline" size={30} color="grey" />
                    </View>
                    <TextInput  style={s.inputTwo} onChangeText={(e) => setConfirmPaswword(e)} secureTextEntry={true}  placeholder="Cofirm Your Password" autoCorrect={false}  onSubmitEditing={signUn} returnKeyLabel="Sign Up" />
                </View>
            </View>
            <TouchableOpacity activeOpacity={.6} style={s.button} onPress={signUn}>
                <Text style={{color : "white"}}>Sign Up</Text>
            </TouchableOpacity>
            <View style={[s.errorContaner,{display : error ? "flex" : "none"}]}>
                <Text style={{color : "#bc5a45" ,  width : 240}}>{error}</Text>
                <Entypo name="cross" onPress={() => setError("")} color="#bc5a45" size={23} />
            </View>
          <View style={{ flex : 1 , justifyContent : "flex-end" , width : "100%"}}>
                <TouchableOpacity activeOpacity={.6} style={s.gotoSignUp} onPress={() => navigation.navigate("SignIn")}>
                    <Text style={{color : "#a6a6a6"}}>Already Have An Account ! Sign In</Text>
                </TouchableOpacity>
          </View>
        </View >
        </ScrollView> )
        :
        (
            <View style={{flex : 1,justifyContent : "center" , alignItems : "center"}}>
                <ActivityIndicator size={35} color="#004d99" />
            </View>
        )
    )
}

export default SignUp

const s = StyleSheet.create({
    container : {
        height : Dimensions.get("window").height,
        alignItems : "center",
        backgroundColor : "white",
        padding : 20,
    },
  
    errorContaner : {
        marginTop : 2 ,
        paddingHorizontal : 20  ,
        width : "100%" , height : 50,
        flexDirection : "row" ,
        justifyContent : "space-between" ,
        alignItems : "center",
        borderWidth : 2,
        borderColor : "#bc5a45",
        marginTop : 20,
        borderRadius : 3
    },
    inputsContainer : {
        width : "100%",
        marginTop : 30
    },
    inputOne : {
        backgroundColor : "#f2f2f2",
        flex : 1,
        height : "100%",
        paddingRight: 20
    },
    inputTwo : {
        backgroundColor : "#f2f2f2",
        flex : 1,
        height : "100%",
    },
    button : {
        backgroundColor : "#4d94ff",
        width : "100%",
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        height : 40,
        borderRadius : 3,
        elevation : 3
    },
    googleSignInButton : {
        flexDirection : "row",
        alignItems : "center",
        backgroundColor : "white",
        borderWidth : 2,
        borderColor : "#6ea3f7",
        height : 45,
        borderRadius : 3,
        justifyContent : "center",
        marginBottom : 10
    },
    gotoSignUp : {
        flexDirection : "row",
        alignItems : "center",
        backgroundColor : "white",
        borderWidth : 2,
        borderColor : "#bfbfbf",
        height : 45,
        borderRadius : 3,
        justifyContent : "center",
        marginTop : 5
    }
})





