import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, FAB, Portal, Modal, Button, TextInput } from 'react-native-paper';

export default function TodayTab({ dark }) {
    const d = new Date();
    const [visible, setvisible] = useState(false)
    const [text, setText] = useState('')
    const [amount, setAmount] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [tempObj, setTempObj] = useState({
        nowDay: d.getDay(),
        nowMonth: d.getMonth(),
        data: []
    })
    useEffect(() => {
        getData();
        return () => {
            setRefreshing(false)
        }
    }, [refreshing])
    const getData = async () => {
        try {
            let obj = await AsyncStorage.getItem("today")
            obj = JSON.parse(obj)
            if (obj != null) {
                if (obj.nowDay == d.getDay()) {
                    setTempObj(obj);
                } else {
                    await AsyncStorage.removeItem('today')
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    const handleSubmit = async () => {
        if (text != '' || amount != null && amount != '0') {
            try {
                tempObj.data.push({ text: text, amount: Number(amount) })
                let strTempObj = JSON.stringify(tempObj)
                await AsyncStorage.setItem("today", strTempObj)
                setText('')
                setAmount(null)
                setvisible(false)
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <>
            <Portal>
                <Modal visible={visible} onDismiss={() => setvisible(false)} contentContainerStyle={{ backgroundColor: (dark) ? "#333" : "#ffff", padding: 20 }}>
                    <TextInput
                        label="why?"
                        mode="outlined"
                        value={text}
                        onChangeText={text => setText(text)}
                        style={{ margin: 5 }}
                        theme={{
                            colors: {
                                primary: (dark) ? "#ffff" : "#333"
                            }
                        }} />
                    <TextInput
                        label="amount"
                        mode="outlined"
                        keyboardType="numeric"
                        value={amount}
                        style={{ margin: 5 }}
                        onChangeText={amount => setAmount(amount)}
                        theme={{
                            colors: {
                                primary: (dark) ? "#ffff" : "#333"
                            }
                        }} />
                    <Button mode="text" style={{ marginHorizontal: 80, marginTop: 10 }} color={(dark) ? "#ffff" : "#333"} onPress={() => handleSubmit()}>
                        submit
                    </Button>
                </Modal>
            </Portal>
            <View style={{ flex: 1, backgroundColor: (dark) ? "#333" : "#ffff" }}>

                <Card style={{ margin: 5, borderBottomColor: "red", borderBottomWidth: 2 }}>
                    <Card.Content style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Title>Total</Title>
                        <Title>{tempObj.data.reduce((a, b) => a + b.amount, 0)} ₹</Title>
                    </Card.Content>
                </Card>

                <FlatList
                    data={tempObj.data}
                    renderItem={({ item }) => {
                        return (
                            <Card style={{ marginBottom: 5, marginHorizontal: 5 }} >
                                <Card.Content style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                    <Paragraph>{item.text}</Paragraph>
                                    <Paragraph>{item.amount} ₹</Paragraph>
                                </Card.Content>
                            </Card>
                        )
                    }}
                    onRefresh={() => setRefreshing(true)}
                    refreshing={refreshing}
                />
            </View>
            <FAB
                style={{ position: "absolute", backgroundColor: (dark) ? "#333" : "#ffff", top: "85%", left: "80%" }}
                icon="plus"
                onPress={() => setvisible(true)}
            />
        </>
    )
}
