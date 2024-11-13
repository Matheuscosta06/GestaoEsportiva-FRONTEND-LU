'use client';
import styles from './page.module.css';
import logo from "@/assets/imagens/logo.png";
import Image from 'next/image';
import VDP from '@/src/app/components/vdp/vdp';
import Confrontos from '@/src/app/components/confrontos/confrontos';
import { useParams } from 'next/navigation';
import { getAPI } from '@/src/actions/api';
import { useEffect, useState } from 'react';

const GdeAtividade = () => {
    const { atvId } = useParams();
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        const fetchTeams = async () => {
            const response = await getAPI('times/modalidade/', atvId);
            if (response.status == 'sucess') {
                setTeams(response.times);
            }
        }
        fetchTeams();
    }, []);
    return (
        <main className={styles.main_div}>
            <div className={styles.div_img}>
                <Image src={logo} id={styles.logo} width={130} height={130} />
            </div>

            <h2 className={styles.h2Title}>Gerenciamento de atividade</h2>


            <div className={styles.list_container}>
                <VDP teams={teams} />
            </div>

            <div className={styles.container}>
                <h2 className={styles.h2Title}>Confrontos</h2>

                <ul className={styles.confrontos_container}>
                    <Confrontos />
                </ul>


            </div>
        </main>
    )
};

export default GdeAtividade;