import { StaffModel } from './staff.model'

const generateRandomId = (): string => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'

  const randomLetter = () => letters[Math.floor(Math.random() * letters.length)]
  const randomDigit = () => digits[Math.floor(Math.random() * digits.length)]

  return randomLetter() + randomDigit() + randomLetter() + randomDigit()
}

export const generateUniqueStaffId = async (): Promise<string> => {
  let isUnique = false
  let staffId = ''

  while (!isUnique) {
    staffId = generateRandomId()
    const existing = await StaffModel.findOne({ staffId })

    if (!existing) {
      isUnique = true
    }
  }

  return staffId
}
