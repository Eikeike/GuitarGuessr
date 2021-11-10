import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import Chord from '../components/Chord'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { addToDB, deleteItem } from '../../dbManager';
import {chords, getChordPosition} from '../../database/chords';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getItems } from "../../dbManager";


Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }

const DIFFICULTIES = {
    EASY: [
        "major",
        "minor",
        "dim",
        "aug",
        "7",
        "m7"
    ],
    MEDIUM: [
        "sus2",
        "sus4",
        "6",
        "aug7",
        "9",
        "11",
        "13",
        "maj7",
        "maj9",
        "maj11",
        "maj13",
        "m6",
        "m7",
        "m9",
        "m11",
        "mmaj7",
        "mmaj9",
        "mmaj11",
        "add9",
        "madd9"
    ],
     HARD: [
        "dim7",
        "sus2sus4",
        "7sus4",
        "alt",
        "5",
        "69",
        "7b5",
        "9b5",
        "aug9",
        "7b9",
        "7#9",
        "9#11",
        "maj7b5",
        "maj7#5",
        "m69",
        "m7b5",
        "mmaj7b5"
    ]
}

const Play = ({navigation, route, ...props}) => {

    const chords = route.params.chords;
    const keys = chords.keys;

    const instrument = {
        strings: 6,
        fretsOnChord: 4,
        name: 'Guitar',
        keys: [],
        tunings: {
            standard: ['E', 'A', 'D', 'G', 'B', 'E']
        }
    }

    let [difficulty, setDifficulty] = useState('EASY');
    let [KEY, setKEY] = useState(keys.random());
    let [SUFFIX, setSUFFIX] = useState(DIFFICULTIES.EASY.random());
    let [interval, changeInterval] = useState(null);
    let [guessing, setGuessing] = useState(true);
    let [bookmarked, setBookmarked] = useState([]);

    let [metronome, setMetronome]= useState(0);
    const stateRef = useRef();
    const difficultyRef = useRef();
    const intervalRef = useRef();
    const guessingRef = useRef();
    difficultyRef.current = difficulty;
    stateRef.current = metronome;
    intervalRef.current = interval;
    guessingRef.current = guessing;

    function updateMetronome(){
        if (stateRef.current > 3){
            clearMetronome();
            setGuessing(false);
        }else {
            setMetronome( stateRef.current + 1);
        }
        
    }

    const clearMetronome = () => {
        intervalRef.current && clearInterval(intervalRef.current);
    }

    const setupMetronome = (time) => {
        clearMetronome();
        let t = setInterval(updateMetronome, time);
        changeInterval(t);

        setMetronome(1);
    }

    const startGuessing = () => {

        let randomKey = '';
        let randomSuffix = '';      

        do { //for the very rare case that a chord is actually not defined
            randomKey = keys.random();
            randomSuffix = DIFFICULTIES[difficultyRef.current].random();
        } while ( !chords.chords[randomKey.replace('#', 'sharp')].filter(chord => chord.suffix == randomSuffix)[0]);

        setKEY(randomKey);
        setSUFFIX(randomSuffix);

        setGuessing(true);
        if (props.playing){
            setupMetronome(1000);
        } else {
            setMetronome(0);
        }
    }

    useEffect(() => {
        if (props.playing){
            let oldMetronome = stateRef.current;
            setupMetronome(1000);
            setMetronome(oldMetronome)
        } else {
            clearMetronome();
        }
    }, [props.playing]);

    useEffect(() => {
        getItems().then(items => {
            setBookmarked(items.map(item => item.name));
        })
        return () => {clearMetronome()}
    }, [])


    let hide = {
        color: guessing ? 'white' : 'black'
    }

    const bookmarkPressed = () => {
        addToDB(KEY + SUFFIX);
        getItems().then((items) => {
            setBookmarked(items.map(item => item.name));
            startGuessing();
        });
    };

    const checkPressed = () => {
        if(bookmarked.includes(KEY + SUFFIX)){
            Alert.alert(
            "Good job",
            "You just guessed a chord that was in your Practice-Session. Delete from Practice-Session?",
            [
                {
                text: "No",
                style: "cancel",
                onPress: () => {startGuessing();}
                },
                { text: "Yes", onPress: () => {deleteItem(KEY + SUFFIX); startGuessing();} }
            ]
            );
        } else {
            startGuessing();
        };
        
    }

    const COLOR_GREEN = '#34C752';
    const COLOR_YELLOW = '#FFCC00';
    const COLOR_RED = '#FF3B30'

    return (
        <View style={styles.container}>
            <View style={styles.buttonAndCard}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, {borderColor: COLOR_GREEN, backgroundColor: difficultyRef.current == 'EASY' ? COLOR_GREEN : 'white'}]} onPress={() => setDifficulty('EASY')}><Text style={{color: difficultyRef.current == 'EASY' ? 'white' : 'black'}}>Easy</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {borderColor: COLOR_YELLOW, backgroundColor: difficultyRef.current == 'MEDIUM' ? COLOR_YELLOW : 'white'}]} onPress={() => setDifficulty('MEDIUM')}><Text>Medium</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {borderColor: COLOR_RED, backgroundColor: difficultyRef.current == 'HARD' ? COLOR_RED : 'white'}]} onPress={() => setDifficulty('HARD')}><Text style={{color: difficultyRef.current == 'HARD' ? 'white' : 'black'}}>Hard</Text></TouchableOpacity>
                </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.textBig, hide]} allowFontScaling={false}>{KEY}</Text>
                        <Text style={[styles.textSmall, hide]}>{SUFFIX}</Text>
                    </View>
                <View style={styles.card}>
                    <View style={{alignItems: 'flex-start', flexDirection: 'row', width: '90%', justifyContent: 'center'}}>
                        {   guessing ? (<>
                            <Text style={styles.textBig} allowFontScaling={false}>{KEY}</Text>
                            <Text style={styles.textSmall}>{SUFFIX}</Text>
                                </>) :
                                <Chord
                                chord={getChordPosition(KEY, SUFFIX)}
                                instrument={instrument}
                                lite={false}/>
                            }
                    </View>
                </View>
            </View>
            <View style={styles.circleContainer}>
                {stateRef.current == 0 && (<Text style={{fontSize: 20}}>Press play to start guessing</Text>)}
                {guessing ?
                [...Array(4).keys()].map(n => (<View style={[styles.circle, metronome > n ? {backgroundColor: '#007AFF'} : {}]} key={n}></View>)) : //Timer circles
                (<>
                <TouchableOpacity style={styles.bigCircle} onPress={bookmarkPressed}>
                    <MaterialCommunityIcons name="bookmark-outline" color={COLOR_YELLOW} size={72}></MaterialCommunityIcons>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bigCircle} onPress={checkPressed}>
                    <MaterialCommunityIcons name="check" color={COLOR_GREEN} size={72}></MaterialCommunityIcons>
                </TouchableOpacity>
                </>)}
            </View>
        </View>
    )
}

export default Play

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonAndCard: {
        flexDirection: 'column',
        height: '70%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
        borderBottomColor: '#aaa',
        borderStyle: 'solid',
        borderBottomWidth: 1

    },
    buttonContainer: {
        width: '80%',
        height: '5%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 50
    },
    button: {
        width: '20%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        height: 35,
        width: 80
    },
    card: {
        width: '60%',
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textBig: {
        fontSize: 40
    },
    textSmall: {
        fontSize: 30,
        lineHeight: 37
    },
    circleContainer:{
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '30%'
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 50,
        overflow: 'hidden'
    },
    bigCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#E5E5EA'
    }
})
