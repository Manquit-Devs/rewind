import data from '@/data.json';
import { ArrowDownCircleIcon } from '@heroicons/react/16/solid';
import { ReactNode } from 'react';
import { Animator, Fade, Move, ScrollContainer, ScrollPage, Sticky, batch } from 'react-scroll-motion';

const ScrollAnimation = batch(Fade(), Move());

const ScrollSection = ({ children }: { children: ReactNode }) => {
  return <ScrollPage>
    <Animator animation={ScrollAnimation}>
      {children}
    </Animator>
  </ScrollPage>

}


const ScrollIndicator = () => {
  return <div className="fixed bottom-5 flex w-full items-center justify-center">
    <ArrowDownCircleIcon className="w-10 animate-bounce" />
  </div>
}

const App = () => {
  return (
    <>
      <ScrollIndicator />
      <ScrollContainer snap="mandatory">
        <ScrollSection>
          <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-center font-major text-6xl uppercase">
              Manquit Rewind 2023
            </h1>
          </div>
        </ScrollSection>
        <ScrollSection>
          <div className="flex w-full flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-semibold uppercase">
              Os usuários mais ativos
            </h1>
            <div>
            </div>
          </div>
        </ScrollSection>
      </ScrollContainer>
    </>
  )
}

export default App
