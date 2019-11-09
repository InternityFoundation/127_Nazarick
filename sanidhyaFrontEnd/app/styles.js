import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    heading: {
        fontSize: 40,
        textAlign: 'center'
    },
    input: {
        borderColor: 'blue',
        borderWidth: 2,
        textAlign: 'center',
        width: 250,
        margin: 10,
        borderRadius: 25,
        padding: 10,
    },
    loginView: {
        flex: 1,
        marginTop: -2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
})