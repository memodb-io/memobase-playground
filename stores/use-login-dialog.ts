import { create } from 'zustand'

interface LoginDialogState {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

export const useLoginDialog = create<LoginDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}))
