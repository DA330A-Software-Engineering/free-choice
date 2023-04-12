import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Oval } from 'react-loader-spinner';

/** Props for this component */
type ButtonProps = {
    onClick: () => void;
    className?: string;
    icon: IconDefinition,
    loading: boolean,
    active: boolean,
    disabled: boolean
}

/** Custom button */
const Button: FC<ButtonProps> = ({ onClick, className, icon, loading, active, disabled }) => {

    const Loading = () => {
        return (
            <Oval
                height={40}
                width={40}
                color="grey"
                wrapperStyle={{}}
                wrapperClass='loadingStyle'
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="grey"
                strokeWidth={2}
                strokeWidthSecondary={4}
            />
        );
    }

    return (
        <>
          <button disabled={(disabled || loading)} onClick={onClick} className={`${className}`}>
            { loading ? <Loading /> :  <FontAwesomeIcon fontSize={20} icon={icon} color={'#2D4390'} opacity={disabled ? 0.2 : 1} />}
          </button>
        </>
    )
}

// Export the component
export default Button