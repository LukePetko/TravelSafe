import { View, Text } from "../../components/Themed";
import React from "react";
import { styles } from "../../styles/global";
import ListLabel from "../../components/ListLabel";
import ListInput from "../../components/ListInput";
import { tintColorLight } from "../../constants/Colors";
import { SFSymbol } from "react-native-sfsymbols";

const NewPost = () => {
    return (
        <View style={styles.container}>
            <ListLabel separator borderRadius={{ top: true }} showChevron>
                Trip
            </ListLabel>
            <ListInput
                placeholder="Description"
                borderRadius={{ bottom: true }}
            />

            <ListLabel
                style={{
                    marginTop: 20,
                }}
                borderRadius={{ top: true, bottom: true }}
                showChevron
            >
                Add Photos
            </ListLabel>

            <ListLabel
                style={{ marginTop: 20 }}
                textStyles={{ color: tintColorLight }}
                borderRadius={{
                    top: true,
                    bottom: true,
                }}
                icon={
                    <SFSymbol
                        name="plus"
                        weight="semibold"
                        scale="medium"
                        color={tintColorLight}
                        size={18}
                        resizeMode="center"
                        multicolor={false}
                        style={{
                            width: 32,
                            height: 32,
                        }}
                    />
                }
            >
                Tag Friends
            </ListLabel>
        </View>
    );
};

export default NewPost;
