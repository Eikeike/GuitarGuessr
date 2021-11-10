import chords from "../../database/chords";
import React, { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import ChordListItem from '../components/ChordListItem'
import Chord from '../components/Chord'
import { getItems } from "../../dbManager";
import { useFocusEffect } from '@react-navigation/native';
import {getChordPosition} from '../../database/chords';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    keys: [],
    tunings: {
        standard: ['E', 'A', 'D', 'G', 'B', 'E']
    }
}

const Seperator = () => {
    return(
        <View
            style={{
                borderBottomColor: '#aaa',
                borderBottomWidth: 1,
            }}
/>)
}

const Practice = ({navigation, route, ...props}) => {

    let [chords, setChords] = useState([]);
    let [forceUpdate, setForceUpdate] = useState(false);

    let [modalVisible, setModalVisible] = useState(false);
    let [pressedChord, setPressedChord] = useState('');

    const refreshItemList = () => {
        getItems().then(
            (chords) => 
            {setChords(Array.from(chords).map(chord => chord.name))}
        ).catch((err) => {
            setChords(['Chords not found']);
        });
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshItemList();
            props.pauseGame();
        });
        return unsubscribe;
      }, [navigation]);

      useEffect(() => {refreshItemList()}, [forceUpdate])

      const onPressChord = (name) => {
          setPressedChord(name);
          setModalVisible(true);
      }

    const getChord = () => {
        let pos = ['b', '#'].includes(pressedChord[1]) ? 2 : 1
        return getChordPosition(pressedChord.slice(0,pos), pressedChord.substring(pos))
    }
    return (
        <View style={styles.container}>
            <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}>
                <View style={[styles.centeredView, {backgroundColor: modalVisible ? 'rgba(0,0,0,0.5)' : 'transparent' }]}>
                    {pressedChord.length > 1 && 
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.close} onPress={() => {setModalVisible(false)}}> 
                        <MaterialCommunityIcons name="close-box" size={30}></MaterialCommunityIcons>
                        </TouchableOpacity>
                        <Chord
                            chord={getChord()}
                            instrument={instrument}
                            lite={false}/>
                    </View>
                    }
                </View>
            </Modal>
            <FlatList
                data={chords}
                renderItem={({item, index, seperators}) => {
                    return (<ChordListItem text={item} key={index} forceUpdate={[forceUpdate, setForceUpdate]} onPress={() => onPressChord(item)}></ChordListItem>)
                }}
                ItemSeparatorComponent={Seperator}
            >

            </FlatList>
        </View>
    )
}

export default Practice

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
},
centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 7,
    paddingTop: 40
    
    },
    close: {
        top: 15,
        right: 20,
        position: 'absolute',
        zIndex: 1
    }
})
