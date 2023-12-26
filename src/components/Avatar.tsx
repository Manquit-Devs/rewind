import { ImgHTMLAttributes, ReactNode, useState } from "react";
import Modal from "./Modal";
import { User, usersDataMappedById } from "@/data";
import { BellSlashIcon, CalendarIcon, ComputerDesktopIcon, EyeSlashIcon, HashtagIcon, NoSymbolIcon, PlayCircleIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/16/solid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { months } from "@/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);


const getAvatarUrl = (id: string) => `/avatars/${id}.png`;

const PlaceItem = ({ position, name, value }: { position: number, name: string, value: number }) => <div> {position}º {name} - {value}</div>;

const Title = ({ children }: { children: ReactNode }) => <h1 className="flex items-center gap-1 font-semibold">{children}</h1>;

const SingleValueItem = ({ children }: { children: ReactNode }) => <span className="text-2xl">{children}</span>

const AvatarModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
  const userData = usersDataMappedById.get(user.id);

  return <Modal title={`${user.name} Rewind`} open onClose={onClose}>
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4">
        <div>
          <img src={getAvatarUrl(user.id)} className="h-32 w-32" />
        </div>
        {userData?.joinChannel &&
          <div>
            <Title>
              <SpeakerWaveIcon className="h-5" />
              Canais mais visitados
            </Title>
            {userData.joinChannel.slice(0, 7).map(((joinChannel, i) => <PlaceItem position={i + 1} name={joinChannel.V_CHANNEL_NAME} value={joinChannel.COUNT} />))}
          </div>
        }
        {userData?.sendMessage &&
          <div>
            <Title>
              <HashtagIcon className="h-5" />
              Aonde mais enviou mensagens
            </Title>
            {userData.sendMessage.map(((sendMessage, i) => <PlaceItem position={i + 1} name={sendMessage.CHANNEL_NAME} value={sendMessage.COUNT} />))}
          </div>
        }
        {userData?.playGame &&
          <div>
            <Title>
              <ComputerDesktopIcon className="h-5" />
              Jogos mais jogados
            </Title>
            {userData.playGame.slice(0, 7).map((playGame, i) => <PlaceItem position={i + 1} name={playGame.DS_EVENT} value={playGame.COUNT} />)}
          </div>
        }
        {userData?.stream &&
          <div>
            <Title>
              <PlayCircleIcon className="h-5" />
              Horas streamadas
            </Title>
            <SingleValueItem>{userData.stream.HOURS.toFixed(2)}</SingleValueItem>
          </div>
        }
        {userData?.afk &&
          <div>
            <Title>
              <BellSlashIcon className="h-5" />
              Horas AFK
            </Title>
            <SingleValueItem>{userData.afk.HOURS.toFixed(2)}</SingleValueItem>
          </div>
        }
        {userData?.mutted &&
          <div>
            <Title>
              <SpeakerXMarkIcon className="h-5" />
              Vezes que se mutou
            </Title>
            <SingleValueItem>{userData.mutted.COUNT}</SingleValueItem>
          </div>
        }
        {userData?.userMuttedByMod &&
          <div>
            <Title>
              <NoSymbolIcon className="h-5" />
              Vezes que tomou mute do ADM
            </Title>
            <SingleValueItem>{userData.userMuttedByMod.COUNT}</SingleValueItem>
          </div>
        }
        {userData?.joinOffline &&
          <div>
            <Title>
              <EyeSlashIcon className="h-5" />
              Vezes que entrou no server com status offline
            </Title>
            <SingleValueItem>{userData.joinOffline.COUNT}</SingleValueItem>
          </div>
        }
      </div>
      <div>
        <Title>
          <CalendarIcon className="h-5" />
          Atividade por mês
        </Title>
        <Bar data={{
          labels: months,
          datasets: [{ label: "Atividade por Mês", data: userData?.monthActivity ?? [], backgroundColor: "#367ff7" }]
        }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: false,
              },
            },
          }} />
      </div>
    </div>
  </Modal >
}

export const Avatar = ({ user, className, onClick, ...rest }: { user: User } & ImgHTMLAttributes<HTMLImageElement>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return <>
    {isModalOpen && <AvatarModal user={user} onClose={() => setIsModalOpen(false)} />}
    <img
      src={getAvatarUrl(user.id)}
      onClick={(e) => {
        setIsModalOpen(true);
        onClick && onClick(e);
      }}
      className={`cursor-pointer ${className}`}
      {...rest} />
  </>
}
