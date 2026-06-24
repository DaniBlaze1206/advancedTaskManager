import { toast as rawToast } from 'react-hot-toast'

export const toast = {
  success(message: string): void {
    rawToast.success(message)
  },

  error(message: string): void {
    rawToast.error(message)
  },
}