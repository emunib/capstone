import React, {useEffect, useRef, useState} from 'react';
import './style.scss';
import {Button, Ref} from 'semantic-ui-react';

function LoadingButton(props) {
    let {clickHandler, active: activeProp, ...rest} = props;
    const [loading, setLoading] = useState(false);
    const [activeState, setActiveState] = useState(activeProp);
    const buttonRef = useRef();

    useEffect(() => {
        setActiveState(props.active);
    }, [props.active]);

    return (
        <Ref innerRef={buttonRef}>
            <Button {...rest}
                    loading={loading}
                    {...(activeState ? {color: 'yellow'} : {})}
                    {...(clickHandler ? {
                        onClick: async e => {
                            if (!loading) {
                                setLoading(true);
                                await clickHandler(e);
                                setLoading(false);
                                setActiveState(!activeState);
                                buttonRef.current.blur();
                            }
                        }
                    } : {})}
            />
        </Ref>

    );
}

export default LoadingButton;