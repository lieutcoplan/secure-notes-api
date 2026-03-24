import {z} from 'zod'

const noteSchema = z.object({
  title: z.string().max(100),
  content: z.string().max(5000),
}).strict()

export {noteSchema}