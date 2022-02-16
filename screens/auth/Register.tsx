import React from "react";
import { ScrollView, Text, Pressable, View } from "../../components/Themed";
import ThemedListItem from "../../components/ListLabel";
import { styles } from "../../styles/global";
import { loginStyles } from "../../styles/login.styles";
import ListInput from "../../components/ListInput";
import { KeyboardAvoidingView } from "react-native";

type RegisterProps = {
    navigation: any;
};

const Register = ({ navigation }: RegisterProps) => {
    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{
                flex: 1,
            }}
            enabled
            keyboardVerticalOffset={90}
        >
            <ScrollView>
                <View
                    style={[
                        styles.container,
                        {
                            paddingVertical: 50,
                        },
                    ]}
                >
                    <Text style={[styles.logoLarge, { marginBottom: 50 }]}>
                        TravelSafe
                    </Text>
                    <ListInput
                        placeholder={"Enter username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        placeholder={"Enter email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        separator={true}
                    />
                    <ListInput
                        placeholder={"Confirm email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ bottom: true }}
                        style={{ marginBottom: 50 }}
                    />
                    <ListInput
                        placeholder={"Enter password"}
                        keyboardType={"default"}
                        secureTextEntry={true}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        placeholder={"Confirm password"}
                        keyboardType={"default"}
                        secureTextEntry={true}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ bottom: true }}
                        style={{ marginBottom: 50 }}
                    />
                    {/* TODO multi-choice selector */}
                    <ListInput
                        placeholder={"Choose a gender"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />

                    {/* TODO date selector */}
                    <ListInput
                        placeholder={"Choose a birthdate"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ bottom: true }}
                        style={{ marginBottom: 50 }}
                    />

                    <Pressable style={loginStyles.button}>
                        <Text style={loginStyles.text}>Register</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;
