import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CyclesContext } from "../../../../contexts/CycleContext";
import { CountdownContainer, Separator } from "./styles";

export function CountDown () {
    const {
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished, 
        setSecondsPassed
    } =  useContext(CyclesContext)
    
    // totalSeconds - coverte o numéro de minutos em segundos
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 

    // O tanto de segundo que já passaram 
    const currenteSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currenteSeconds / 60)

    const secondsAmount = currenteSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference =  differenceInSeconds(
                    new Date(), 
                    new Date(activeCycle.startDate)
                )

                if (secondsDifference >= totalSeconds) {
                    markCurrentCycleAsFinished()
                    setSecondsPassed(totalSeconds)
          
                    clearInterval(interval)
                } else {
                    setSecondsPassed(secondsDifference)
                }

            }, 1000)
        }

        // Quando executar o useEffect novamente podemos resetar os intervalos desnecessarios 
        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}