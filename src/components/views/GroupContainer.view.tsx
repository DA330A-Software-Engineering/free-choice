import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import { useAuth } from '../../contexts/AuthContext';
import CreateGroupContainer from './CreateGroupContainer.view';
import RenderComponentFromDevice from '../utils/RenderComponentFromDevice.utils';

/** Props for this component */
type GroupContainerViewProps = {}

/** Device Group Interface */
export interface IGroup {
    id?: string,
    name: string,
    description: string,
    devices: (string | IDevice)[]
}


/** View containing all the groups */
const GroupContainerView: FC<GroupContainerViewProps> = () => {

  // State of groups
  const [groups, setGroups] = useState<IGroup[]>([]);

  // Init contexts
  const deviceContext = useDeviceContext()
  const authContext = useAuth();

  useEffect(() => {
    // Map devices into groups
    deviceContext.getAllDevices((value: QuerySnapshot) => {
        const devices: IDevice[] = [];
        value.forEach((doc: QueryDocumentSnapshot) => {
            const docData = doc.data() as IDevice;
            docData.id = doc.id
            devices.push(docData)
        });
    
        // Get groups
        const newGroups: IGroup[] = [];
        const email = authContext.getEmail();
        deviceContext.getGroupsFromEmail(email, (value: QuerySnapshot) => {
    
        // For each group
        value.forEach((doc: QueryDocumentSnapshot) => {
            const group = doc.data() as IGroup;
            group.id = doc.id;
            const updatedDevices = group.devices.map((id: string | IDevice) => {
                if (typeof id === 'string') {
                    id = id.replace(/\s+/g, ''); // Modify the id string to remove spaces
                    const foundDevice = devices.find((d: IDevice) => d.id === id);
                    return foundDevice || id; // If foundDevice is null, return the original id
                }
                return id;
            });
            group.devices = updatedDevices;
            newGroups.push(group);
        });
        setGroups(newGroups);
        });
    });
  }, []);

  // Render the devices
  const RenderGroups: FC<{groups: IGroup[]}> = ({ groups }) => {
    const auth = useAuth();
    const deviceContext = useDeviceContext();

    const onRemoveGroup = (id: string | undefined) => {
      if (id != undefined) deviceContext.removeGroupById(id, auth.getToken() as string)
      // for now, later we shulden refresh page
      window.location.reload();
    }

    return (
      <>
        {groups.map((group: IGroup, index: number) => (
          <div key={index} className='deviceGroupStyle'>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <RenderDevices group={group} />
            <button onClick={() => onRemoveGroup(group.id)} >Remove</button>
          </div>
        ))}
      </>
    );
  };

  // Render the groups
  const RenderDevices: FC<{ group: IGroup }> = ({ group }) => {
    return (
      <>
        {group.devices.map((device: string | IDevice, index: number) => {
          if (typeof device !== 'string') {
            return <RenderComponentFromDevice device={device} key={index} />;
          }
          return null; // Return null for string devices
        })}
      </>
    );
  }

  return (
    <div>
        <div>
          <CreateGroupContainer />
        </div>
        <div className='deviceContainerStyle'>
            <RenderGroups groups={groups} />
        </div>
    </div>
  )
}


// Export the component
export default GroupContainerView