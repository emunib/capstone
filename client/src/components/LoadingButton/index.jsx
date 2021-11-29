import React, {useRef, useState} from 'react';
import './style.scss';
import {Button, Ref} from 'semantic-ui-react';

function LoadingButton({onClick, active: activeProp, ...props}) {
    const [loading, setLoading] = useState(false);
    const [activeState, setActiveState] = useState(activeProp);
    const buttonRef = useRef();

    return (
        <Ref innerRef={buttonRef}>
            <Button {...props}
                    loading={loading}
                    {...(activeState ? {color: 'yellow'} : {})}
                    {...(onClick ? {
                        onClick: async e => {
                            setLoading(true);
                            await onClick(e);
                            setLoading(false);
                            setActiveState(!activeState);
                            buttonRef.current.blur();
                        }
                    } : {})}
            />
        </Ref>

    );
}

export default LoadingButton;