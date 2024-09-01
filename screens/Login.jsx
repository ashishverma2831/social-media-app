import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import app from '../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

const Login = ({ visible, setVisible, openSignup }) => {

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
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((result) => {
            const user = result;
            console.log(user);
            alert('Logged in successfully');
        }).catch((err) => {
            console.log(err);
            alert(err.message);
        });
    }

    return (
        <Modal visible={visible} onRequestClose={() => { setVisible(false) }}>
            <View>
                <Text>Login</Text>
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

                <Button onPress={handleSubmit(onSubmit)} mode='contained'>Login</Button>
                <Button onPress={openSignup} style={{margin:20}} mode='outlined'>Not registered yet?</Button>
            </View>
        </Modal>
    )
}

export default Login

const styles = StyleSheet.create({})