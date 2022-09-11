import { Play } from "phosphor-react";
import { 
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownButton,
    TaskInput 
} from "./styles";
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState } from "react";

const newCycleFormValidationSchema =  zod.object({
    task: zod.string().min(1, 'Infome a tarefa'),
    minutesAmount: zod.number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
        .max(60, 'O ciclo precisa ser de no mínimo 60 minutos')
})


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

// id para representar cada ciclo de forma única
interface Cycle {
    id: string;
    task: string;
    minutesAmount: number
}

export function Home () {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycle] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id =  String(new Date().getTime())

        const newCycle: Cycle =  {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
        }

        // copiando todos os ciclos que ja temos e add new no final
        setCycles((state) => [...state, newCycle])
        setActiveCycle(id)
        reset()
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 

    const currenteSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currenteSeconds / 60)

    const secondsAmount = currenteSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 1"/>
                        <option value="Projeto 1"/>
                        <option value="Projeto 1"/>
                    </datalist>

                    <label htmlFor="">durante</label>
                    <MinutesAmountInput 
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[0]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[0]}</span>
                </CountdownContainer>

                <StartCountdownButton 
                    type="submit"
                    disabled={isSubmitDisabled}
                >  
                    <Play size={24}/>
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}