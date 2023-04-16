import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Input from '../interactable/Input.cmpt';
import { IGroup } from './GroupContainer.view';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/** Props for this component */
type CreateGroupContainerProps = {}

/** View containing all the groups */
const CreateGroupContainer: FC<CreateGroupContainerProps> = () => {

    // State of groups
    const [devices, setDevices] = useState<IDevice[]>([]);
    const [devicesInGroup, setDevicesInGroup] = useState<IDevice[]>([]);
    const [groupName, setGroupName] = useState<string>("");
    const [groupDescription, setGroupDescription] = useState<string>("");

    // Init contexts
    const deviceContext = useDeviceContext();
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    // Get all devices
    deviceContext.getAllDevices((value: QuerySnapshot) => {
        const data: IDevice[] = [];
        value.forEach((doc: QueryDocumentSnapshot) => {
          const docData = doc.data() as IDevice;
          docData.id = doc.id
          data.push(docData)
        })
        setDevices(data);
      })
    }, [])

    // Add or remove device from group
    const handleSetGroupType = (device: IDevice) => {
        if (devicesInGroup.includes(device)) {
            const updatedList = devicesInGroup.filter((i) => i !== device);
            setDevicesInGroup(updatedList);
        } else if (devicesInGroup.length == 0 || devicesInGroup[0].type == device.type){
            setDevicesInGroup([...devicesInGroup, device]);
        }
    }

    // Group button Cmpt
    const GroupDeviceButton: FC<{ 
        device: IDevice,
        disabled: boolean,
        active: boolean,
        onClick: (device: IDevice) => void 
    }> = ({ device, onClick, disabled, active }) => {

        const handleClick = () => {
            if (disabled) return;
            onClick(device);
        }

        const opacity = () => {
            if (disabled) return 0.2;
        }

        const color = () => {
            if (active) return 'blue'
            else return 'grey'
        }

        return (
            <div style={{opacity: opacity(), backgroundColor: color()}} className='create-group-btn' onClick={handleClick}>
                <p>{device.name}</p>
            </div>
        );
    }

    const onCreateGroup = () => {
        const arrayOfIds: string[] = devicesInGroup.map(obj => obj.id);
        const newGroup: IGroup = {
            name: groupName,
            description: groupDescription,
            devices: arrayOfIds
        }
        deviceContext.createGroup(newGroup, auth.getToken() as string);

        // for now
        window.location.reload();

        // use this later
        // navigate("/groups");
    }
    
    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setGroupDescription(e.target.value);
    };

    return (
    <div>
        <div className='deviceContainerStyle'>
            <Input placeholder={'Group Name...'} onChange={(name: string) => setGroupName(name)} />
            <textarea value={groupDescription} onChange={handleTextareaChange} placeholder='Group Description...'></textarea>
            <button disabled={devicesInGroup.length === 0 || groupName.length < 3} onClick={onCreateGroup}>Create Group</button>
        </div>
        <div className='deviceContainerStyle'>
            {devices.map((device: IDevice, index: number) => {
                return <GroupDeviceButton
                    active={devicesInGroup.includes(device)}
                    disabled={devicesInGroup[0] != undefined && devicesInGroup[0].type != device.type}
                    onClick={(device: IDevice) => handleSetGroupType(device)}
                    key={index}
                    device={device}/>;
            })}
        </div>
    </div>
    )
}


// Export the component
export default CreateGroupContainer