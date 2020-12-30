import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function WeekTab({ dark }) {
    const [daysArray, setDaysArray] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const namesArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    useEffect(() => {
        getData();
        return () => {
            setRefreshing(false)
        }
    }, [refreshing])
    const getData = async () => {
        try {
            let weekObj = await AsyncStorage.getItem('week')
            weekObj = JSON.parse(weekObj)
            if (weekObj != null) {
                setDaysArray(weekObj)
            }
        } catch (error) {
            console.log(error)
        }
        try {
            let obj = await AsyncStorage.getItem("today")
            obj = JSON.parse(obj)
            if (obj != null) {
                if (daysArray.length != 0) {
                    daysArray.forEach(async (item) => {
                        if (item.nowDay == obj.nowDay) {
                            item.amount = obj.data.reduce((a, b) => a + b.amount, 0);
                        } else {
                            if (item.nowDay == 6 && obj.nowDay == 0) {
                                await AsyncStorage.removeItem('week')
                                setDaysArray([])
                                daysArray.push({ nowDay: obj.nowDay, amount: obj.data.reduce((a, b) => a + b.amount, 0) })
                            } else {
                                daysArray.push({ nowDay: obj.nowDay, amount: obj.data.reduce((a, b) => a + b.amount, 0) })
                            }
                        }
                    })
                } else {
                    daysArray.push({ nowDay: obj.nowDay, amount: obj.data.reduce((a, b) => a + b.amount, 0) })
                }
                let strArry = JSON.stringify(daysArray)
                await AsyncStorage.setItem('week', strArry)
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: (dark) ? "#333" : "#ffff" }}>
            <Card style={{ margin: 5, borderBottomColor: "red", borderBottomWidth: 2 }}>
                <Card.Content style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                    <Title>Total</Title>
                    <Title>{daysArray.reduce((a, b) => a + b.amount, 0)} ₹</Title>
                </Card.Content>
            </Card>
            <FlatList
                data={daysArray}
                renderItem={({ item }) => {
                    return (
                        <Card style={{ marginBottom: 5, marginHorizontal: 5 }} >
                            <Card.Content style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                <Paragraph>{namesArray[item.nowDay]}</Paragraph>
                                <Paragraph>{item.amount} ₹</Paragraph>
                            </Card.Content>
                        </Card>
                    )
                }}
                onRefresh={() => setRefreshing(true)}
                refreshing={refreshing}
            />
        </View>
    )
}
