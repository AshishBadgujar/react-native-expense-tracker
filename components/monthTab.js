import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function MonthTab({ dark }) {
    const [monthsArray, setMonthsArray] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const namesArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    useEffect(() => {
        getData();
        return () => {
            setRefreshing(false)
        }
    }, [refreshing])
    const getData = async () => {
        try {
            let monthsObj = await AsyncStorage.getItem('months')
            monthsObj = JSON.parse(monthsObj)
            if (monthsObj != null) {
                setMonthsArray(monthsObj)
            }
            let obj = await AsyncStorage.getItem("today")
            obj = JSON.parse(obj)
            if (obj != null) {
                if (monthsArray.length != 0) {
                    monthsArray.forEach(async (item) => {
                        if (item.nowMonth == obj.nowMonth) {
                            item.amount = obj.data.reduce((a, b) => a + b.amount, 0);
                        } else {
                            if (item.nowMonth == 11 && obj.nowMonth == 0) {
                                await AsyncStorage.removeItem('months')
                                setMonthsArray([])
                                monthsArray.push({ nowMonth: obj.nowMonth, amount: obj.data.reduce((a, b) => a + b.amount, 0) })
                            } else {
                                monthsArray.push({ nowMonth: obj.nowMonth, amount: obj.data.reduce((a, b) => a + b.amount, 0) })
                            }
                        }
                    })
                } else {
                    monthsArray.push({ nowMonth: obj.nowMonth, amount: obj.data.reduce((a, b) => a + b.amount, 0) })
                }
                let strArry = JSON.stringify(monthsArray)
                await AsyncStorage.setItem('months', strArry)
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
                    <Title>{monthsArray.reduce((a, b) => a + b.amount, 0)} ₹</Title>
                </Card.Content>
            </Card>
            <FlatList
                data={monthsArray}
                renderItem={({ item }) => {
                    return (
                        <Card style={{ marginBottom: 5, marginHorizontal: 5 }} >
                            <Card.Content style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                <Paragraph>{namesArray[item.nowMonth]}</Paragraph>
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