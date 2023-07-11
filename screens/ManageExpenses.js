import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

export default function ManageExpenses({route, navigation}) {
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenceId;

    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find((expense) => expense.id === editedExpenseId);
    
    
    async function deleteExpenseHandler() {
        setIsSubmiting(true);
        try{
            await deleteExpense(editedExpenseId);
            expensesCtx.deleteExpense(editedExpenseId);
            navigation.goBack();
        } catch(error) {
            setError(error.message);
            setIsSubmiting(false);
        }
    }

    

    function cancelHandler() {
        navigation.goBack();
    }



    async function confirmHandler(expenseData) {
        setIsSubmiting(true);
        try{
            if(isEditing) {
                await updateExpense(editedExpenseId, expenseData);
                expensesCtx.updateExpense(editedExpenseId,expenseData);
            } else {
                const id = await storeExpense(expenseData);
                expensesCtx.addExpense({...expenseData, id: id});
            }
            navigation.goBack();
        } catch(error) {
            setError(error.message);
            setIsSubmiting(false);
        }
    }

    useLayoutEffect(()=>{
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        });
    }, [navigation, isEditing])

    function errorHandler() {
        setError(null);
    }

    if(error && !isSubmiting){
        return <ErrorOverlay message={error} onCorfirm={errorHandler}/>;
    }

    if(isSubmiting) {
        return <LoadingOverlay/>;
    }

    return(
        <View style={styles.container}>
            <ExpenseForm 
                onCancel={cancelHandler} 
                submitButtonLabel={isEditing ? "Update" : "Add"} 
                onSubmit={confirmHandler} 
                defaultValues={selectedExpense}
            />
            {isEditing && 
                <View style={styles.deleteContainer}>
                    <IconButton icon='dropbox' size={46} color={GlobalStyles.colors.error500} onPress={deleteExpenseHandler}/>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
})