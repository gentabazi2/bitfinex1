import React from "react";

class ErrorBoundary extends React.Component{
    state = { hasError:false, error:null}

    static getDerivedStateFromError(error){
        return {hasError: true, error}
    }

    componentDidCatch(error, info){
        console.log(error,info)
    }

    render(){
        if(this.state.hasError){
            return this.props.fallback
        }
        return this.props.children
    }
}

export default ErrorBoundary