export type LoginCreds = {
    email: string
    password: string
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
    uid: string
    email: string
    admin: boolean
}

export type Users = UserInformation[]

export type UserFormData = Omit<UserInformation, "_id">