// CadastroPopup.js
"use client";
import { useContext, useState } from 'react';
import './page.module.css';
import styles from './page.module.css';
import { createEquipe } from '@/src/actions/api';
import { createJogador } from '@/src/actions/api';
import { FaX } from "react-icons/fa6";
import { AuthContext } from '@/src/contexts/AuthContext';


const CadastroPopup = ({ isOpen, onClose, modalities, setError, fetchTeams }) => {
  const { acessToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nome: '',
    sala: '',
    participante1: null,
    participantesala1: null,
    participante2: null,
    participantesala2: null,
    participante3: null,
    participantesala3: null,
    participante4: null,
    participantesala4: null,
    participante5: null,
    participantesala5: null,
    participante6: null,
    participantesala6: null,
    participante7: null,
    participantesala7: null,
    participante8: null,
    participantesala8: null,
    participante9: null,
    participantesala9: null,
    participante10: null,
    participantesala10: null,
    modalidade: '',
    imagem: null
  });
  const [playerLimit, setPlayerLimit] = useState(0);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });

    if (name === 'modalidade') {
      const selectedModality = modalities.find(modality => modality.id === value);
      setPlayerLimit(selectedModality ? selectedModality.limite_pessoas : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jogadores = Array.from({ length: 10 }, (_, i) => ({
      nome: formData[`participante${i + 1}`],
      sala: formData[`participantesala${i + 1}`],
    }));

    const hasJogadores = jogadores.some(jogador => jogador.nome && jogador.nome.trim() !== '');

    if (!hasJogadores) {
      setError({ status: "error", message: 'Por favor, adicione pelo menos um jogador.' });
      setTimeout(() => setError(null), 3000);
      return;
    }

    const invalidJogadores = jogadores.some(jogador => jogador.nome && jogador.nome.trim() !== '' && (!jogador.sala || jogador.sala.trim() === ''));

    if (invalidJogadores) {
      setError({ status: "error", message: 'Por favor, preencha a sala de todos os jogadores.' });
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (formData.imagem.type !== 'image/jpeg' && formData.imagem.type !== 'image/png') {
      setError({ status: "error", message: 'Formato de imagem inválido' });
      setTimeout(() => setError(null), 3000);
    } else {
      const response = await createEquipe(formData.nome, formData.sala, formData.modalidade, 'pendente', acessToken);

      if (response.message == "Token inválido") {
        setError({ status: "error", message: 'Token inválido' });
        setTimeout(() => setError(null), 3000);
      }

      if (response.message == "Acesso não autorizado") {
        setError({ status: "error", message: 'Acesso não autorizado' });
        setTimeout(() => setError(null), 3000);
      }

      if (response.status === 'sucess') {
        const jogadoresCriados = await createJogadores(response.times.id, jogadores);
        if (jogadoresCriados === true) {
          fetchTeams();
          setError({ status: "sucess", message: 'Equipe cadastrada com sucesso!' });
          setTimeout(() => setError(null), 3000);
          onClose();
        };
      };
    }
  };

  const createJogadores = async (teamId, jogadores) => {
    for (const jogador of jogadores) {
      if (jogador.nome && jogador.nome.trim() !== '') {
        await createJogador(jogador.nome, jogador.sala, teamId, acessToken);
      }
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupoverlay}>
      <div className={styles.popupcontent}>
        <button type="button" onClick={onClose} className={styles.X}>
          <FaX />
        </button>
        <h2><span className={styles.textored}>Cadastro</span> de equipes:</h2>
        <form className={styles.containerForm} onSubmit={handleSubmit}>
          <label>Nome da equipe:</label>
          <input
            type="text"
            name="nome"
            onChange={handleChange}
            required
          />

          <label>Sala:</label>
          <input
            type="text"
            name="sala"
            onChange={handleChange}
          />

          <label>Modalidade:</label>
          <select
            name="modalidade"
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {modalities.length > 0 &&
              modalities.map((modality) => (
                <option key={modality.id} value={modality.id}>
                  {modality.nome_modalidade}
                </option>
              ))}
          </select>

          <h2 className={styles.title}>Participantes:</h2>

          <div className={styles.labelpart}>
            {Array.from({ length: playerLimit }, (_, i) => (
              <div key={i} className={styles.participante_sala}>
                <div>
                  <label>Participante {i + 1}:</label>
                  <input
                    type="text"
                    name={`participante${i + 1}`}
                    onChange={handleChange}
                    className={styles.participantes}
                  />
                </div>
                <div>
                  <label>Sala:</label>
                  <input
                    type="text"
                    name={`participantesala${i + 1}`}
                    onChange={handleChange}
                    className={styles.participantes}
                  />
                </div>
              </div>
            ))}
          </div>



          <label>Imagem:</label>
          <input
            type="file"
            name="imagem"
            onChange={handleChange}
            required
          />

          <button className={styles.cadastro}>Cadastrar</button>
        </form>
      </div>
    </div>
  );
};
export default CadastroPopup;