import { ArrowDownCircleIcon } from '@heroicons/react/16/solid';
import { ReactNode, useRef } from 'react';
import { Animator, Fade, Move, ScrollContainer, ScrollPage, Sticky, batch } from 'react-scroll-motion';
import { mostActiveUsers } from './data';

const ScrollAnimation = batch(Fade(), Move());

const ScrollSection = ({ children }: { children: ReactNode }) => {
  return <ScrollPage className="h-full">
    <Animator animation={ScrollAnimation} className="h-full">
      {children}
    </Animator>
  </ScrollPage>

}


const ScrollIndicator = ({ onClick }: { onClick: () => void }) => {
  return <button className="fixed bottom-5 z-50 flex w-full items-center justify-center" onClick={onClick}>
    <ArrowDownCircleIcon className="w-10 animate-bounce" />
  </button>
}

const Cover = () => {
  return <div className="flex h-screen flex-col items-center justify-center">
    <h1 className="text-wrap z-10 text-center font-major text-6xl uppercase md:text-8xl">
      Manquit Rewind 2023
    </h1>
  </div>
}

const MostActiveUsers = () => {
  const top10 = mostActiveUsers.slice(0, 10);
  const top10WithPercentage = top10.map(user => ({ ...user, percentage: 100 * user.value / top10[0].value }));
  return <div className="flex h-full w-full flex-col items-center justify-between gap-4 p-4 md:p-20">
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-xl font-semibold uppercase md:text-4xl">
        Os usuários mais ativos
      </h1>
      <h2 className="max-w-[80%] text-center text-base md:text-2xl">
        Quem são os verdadeiros reis e rainhas do servidor? Os usuários mais ativos, claro! Esses são os caras que estão sempre lá, conversando, jogando e participando de tudo
      </h2>
    </div>
    <div className="flex gap-10">
      <div className="flex h-96 flex-col items-center justify-end">
        <img src={`/avatars/${top10[1].id}.png`} className="mb-4 h-24 w-24" />
        <div style={{ height: `calc(65% - 96px)` }} className="w-14 bg-[#CACACA] text-blue-950" />
        <span className="font-semibold" >2º - {top10[1].name}</span>
      </div>
      <div className="flex h-96 flex-col items-center justify-end">
        <img src={`/avatars/${top10[0].id}.png`} className="mb-4 h-24 w-24" />
        <div style={{ height: `calc(100% - 96px)` }} className="w-14 justify-center bg-[#FFD900]" />
        <span className="font-semibold" >1º - {top10[0].name}</span>
      </div>
      <div className="flex h-96 flex-col items-center justify-end">
        <img src={`/avatars/${top10[2].id}.png`} className="mb-4 h-24 w-24" />
        <div style={{ height: `calc(55% - 96px)` }} className="w-14 bg-[#e5994c] text-blue-950" />
        <span>3º - {top10[2].name}</span>
      </div>
    </div>
    <div className="flex gap-1">
      {top10WithPercentage.slice(3, 10).map((user, index) => <div key={user.id} className="flex flex-col items-center justify-end gap-2">
        <img src={`/avatars/${user.id}.png`} className="h-10 w-10 md:h-24 md:w-24" />
        <span className="text-sm md:text-base">{index + 4}º - {user.name}</span>
      </div>)}
    </div>
  </div>
}

const App = () => {
  const zone1 = useRef(null);

  return (
    <>
      <div className="fixed flex h-full flex-col items-center justify-center blur-md saturate-0">
        <div className="inline-flex w-full flex-nowrap">
          <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
            {mostActiveUsers.map(user => <li>{
              <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
            }</li>)}
          </ul>
          <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
            {mostActiveUsers.map(user => <li>{
              <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
            }</li>)}
          </ul>
        </div>
        <div className="inline-flex w-full flex-nowrap">
          <ul className="flex animate-reverse-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
            {mostActiveUsers.reverse().map(user => <li key={user.id}>{
              <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
            }</li>)}
          </ul>
          <ul className="flex animate-reverse-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
            {mostActiveUsers.reverse().map(user => <li key={user.id}>{
              <img src={`/avatars/${user.id}.png`} className="h-96 w-96 opacity-10" />
            }</li>)}
          </ul>
        </div>
      </div>
      <ScrollIndicator onClick={() => { zone1.current.scrollIntoView({ behavior: "smooth" }); console.log('clicking'); }} />
      <ScrollContainer snap="mandatory">
        <ScrollSection>
          <Cover />
        </ScrollSection>
        <ScrollSection>
          <MostActiveUsers />
        </ScrollSection>
      </ScrollContainer>
    </>
  )
}

export default App
