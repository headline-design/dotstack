import { useCallback } from 'react'
import { ApplicationModal, setOpenModal } from './applicationReducers'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppState } from '../store'

export function useModalOpen(modal: ApplicationModal): boolean {
    const openModal = useAppSelector(
        (state: AppState) => state.application.openModal
    )
    return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
    const open = useModalOpen(modal)
    const dispatch = useAppDispatch()
    return useCallback(
        () => dispatch(setOpenModal(open ? null : modal)),
        [dispatch, modal, open]
    )
}

export function useWalletModalToggle(): () => void {
    return useToggleModal(ApplicationModal.WALLET)
}
