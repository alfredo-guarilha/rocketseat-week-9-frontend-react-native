import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { SafeAreaView, Alert, ScrollView, Platform, TouchableOpacity, StyleSheet, Text, Image, AsyncStorage } from 'react-native';


import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List({ navigation }) {
    const [techs, setTechs ] = useState([]);

    useEffect(()=>{
        AsyncStorage.getItem('user').then(user_id=>{
            const socket = socketio('http://192.168.1.42:3333',{
                query:{ user_id }
            });

            socket.on('booking_response', booking=>{
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'Aprovada' : 'Rejeitada'}`);
            });
        })
    },[]);
    
    useEffect(()=>{
        AsyncStorage.getItem('techs').then( storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());
            setTechs(techsArray);
        });
    }, []);

    async function handleExit(){
        await AsyncStorage.removeItem('user');

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <ScrollView>
                {techs.map(tech=><SpotList key={tech} tech={tech} />)}
            </ScrollView>

            <TouchableOpacity onPress={handleExit} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },

    logo:{
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 10
    },
    button: {
        height: 60,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
})