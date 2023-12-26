import {
  ArrowTrendingUpIcon,
  BellSlashIcon,
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  ComputerDesktopIcon,
  EyeSlashIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  HashtagIcon,
  LockClosedIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  VideoCameraIcon
} from '@heroicons/react/16/solid';
import { ReactNode, useEffect } from 'react';
import { Animator, Fade, Move, ScrollContainer, ScrollPage, batch } from 'react-scroll-motion';
import {
  ServerTotalActivityByMonths,
  userAfkMappedById,
  userChangeName,
  userJoinChannelCountMappedByChannel,
  userJoinChannelMappedById,
  userJoinChannelOfflineMappedById,
  userMuttedByModMappedById,
  userMuttedMappedById,
  userPlayGameCountById,
  userPlayGameMappedByGame,
  userSendMessageMappedByChannel,
  userStreamHoursMappedById,
  usersSortedByActivity
} from './data';
import { Avatar } from './components/Avatar';
import { Bar } from 'react-chartjs-2';
import { months, shuffle } from './utils';


const ScrollAnimation = batch(Fade(), Move());

const ScrollSection = ({ children }: { children: ReactNode }) => {
  return <ScrollPage className="h-full">
    <Animator animation={ScrollAnimation} className="h-full">
      {children}
    </Animator>
  </ScrollPage>

}

const Cover = () => {
  return <div className="flex h-screen flex-col items-center justify-center">
    <h1 className="text-wrap z-10 text-center font-major text-6xl uppercase md:text-8xl">
      Manquit Rewind 2023
    </h1>
  </div>
}

const SectionTemplt = ({ title, subtitle, children }: { title: ReactNode, subtitle?: ReactNode, children: ReactNode }) => {
  return <div className="flex h-full w-full flex-col items-center justify-between gap-4 p-4 md:p-10">
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-xl font-semibold uppercase md:text-4xl">
        {title}
      </h1>
      {subtitle &&
        <h2 className="max-w-[80%] text-center text-base md:text-2xl">
          {subtitle}
        </h2>
      }
    </div>
    {children}
  </div>
}

const SectionTitle = (({ children }: { children: ReactNode }) => <div className="flex flex-col items-center gap-2">{children}</div>);

const Podium = ({ values }: { values: { id: string; name: string; }[] }) => {
  const top10 = values.slice(0, 10);
  const top10WithPercentage = top10;

  return <><div className="flex gap-10">
    {top10[1] &&
      <div className="flex h-96 flex-col items-center justify-end">
        <Avatar user={top10[1]} className="mb-4 h-24 w-24" />
        <div style={{ height: `calc(65% - 96px)` }} className="w-14 bg-[#CACACA] text-blue-950" />
        <span className="text-center font-semibold" >2º {top10[1].name}</span>
      </div>
    }
    {top10[0] &&
      <div className="flex h-96 flex-col items-center justify-end">
        <Avatar user={top10[0]} className="mb-4 h-24 w-24" />
        <div style={{ height: `calc(100% - 96px)` }} className="w-14 justify-center bg-[#FFD900]" />
        <span className="text-center font-semibold" >1º {top10[0].name}</span>
      </div>
    }
    {top10[2] &&
      <div className="flex h-96 flex-col items-center justify-end">
        <Avatar user={top10[2]} className="mb-4 h-24 w-24" />
        <div style={{ height: `calc(55% - 96px)` }} className="w-14 bg-[#e5994c] text-blue-950" />
        <span className="tenxt-center font-semibold">3º {top10[2].name}</span>
      </div>
    }
  </div>
    <div className="flex gap-1">
      {top10WithPercentage.slice(3, 10).map((user, index) =>
        <div key={user.id} className="flex flex-col items-center justify-end gap-2 truncate">
          <Avatar user={user} className="h-10 w-10 md:h-24 md:w-24" />
          <span className="max-w-10 md:max-w-24 truncate text-sm md:text-base" title={user.name}>{index + 4}º {user.name}</span>
        </div>)}
    </div>
  </>
}

