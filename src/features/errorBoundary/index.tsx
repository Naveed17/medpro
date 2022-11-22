import React from "react";
import {LoadingScreen} from "@features/loadingScreen";

class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = {hasError: false}
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI

        return {hasError: true}
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can use your own error logging service here
        console.log({error, errorInfo})
    }

    render() {
        // Check if the error is thrown
        if ((this.state as any).hasError) {
            // You can render any custom fallback UI
            return (
                <LoadingScreen
                    error
                    OnClick={(error: string) => this.setState({hasError: false})}
                    button={'loading-error-404-reset'}
                    text={"loading-error"}/>
            )
        }

        // Return children components in case of no error

        return (this.props as any).children
    }
}

export default ErrorBoundary
