import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPreset,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import auth from '@react-native-firebase/auth';
import {View, ActivityIndicator, Easing} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {get_user} from './redux/actions/userReducerActions';
import HomeHeader from './Headers/HomeHeader';
import Settings from './screens/Settings';
import YourInfo from './screens/YourInfo';
import CreateDonor from './screens/CreateDonor';
import BloodDonorDetails from './screens/BloodDonorDetails';
import UpdatingDonorPost from './screens/UpdatingDonorPost';
import Comments from './screens/Comments';
import DisplayName from './screens/DisplayName';

const Stack = createStackNavigator();

const Navigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  let dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    dispatch(get_user(user));
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
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
  }

  // const config = {
  //   animation: 'spring',
  //   config: {
  //     stiffness: 1000,
  //     damping: 50,
  //     mass: 3,
  //     overshootClamping: false,
  //     restDisplacementThreshold: 0.01,
  //     restSpeedThreshold: 0.01,
  //   },
  // };

  // let openConfig = {
  //   animation : "timing",
  //   config : {
  //     duration : 250,
  //     easing  : Easing.linear
  //   }
  // }

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{
            // gestureEnabled : true,
            // gestureDirection : "horizontal",
            // gestureResponseDistance : {
            //   horizontal : 300
            // },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            // transitionSpec:{
            //   open : openConfig,
            //   close : openConfig
            // }
          }}>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="DisplayName">
          <Stack.Screen
            name="DisplayName"
            component={DisplayName}
            options={{headerShown: false}}
          />
          <Stack.Screen
            options={{header: (props) => <HomeHeader {...props} />}}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="BloodDonorDetails"
            options={{title: 'Donor Details'}}
            component={BloodDonorDetails}
          />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen
            name="Comments"
            options={{title: 'Comments'}}
            component={Comments}
          />
          <Stack.Screen
            name="YourInfo"
            options={{title: 'Your Information'}}
            component={YourInfo}
          />
          <Stack.Screen
            name="CreateDonor"
            options={{headerShown: false}}
            component={CreateDonor}
          />
          <Stack.Screen
            name="UpdatingDonorPost"
            options={{headerShown: false}}
            component={UpdatingDonorPost}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default Navigator;
