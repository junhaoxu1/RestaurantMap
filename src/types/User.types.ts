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