import React from 'react'
import Users from './users'
import ModifyUser from './updateUser'
import { useAppSelector } from '@lib/redux/hooks'
import { tableActionSelector } from '@features/table'


function UserPanel() {
    const { tableState: { editUser } } = useAppSelector(tableActionSelector)
    const uuid = editUser?.ssoId ?? null

    return (
        <>
            {
                uuid ? <ModifyUser {...{ uuid }} /> : <Users />
            }
        </>
    )
}

export default UserPanel