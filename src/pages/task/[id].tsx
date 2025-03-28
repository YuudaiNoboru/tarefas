import Head from "next/head";
import style from '@/pages/task/styles.module.css'
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnections";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Textarea } from "@/components/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

interface TaskProps {
    item: {
        tarefa: string,
        public: boolean,
        created: Date,
        taskId: string,
        user: string,
    }
}

interface CommentProps{
    id: string,
    comment: string,
    taskId: string,
    user: string,
    name: string
}

export default function Task({item}: TaskProps) {

    const { data: session } = useSession();
    const [input, setInput] = useState('');

    async function handleComment(event: FormEvent) {
        event.preventDefault();

        if(input == '') return;

        if(!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, 'comments'), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item.taskId,
            });

            setInput('');
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <div className={style.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>
            <main className={style.main}>
                <h1>Tarefa</h1>
                <article className={style.task}>
                    <p>{item.tarefa}</p>
                </article>
            </main>
            <section className={style.commentsContainer}>
                <h2>Deixar comentário</h2>
                <form onSubmit={handleComment}>
                    <Textarea
                        value={input}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                        placeholder="Digite seu comentário..."
                    />
                    <button className={style.button} disabled={!session?.user}>Enviar Comentário</button>
                </form>

            </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;

    const docRef = doc(db, 'tarefas', id);
    const snapshot = await getDoc(docRef);

    const q = query(collection(db, 'comments'), where('taskId', '==', id))
    const snapshotComments = await getDocs(q);

    let allComments: CommentProps[] = [];

    

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000;

    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
    }



    return {
        props: {
            item: task,
        },
    };
}