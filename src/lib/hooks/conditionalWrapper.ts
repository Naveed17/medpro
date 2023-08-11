export const ConditionalWrapper = ({...props}) => {
    const {condition, wrapper, children} = props;
    return condition ? wrapper(children) : children;
}