const MostActiveUsers = () => {
  return <SectionTemplt
    title={<SectionTitle><ArrowTrendingUpIcon className="h-14 w-14 md:h-20 md:w-20" /> Os usuários mais ativos</SectionTitle>}
    subtitle="Quem são os verdadeiros reis e rainhas do servidor? Os usuários mais ativos, claro! Esses são os caras que estão sempre lá, conversando, jogando e participando de tudo">
    <Podium values={usersSortedByActivity} />
  </SectionTemplt>
}

const Streamers = () => {
  const streamersSorted = Array.
    from(userStreamHoursMappedById.values())
    .sort((a, b) => b.HOURS - a.HOURS)
    .map((userStream) => ({ id: userStream.ID_USER, name: userStream.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><PlayCircleIcon className="h-14 w-14 md:h-20 md:w-20" />Os Streamers</SectionTitle>}
    subtitle="Os usuários que mais compartilharam sua tela no servidor. Eles estão sempre dispostos a mostrar o que estão jogando, assistindo ou fazendo.">
    <Podium values={streamersSorted} />
  </SectionTemplt>
}

const TheMutteds = () => {
  const muttedsSorted = Array.
    from(userMuttedMappedById.values())
    .sort((a, b) => b.COUNT - a.COUNT)
    .map((userStream) => ({ id: userStream.ID_USER, name: userStream.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><SpeakerXMarkIcon className="h-14 w-14 md:h-20 md:w-20" />Zé Mudinhos</SectionTitle>}
    subtitle="Os mudinhos do server, os usuários que estão sempre mutados e não falam um piu! (Ou foram pegos pelo algoritmo do push to talk, pq se o adm é mudinho eu sou um modem com 4 antenas)">
    <Podium values={muttedsSorted} />
  </SectionTemplt>
}

const TheAfkKings = () => {
  const afkSorrted = Array.
    from(userAfkMappedById.values())
    .sort((a, b) => b.HOURS - a.HOURS)
    .map((afkKing) => ({ id: afkKing.ID_USER, name: afkKing.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><BellSlashIcon className="h-14 w-14 md:h-20 md:w-20" />Reis do AFK</SectionTitle>}
    subtitle="Quem são os verdadeiros fantasmas do servidor? Os usuários que passam mais tempo no AFK do que conversando. Esses são os caras que estão sempre se escondendo, mas nunca realmente saem. (Acham que enganam alguém)">
    <Podium values={afkSorrted} />
  </SectionTemplt>
}

const Gamers = () => {
  const gamersSorrted = Array.
    from(userPlayGameCountById.values())
    .sort((a, b) => b.count - a.count)
    .map((userPlayGame) => ({ id: userPlayGame.id, name: userPlayGame.name }));

  return <SectionTemplt
    title={<SectionTitle><ComputerDesktopIcon className="h-14 w-14 md:h-20 md:w-20" />Os Gamers</SectionTitle>}
    subtitle="Quem são os verdadeiros embaixadores dos jogos? Os usuários que passaram mais tempo jogando no servidor. Eles estão sempre explorando novos jogos e experiências, mesmo que isso signifique gastar uma fortuna em luzes RGB.">
    <Podium values={gamersSorrted} />
  </SectionTemplt>
}

const GameOfTheOffline = () => {
  const userJoinOffline = Array.
    from(userJoinChannelOfflineMappedById.values())
    .sort((a, b) => b.COUNT - a.COUNT)
    .map((userJoinOffline) => ({ id: userJoinOffline.ID_USER, name: userJoinOffline.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><EyeSlashIcon className="h-14 w-14 md:h-20 md:w-20" />Joguinho do Offline</SectionTitle>}
    subtitle="Quem são os verdadeiros espiões do servidor? Os usuários que entram no servidor, mas estão sempre com status offline. Certamente devem ter algo a esconder.">
    <Podium values={userJoinOffline} />
  </SectionTemplt>
}

const IdentityCrises = () => {
  const crises = Array.
    from(userChangeName.values())
    .sort((a, b) => b.COUNT - a.COUNT)
    .map((userChangeName) => ({ id: userChangeName.ID_USER, name: userChangeName.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><EyeSlashIcon className="h-14 w-14 md:h-20 md:w-20" />Crise de identidade</SectionTitle>}
    subtitle="Os verdadeiros metamorfos do servidor, os usuários que mais mudaram de nome, parecem nunca encontrar sua verdadeira identidade.">
    <Podium values={crises} />
  </SectionTemplt>
}

const Opresseds = () => {
  const theOpresseds = Array.
    from(userMuttedByModMappedById.values())
    .sort((a, b) => b.COUNT - a.COUNT)
    .map((muttedByMod) => ({ id: muttedByMod.ID_USER, name: muttedByMod.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><LockClosedIcon className="h-14 w-14 md:h-20 md:w-20" />Oprimidos</SectionTitle>}
    subtitle="Os verdadeiros rebeldes do servidor, aqueles que deixaram os administradores putos da vida e foram mutados">
    <Podium values={theOpresseds} />
  </SectionTemplt>
}

const FilmMakers = () => {
  const theFilmMakers = Array.
    from(userJoinChannelMappedById.values())
    .flat()
    .filter(joinChannel => joinChannel.V_CHANNEL_NAME === "Cinema")
    .sort((a, b) => b.COUNT - a.COUNT)
    .map((muttedByMod) => ({ id: muttedByMod.ID_USER, name: muttedByMod.USER_NAME }));

  return <SectionTemplt
    title={<SectionTitle><VideoCameraIcon className="h-14 w-14 md:h-20 md:w-20" />Os Cineastas</SectionTitle>}
    subtitle="Os verdadeiros cineastas do servidor, não saem da sala Cinema, verdadeiros usuários do letterbox e otários que só assistem filme, serie e anime (Mensagem gerada por IA*)">
    <Podium values={theFilmMakers} />
  </SectionTemplt>
}

const Baiters = () => {
  return <SectionTemplt
    title={<SectionTitle><FaceFrownIcon className="h-14 w-14 md:h-20 md:w-20" />Baiters</SectionTitle>}
    subtitle="Com esses aqui a beitaria rola solta">
    <Podium values={shuffle(usersSortedByActivity.slice(0, 15))} />
  </SectionTemplt>
}

const BestMods = () => {
  return <SectionTemplt
    title={<SectionTitle><FaceSmileIcon className="h-14 w-14 text-white md:h-20 md:w-20" />Melhores da administração</SectionTitle>}
    subtitle="Os verdadeiros heróis do servidor aqueles que trabalham duro para manter o servidor seguro e agradável para todos.">
    <div className="flex h-full flex-col items-center justify-center">
      <span className="animate-ping text-4xl">DATA NOT FOUND </span>
    </div>
    <i className="flex flex-col items-center text-2xl">
      Pra qualquer tipo de reclamação, choro, ou manifestação sobre qualquer acontecimento acesse:
      <a href="http://www.procon.df.gov.br/" >http://www.procon.df.gov.br/</a>
    </i>
  </SectionTemplt >
}

const ServerResume = () => {
  const totalOfMessages = Array.from(userSendMessageMappedByChannel.values()).reduce((acc, v) => acc + v, 0);
  return (
    <SectionTemplt title="Resumo do servidor">
      <div className="items grid h-full grid-cols-1 content-center md:grid-cols-4">
        <div className="flex flex-col">
          <h1 className="flex items-center gap-2 text-2xl">
            <ComputerDesktopIcon className="h-7 w-7" />
            Jogos mais jogados
          </h1>
          {
            Array.from(userPlayGameMappedByGame.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([key, value], i) => <div key={key}>{i + 1}º {key} - {value}</div>)
          }
        </div>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-2 text-2xl">
            <SpeakerWaveIcon className="h-7 w-7" />
            Canais de voz mais ativos</h1>
          {
            Array.from(userJoinChannelCountMappedByChannel.entries()).sort((a, b) => b[1] - a[1]).map(([key, value], i) => <div key={key}>{i + 1}º {key} - {value}</div>)
          }
        </div>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-2 text-2xl">
            <HashtagIcon className="h-7 w-7" />
            Canais de texto mais ativos</h1>
          {
            Array.from(userSendMessageMappedByChannel.entries()).sort((a, b) => b[1] - a[1]).map(([key, value], i) => <div key={key}>{i + 1}º {key} - {value}</div>)
          }
        </div>
        <div>
          <h1 className="flex items-center gap-2 text-2xl">
            <ChatBubbleLeftIcon className="h-7 w-7" />
            Total de mensagens enviadas</h1>
          <span className="text-xl font-semibold">{totalOfMessages}</span>
        </div>
        <div className="col-span-4 hidden justify-center gap-4 self-center md:flex">
          <div className="flex w-[50%] flex-col gap-4">
            <h1 className="flex items-center gap-2 text-2xl">
              <CalendarDaysIcon className="h-7 w-7" />
              Nível de atividade no servidor
            </h1>
            <div className="flex flex-grow justify-center rounded-xl bg-white p-5">
              <Bar data={{
                labels: months,
                datasets: [{ label: "Atividade no mês", data: ServerTotalActivityByMonths ?? [], backgroundColor: "#367ff7" }]
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
        </div>
      </div>
    </SectionTemplt>)
}

const AvatarsBackGround = () => {
  return <div className="fixed flex h-full flex-col items-center justify-center blur-md saturate-0">
    <div className="inline-flex w-full flex-nowrap">
      <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
        {usersSortedByActivity.map(user => <li key={user.id}>{
          <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
        }</li>)}
      </ul>
      <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
        {usersSortedByActivity.map(user => <li key={user.id}>{
          <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
        }</li>)}
      </ul>
    </div>
    <div className="inline-flex w-full flex-nowrap">
      <ul className="flex animate-reverse-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
        {usersSortedByActivity.reverse().map(user => <li key={user.id}>{
          <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
        }</li>)}
      </ul>
      <ul className="flex animate-reverse-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
        {usersSortedByActivity.reverse().map(user => <li key={user.id}>{
          <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
        }</li>)}
      </ul>
    </div>
  </div>
}

const App = () => {
  useEffect(() => {
    const bgSound = new Audio('/sound/got-a-friend.mp3');
    bgSound.loop = true;
    bgSound.volume = 0.25;

    const play = () => {
      bgSound.play();
    }

    document.addEventListener('click', play);

    return () => {
      document.removeEventListener('click', play);
    }
  }, []);
  return (
    <>
      <AvatarsBackGround />
      <ScrollContainer snap="mandatory">
        <ScrollSection>
          <Cover />
        </ScrollSection>
        <ScrollSection>
          <MostActiveUsers />
        </ScrollSection>
        <ScrollSection>
          <Streamers />
        </ScrollSection>
        <ScrollSection>
          <Gamers />
        </ScrollSection>
        <ScrollSection>
          <FilmMakers />
        </ScrollSection>
        <ScrollSection>
          <GameOfTheOffline />
        </ScrollSection>
        <ScrollSection>
          <TheAfkKings />
        </ScrollSection>
        <ScrollSection>
          <TheMutteds />
        </ScrollSection>
        <ScrollSection>
          <IdentityCrises />
        </ScrollSection>
        <ScrollSection>
          <Opresseds />
        </ScrollSection>
        <ScrollSection>
          <Baiters />
        </ScrollSection>
        <ScrollSection>
          <BestMods />
        </ScrollSection>
        <ScrollSection>
          <ServerResume />
        </ScrollSection>
      </ScrollContainer>
    </>
  )
}

export default App
