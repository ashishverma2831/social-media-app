import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import app from '../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const auth = getAuth(app);

const Signup = ({ visible, setVisible , openLogin}) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (data) => {
        // alert(JSON.stringify(data));
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((result) => {
            const user = result;
            console.log(user);
            alert('User created successfully');
        }).catch((err) => {
            console.log(err);
            alert(err.message);
        });
    }

    return (
        <Modal visible={visible} onRequestClose={() => { setVisible(false) }}>
            <View>
                <Text>Signup</Text>
                <Controller
                    control={control}
                    rules={{
                        required: { message: 'Email is required.', value: true },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder='Email'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            label={"Email Address"}
                            error={errors.email}
                        />
                    )}
                    name='email'
                />
                {/* {errors.title && <Text>This is required.</Text>} */}
                <Text>{errors.email?.message}</Text>

                <Controller
                    control={control}
                    rules={{
                        required: { message: 'Password is required.', value: true },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            secureTextEntry={true}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            label={"Password"}
                            error={errors.password}
                        />
                    )}
                    name='password'
                />
                {/* {errors.title && <Text>This is required.</Text>} */}
                <Text>{errors.password?.message}</Text>

                <Button onPress={handleSubmit(onSubmit)} mode='contained'>Signup</Button>
                <Button onPress={openLogin} style={{margin:20}} mode='outlined'>Already registered</Button>
            </View>
        </Modal>
    )
}

export default Signup

const styles = StyleSheet.create({})