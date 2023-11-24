'use client';
import Block from '@/app/components/Block';
import Button from '@/app/components/Button';
import Form from '@/app/components/Form';
import { createUser } from '@/app/functions/handlerAcessAPI';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register(){
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { push } = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        if(user.name == '' || user.email == '' || user.password == ''){
            return toast.error('Há campos não preenchidos!');
        }

        try{
            await createUser(user)
            return push('/pages/dashboard')
        } catch {
            return toast.error('Erro interno.')
        }
    }

    return (
        <Block title={'Registrar'}>
            <Form onSubmit={handleRegister}>
                <input
                placeholder='Nome'
                type='text'
                onChange={(e) => {
                    setUser({ ...user, name: e.target.value });
                }}/>
                <input
                placeholder='E-mail'
                type='email'
                onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                }}/>
                <input
                placeholder='Senha'
                type='password'
                onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                }}/>
                <div className='justify-self-end mt-5'>
                  <Button type={'reset'} secondary={true}>Limpar</Button>
                  <Button>Registrar</Button>
                </div>
            </Form>
            <ToastContainer/>
        </Block>
    )
}