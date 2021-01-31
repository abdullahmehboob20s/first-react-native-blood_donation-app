import React ,{useState,useEffect} from "react"
import {View , Text , StyleSheet  , TextInput , ActivityIndicator , TouchableOpacity , ScrollView} from "react-native"
import firestore from '@react-native-firebase/firestore';
import Feather from "react-native-vector-icons/Feather"
import MaIcon from "react-native-vector-icons/MaterialIcons"

let Todo = ({navigation}) => {
  let [data,setData] = useState(null)
  let [name,setName] = useState("")
  let [currentId,setCurrentId] = useState("")
  let [updateValue,setUpdateValue] = useState("")


  let submittingData = async () => {
    try {
      await firestore().collection("cafes").doc().set({name})
      setName("")
      setCurrentId("")
    } catch (error) {
      console.log("submitting Error ==> " + error);
    }
  }

  let deleteingDocument = async (id) => {
    try {
      await firestore().collection("cafes").doc(id).delete()
    } catch (error) {
      console.log("DELETING ERROR ==> " + error);
    }
  }

  let updatingTodo = async (id,value) => {
    if(currentId){
      try {
        
        let upadte = await firestore().collection("cafes").doc(id).update({name : updateValue})
        console.log(upadte);
        setCurrentId("")
      } catch (error) {
        console.log(error);
      }
    }
    else{
      setCurrentId(id)
      setUpdateValue(value)
    }
  }


  useEffect(() => {
    firestore().collection("cafes").onSnapshot(querySanpshot => {
      const docs = []
      querySanpshot.forEach(doc => {
        docs.push({...doc.data(),id : doc.id})
      })
      if(docs) return setData(docs)
    },(err) => console.log(err))
},[])


  return(
    <View style={s.container}>
      <View style={s.inputAndButton}>
        <TextInput returnKeyLabel="Add" onChangeText={e => setName(e)} value={name} onSubmitEditing={submittingData} style={s.input} placeholder="Enter Your Todo" />
        <TouchableOpacity onPress={submittingData} style={s.inputButton}>
          <Text style={{color : "white"}}>Add</Text>
        </TouchableOpacity>
      </View>
        {
          data !== null ?
          <ScrollView style={s.todos}>{ 
          data.map((item,index) => {
            return(  
             <View key={index} style={s.todo}>
               {currentId === item.id ? 
               <TextInput returnKeyLabel="Update" onSubmitEditing={() => updatingTodo(item.id,item.name)} autoFocus={true} onChangeText={(e) => setUpdateValue(e)} style={s.updatingInut} placeholder="Update Todo" value={updateValue} />
               :
               <Text style={{color : "#404040" , textTransform : "capitalize" , width : 200}} key={index}>{item.name}</Text>
              }
               <View style={{width : 65  , justifyContent : "space-between"  , flexDirection : "row" }}>
                    <Feather name="edit" color="#034f84" onPress={() => updatingTodo(item.id,item.name)} onLongPress={() => alert("edit Item")} size={24} />
                    <MaIcon name="delete-outline" color="#c94c4c" onPress={() => deleteingDocument(item.id)} size={24} />
               </View>
             </View> 
            )
          })}
          </ScrollView>
          :
          <View style={{flex : 1 , justifyContent : "center" , alignItems : "center"}}>
           <ActivityIndicator color="darkslateblue" size={50} />
          </View>
        }
    </View>
  )
}

let s = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : "#f2f2f2",
  },
  inputAndButton : {
    width : "100%",
    height : 70,
    flexDirection : "row",
    backgroundColor : "#cce6ff",
    paddingVertical : 10,
    paddingHorizontal : 10
  },
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
    flex : 1,
    width : "100%",
    padding : 15,
  },
  todo : {
    backgroundColor : "white",
    marginVertical : 5,
    height : 55,
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between",
    paddingHorizontal : 20,
    borderRadius : 3,
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
  }
})

export default Todo