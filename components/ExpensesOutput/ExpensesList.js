import { FlatList, Text } from "react-native";
import ExpenseItem from "./ExpenseItem";

export default function ExpensesList({expenses}) {
    function renderExpensesItem(itemData) {
        return(
            <ExpenseItem {...itemData.item}/>
        )
    }
    return(
        <FlatList 
            data={expenses} 
            renderItem={renderExpensesItem} 
            keyExtractor={(item) => item.id}
        />
    )
};