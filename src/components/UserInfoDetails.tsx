import React from "react"
import { UserInformation } from "../types/User.types"

type Props = {
	user: UserInformation
}

const UserInfoDetails: React.FC<Props> = ({ user }) => {
	return (
		<>
			<div>
				<p>{user.name}</p>
				<p>{user.email}</p>
			</div>
		</>
	)
}

export default UserInfoDetails
