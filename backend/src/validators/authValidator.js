import {email, z} from 'zod'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(64),
}).strict()

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string().min(8).max(64)
}).strict()

export {loginSchema, registerSchema};