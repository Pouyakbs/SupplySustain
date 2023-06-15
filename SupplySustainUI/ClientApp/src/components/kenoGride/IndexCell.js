const IndexCell=(props)=>{

    return(
        <td colSpan="1" >
            <span>{props.dataIndex+1}</span>
        </td>

    )
}

export default IndexCell