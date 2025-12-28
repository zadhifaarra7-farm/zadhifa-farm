'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const password = formData.get('password')

    // Simple hardcoded check for demo
    if (password === 'admin123') {
        cookies().set('admin_session', 'true', { httpOnly: true, path: '/' })
        redirect('/dashboard')
    } else {
        return { error: 'Invalid password' }
    }
}

export async function logout() {
    cookies().delete('admin_session')
    redirect('/')
}

export async function checkAuth() {
    const session = cookies().get('admin_session')
    return !!session
}
