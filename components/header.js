import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Appbar, Menu, Portal, Dialog, Paragraph, Button } from 'react-native-paper';

const Header = ({ dark, setDark }) => {
    const [visible, setVisible] = useState(false);
    const [dialog, setDialog] = useState(false);

    const handleDelete = async () => {
        setDialog(false)
        await AsyncStorage.removeItem('today')
        await AsyncStorage.removeItem('week')
        await AsyncStorage.removeItem('months')
    }
    return (
        <>
            <Appbar.Header
                style={{ flexDirection: "row", justifyContent: "center" }}
                theme={{
                    colors: {
                        primary: (dark) ? "#333" : "#ffff"
                    }
                }}>
                <Appbar.Content title="Expense Tracker" />
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={<Appbar.Action onPress={() => setVisible(true)} icon="dots-vertical" color={(dark) ? "#ffff" : "#333"} />}>
                    <Menu.Item onPress={() => setDark(!dark)} title={(dark) ? "Light theme" : "Dark theme"} />
                    <Menu.Item onPress={() => {
                        setVisible(false)
                        setDialog(true)
                    }} title="Delete all data" />
                </Menu>
            </Appbar.Header>
            <Portal>
                <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
                    <Dialog.Title>Warnning !</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure want to delete ?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color="red" onPress={() => handleDelete()}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

export default Header;

