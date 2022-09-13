import { HandPalm, Play } from "phosphor-react";
import { 
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/CountDown";
import {useForm, FormProvider} from 'react-hook-form'
import * as zod from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { CyclesContext } from "../../contexts/CycleContext";


// id para representar cada ciclo de forma única
const newCycleFormValidationSchema =  zod.object({
    task: zod.string().min(1, 'Infome a tarefa'),
    minutesAmount: zod.number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
        .max(60, 'O ciclo precisa ser de no mínimo 60 minutos')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home () {
    const {
        activeCycle,
        createNewCycle,
        interruptCurrentCycle
    } = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)} action="">
                <FormProvider {...newCycleForm}>   
                    <NewCycleForm/>
                </FormProvider>
                <CountDown/>
                {activeCycle ? (
                    <StopCountdownButton
                        type="button"
                        onClick={interruptCurrentCycle}
                    >
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton 
                        disabled={isSubmitDisabled} 
                        type="submit"
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )} 
            </form>
        </HomeContainer>
    )
}