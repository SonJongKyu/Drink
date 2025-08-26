import { Avatar } from '@heroui/react';
import { useSession } from 'next-auth/react';
import React from 'react'

const UserAvatar = (props) => {
    const { data: session } = useSession();
    return (
        <Avatar src={session?.user?.image} {...props} />
    )
}

export default UserAvatar