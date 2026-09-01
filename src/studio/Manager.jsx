import { Studio } from 'sanity'
import { studioConfig } from './config'

/* Loaded only on /manage, as its own chunk. Visitors never download it. */
export default function Manager() {
  return <Studio config={studioConfig} />
}
