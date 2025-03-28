import style from '@/components/textarea/styles.module.css'
import { HTMLProps } from 'react';

export function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
    return <textarea className={style.textarea} {...rest}></textarea>;
}