// import package
import React, { useState, forwardRef, useImperativeHandle } from 'react';


const CountPosition = forwardRef((props, ref) => {
    const [count, setCount] = useState(0)
    useImperativeHandle(ref, () => ({
        show(data: any) {
            setCount(data)
        }
    }));
    return (
        <p className='mb-0' >Open Positions({count})</p>
    )
})

export default CountPosition;