import React, {forwardRef} from 'react'
import {motion, HTMLMotionProps} from 'framer-motion'

type PageTransitionProps = HTMLMotionProps<'div'>
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>

function PageTransition({children, ...rest}: PageTransitionProps, ref: PageTransitionRef) {
    return (
        <motion.div
            ref={ref}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{ease: "easeIn", duration: .5}}
            {...rest}>
            {children}
        </motion.div>
    )
}

export default forwardRef(PageTransition)
