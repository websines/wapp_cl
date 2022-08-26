const getRecipientEmail=(users,user) =>  users?.filter((recipient)=>recipient!==user.email)[0];


export default getRecipientEmail;