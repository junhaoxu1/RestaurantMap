export type LoginCreds = {
    email: string
    password: string
    admin: boolean
}

export type SignUpCreds = {
    email: string
    password: string
    passwordConfirm: string
}

export type UpdateUserFormData = {
    name: string
    photoFile: FileList
    email: string
    password: string
    passwordConfirm: string
}

export type UserInformation = {
    email: string
    admin: boolean
    uid: string
    name: string
    _id: string
}

export type Users = UserInformation[]

export type UserFormData = Omit<UserInformation, "_id">