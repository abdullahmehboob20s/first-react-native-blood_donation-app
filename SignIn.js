import React , {useState , useEffect} from 'react'
import { StyleSheet, Text, View , TextInput , Button , Image , TouchableOpacity , KeyboardAvoidingView, Keyboard , FlatList , ScrollView , Dimensions, ActivityIndicator} from 'react-native'
import auth from "@react-native-firebase/auth"
import {GoogleSignin} from "@react-native-community/google-signin"
import Entypo from "react-native-vector-icons/Entypo"
import Fontisto from "react-native-vector-icons/Fontisto"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import {useSelector,useDispatch} from "react-redux"
import {clear_user} from "../redux/actions/userReducerActions"



const SignIn = ({navigation}) => {
    let [error,setError] = useState("")
    let [email,setEmail] = useState("")
    let [password,setPasword] = useState("")
    let [loading,setLoading] = useState(false)
    const dispatch = useDispatch()


    let signIn = async () => {
        try {
            if( email === "" || password === "" ){ 
                    setError("Not All Fields Have Been Entered")
                    Keyboard.dismiss() 
                return 
            }
            setLoading(true)

            await auth().signInWithEmailAndPassword(email,password)
            setEmail("")
            setPasword("")
            Keyboard.dismiss() 
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.code === 'auth/wrong-password') {
                setError("Invalid Credentials")
                Keyboard.dismiss() 
            }
            if(error.code === "auth/invalid-email"){
                setError("Email Is Invalid")
                Keyboard.dismiss() 
            }
            if (error.code === "auth/user-not-found"){
                setError("User With This Email Does Not Exists")
                Keyboard.dismiss() 
            }
            Keyboard.dismiss() 
            console.log(error);
        }
    }

    async function onGoogleButtonPress() {
        try {
            
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
           
            if(!idToken) {
                setError("Could Not Get Id Token ")
                console.log("idToken Error ");

                return
            }

            setLoading(true)
            
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
           
             if(!googleCredential) {
                setError("Could Not Get googleCredentials ")
                console.log("googleCredential Error ");
                
                return
            }
            await auth().signInWithCredential(googleCredential);
            // Sign-in the user with the credential
            setLoading(false)
            // return googlesignin
        } catch (error) {
            setLoading(false)
            dispatch(clear_user())
            if(error.code == "auth/invalid-credential"){
                setError("Please Try To Login Later")
            }
            console.log(error);
           
        }
      }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '886254710691-fpb9ervodcn0po1nioq8r93os4kq8c2a.apps.googleusercontent.com',
          });
    },[])


    return (
        !loading ? 
        (<ScrollView style={{flex : 1}}>
        <View style={s.container}>
        <Image source={require("../Images/blood.jpg")} style={{width : 150 , height :150 , resizeMode : "cover" }} />
            <Text style={{fontSize : 25 , fontWeight : "bold" , marginTop : 10 , textTransform : "capitalize" , letterSpacing : 1 , color : "#7a3b2e"}}>Sign In</Text>
            <View style={s.inputsContainer}>
                <View style={{flexDirection : "row",alignItems: "center",marginBottom : 10 , backgroundColor : "#f2f2f2"}}>
                    <View style={{ flex : .25 , justifyContent : "center" , flexDirection : "row"  }}>
                        <Fontisto name="email" size={30} color="grey" />
                    </View>
                    <TextInput autoCorrect={false} style={s.inputOne} onChangeText={(e) => setEmail(e)} keyboardType="email-address" placeholder="Enter Your Email" returnKeyLabel="Sign In" onSubmitEditing={signIn}  />
                </View>
                <View style={{flexDirection : "row",alignItems: "center",marginBottom : 10 , backgroundColor : "#f2f2f2"}}>
                    <View style={{ flex : .25 , justifyContent : "center" , flexDirection : "row"  }}>
                        <MaterialIcons name="lock-outline" size={30} color="grey" />
                    </View>
                    <TextInput autoCorrect={false} style={s.inputTwo} onChangeText={(e) => setPasword(e)} placeholder="Enter Your Password" secureTextEntry={true} returnKeyLabel="Sign In" onSubmitEditing={signIn} />
                </View>
            </View>
            <TouchableOpacity activeOpacity={.6} style={s.button} onPress={signIn}>
                <Text style={{color : "white"}}>Sign In</Text>
            </TouchableOpacity>
            <View style={[s.errorContaner,{display : error ? "flex" : "none"}]}>
                <Text style={{color : "#bc5a45"}}>{error}</Text>
                <Entypo name="cross" onPress={() => setError("")} color="#bc5a45" size={23} />
            </View>
          <View style={{ flex : 1 , justifyContent : "flex-end" , width : "100%"}}>
            <KeyboardAvoidingView>
                <TouchableOpacity activeOpacity={.6} style={s.googleSignInButton} onPress={() => onGoogleButtonPress()}>
                    <AntDesign name="google" size={24} color="#6ea3f7" style={{marginRight : 15}} />
                    <Text style={{color : "#6ea3f7"}}>Sign In With Google</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.6} style={s.gotoSignUp} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={{color : "#a6a6a6"}}>Dont Have An Account ! Sign Up</Text>
                </TouchableOpacity>
                <Text style={{color : "#cccccc" ,marginTop : 25 , textTransform : "capitalize" , fontWeight : "bold" , textAlign : "center"}}>from abdullah mehboob</Text>
            </KeyboardAvoidingView>
          </View>
        </View>
        </ScrollView>)
        :
        (
            <View style={{flex : 1,justifyContent : "center" , alignItems : "center"}}>
                <ActivityIndicator size={35} color="#004d99" />
            </View>
        )
    )
}

export default SignIn

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
