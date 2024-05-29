import React from "react";

export  const buildProvidersTree = (componentsWithProps: any) => {
    const initialComponent = ({children}: any) => <>{children}</>
    return componentsWithProps.reduce(
        (AccumulatedComponents: any, [Provider, props = {}]: any) => {
            // eslint-disable-next-line react/display-name
            return ({children}: any) => {
                return (
                    <AccumulatedComponents>
                        <Provider {...props}>{children} </Provider>
                    </AccumulatedComponents>
                );
            };
        }, initialComponent);
};
