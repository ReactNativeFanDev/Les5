import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext, useEffect, useState } from "react";
import { getDateMinusDays } from "../util/date";
import { ExpensesContext } from "../store/expenses-context";
import { getExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

export default function RecentExpenses() {
    const [isFetching, setIsFetching] = useState(true);
    const expensesCtx = useContext(ExpensesContext);

    const [error, setError] = useState();

    useEffect(() => {
        async function fetchExpenses() {
            setIsFetching(true);
            try{
                const expenses = await getExpenses();
                expensesCtx.setExpenses(expenses);
            } catch(error) {
                setError(error.message);
            }
            setIsFetching(false);
        }
        fetchExpenses();
    }, [])

    function errorHandler() {
        setError(null);
    }
    if(error){
        return <ErrorOverlay message={error} onCorfirm={errorHandler}/>
    }

    if(isFetching){
        return <LoadingOverlay/>
    }

    const recentExpenses = expensesCtx.expenses.filter((expense) => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);

        return (expense.date >= date7DaysAgo) && (expense.date <= today);
    })
    return(
        <ExpensesOutput 
            expenses={recentExpenses} 
            expensesPeriod={"Last 7 days"} 
            fallbackText='No expenses registered for last 7 days.'
        />
    )
}