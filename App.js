import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Practice from './app/screens/Practice';
import Play from './app/screens/Play';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {addToDB, initDB, printDB, dropAll} from './dbManager'
import {chords} from "./database/chords"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {

  useEffect(() => {
    initDB();
  }, []);

  let [playing, setPlaying] = useState(false)
  return (
    <>
    <StatusBar
        animated={true}
        backgroundColor="#fff"
        hidden={false}
    />
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        options={{ title: 'Main',
        headerRight: () => 
          <TouchableOpacity
            onPress={() => setPlaying(!playing)}
            title="Play"
            style={{marginRight: 30}}>
              <MaterialCommunityIcons name={playing ? "pause" : "play"} size={40}></MaterialCommunityIcons>
            </TouchableOpacity>,
        headerTitle: (props) => <MaterialCommunityIcons name="music-note-half" size={45} color={'#000'}></MaterialCommunityIcons>,
        headerTitleAlign: 'center'
      }}>
        {props => (<Tabs {...props} playing={playing} setPlaying={setPlaying}/>)}
      </Stack.Screen>
    </Stack.Navigator>
    </NavigationContainer>
    
    </>
  );
}

function Tabs(props) {

  return (
    
        <Tab.Navigator initialRouteName="Play" barStyle={{backgroundColor: '#007AFF'}}>
          <Tab.Screen title="Moin" name="Practice" options={
            {
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="bookmark-outline" color={color} size={24}/>
              )
            }
          }>
            {p => (<Practice {...p} pauseGame={() => {props.setPlaying(false)}}></Practice>)}
            </Tab.Screen>
          <Tab.Screen name="Play" initialParams={{chords: chords}} 
          options={
            {
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="guitar-electric" color={color} size={26}/>
              )
            }}>
            {p => (<Play {...p} playing={props.playing}/>)}
            </Tab.Screen>
        </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
