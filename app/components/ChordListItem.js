import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { deleteItem } from '../../dbManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChordListItem = (props) => {
    let [forceUpdate, setForceUpdate] = props.forceUpdate;

    const remove = () => {
        deleteItem(props.text).then((success) => 
            {   
                setForceUpdate(!forceUpdate)}
        ).catch(err => console.log(err));        
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={props.onPress} style={{flex:0.8}}>
                <Text style={styles.text}>{props.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.delete} onPress={remove}>
                <MaterialCommunityIcons name="delete" size={30} color={'#444'} ></MaterialCommunityIcons>
            </TouchableOpacity>
        </View>
    )
}

export default ChordListItem

const styles = StyleSheet.create({
    container:{
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 30
    },
    delete: {
        flex: 0.2,
        alignItems: 'flex-end'
    }
})
