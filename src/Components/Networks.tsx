import { Spinner, Alert } from "react-bootstrap"
import { NetworkResult, NetworkDetails, NetworkAddrsDetails } from "./DevicePage"
import './Networks.scss'

export default ({networkData}: {networkData: NetworkResult}) => {
    if (!networkData) {
        return <Spinner animation='border'/>
    }
    
    if (!networkData.networks) {
        return <Alert variant='danger'>No networks found</Alert>
    }
    return (
        <>
            <p className='h2 text-dark text-center'>
                Networks
            </p>
            {/* <div className='networks-list-container'> */}
            <div className='card-deck'>
                {networkData ? networkData.networks.map((network: NetworkDetails) => <NetworkCard network={network} />) : <Spinner animation='border' />}
            </div>
        </>
    )
  }

export const NetworkCard = ({network}: {network: NetworkDetails}) => {
    return (
        <div className='network-container  bg-dark text-light m-2'>
            <div className='network-name card-header p-2'>
                <div className='card-title'>{network.name}</div>
            </div>
            <div className='network-addrs card-body'>
                {network.addrs.map((addressDetails: NetworkAddrsDetails, index) => 
                <div className="address-details" key={index}>
                    {`IP${Object.keys(addressDetails.addr)[0]}:  ${Object.values(addressDetails.addr)[0]}`}
                </div>)}
            </div>
        </div>
    )
  }