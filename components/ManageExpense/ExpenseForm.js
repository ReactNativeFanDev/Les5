import { StyleSheet, Text, View } from "react-native";
import Input from "./Input";
import {  useState } from "react";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";


export default function ExpenseForm({onCancel, onSubmit, submitButtonLabel, defaultValues}) {

    const [inputs, SetInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString() : '',
            isValid: true,
        },
        date: {
            value: defaultValues ? getFormattedDate(defaultValues.date) : '',
            isValid: true,
        },
        description: {
            value: defaultValues ? defaultValues.description.toString() : '',
            isValid: true,
        },
    });

    function inputChangeHandler( inputIndentifier, enteredValues){
        SetInputs((curInputs) => {
            return {
                ...curInputs,
                [inputIndentifier]: { value: enteredValues, isValid: true },
            }
        });
    }
    function submitHandler(){
        const expenseData = {
            amount: +inputs.amount.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value,
        }

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dateIsValid = expenseData.date.toString() !== "Invalid Date";
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if(!amountIsValid || !dateIsValid || !descriptionIsValid){
            SetInputs((curInputs) => {
                return {
                    amount: { value: curInputs.amount.value, isValid: amountIsValid},
                    date: { value: curInputs.date.value, isValid: dateIsValid},
                    description: { value: curInputs.description.value, isValid: descriptionIsValid}
                };
            })
            return;
        }

        onSubmit(expenseData);
        
    }

    const formIsValid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid


    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your expense</Text>

            <View style={styles.inputsRow}>
                <Input 
                    label='Amount'
                    style={styles.rowInput}
                    inValid={!inputs.amount.isValid}
                    textInputConfig={{
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangeHandler.bind(this, 'amount'),
                        value: inputs.amount.value,
                    }}
                />
                <Input 
                    label='Date' 
                    style={styles.rowInput}
                    inValid={!inputs.date.isValid}
                    textInputConfig={{
                        placeholder: "YYY-MM-DD",
                        maxLenght: 10,
                        onChangeText: inputChangeHandler.bind(this, 'date'),
                        value: inputs.date.value,
                    }}
                />
            </View>

            <Input 
                label='Description' 
                inValid={!inputs.description.isValid}
                textInputConfig={{
                    multiline: true,
                    onChangeText: inputChangeHandler.bind(this, 'description'),
                    value: inputs.description.value,
                    //autoCapitalize: 'none'
                }}
            />
            {formIsValid && <Text style={styles.erorText}> Please check your entered data</Text>}
            <View style={styles.extraButtonsContainer}>
                <Button style={styles.button} mode='flat' onPress={onCancel}>Cancel</Button>
                <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInput: {
        flex: 1,
    },
    form:{
        marginTop: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 24,
    },
    extraButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8,
    },
    erorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8,
        fontSize: 18,
    },
})