'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      setLoading(true)
      setError(null)

      try {
        await toast.promise(
          (async () => {
            const res = await fetch('/next/seed', {
              method: 'POST',
              credentials: 'include',
            })
            if (!res.ok) {
              const raw = await res.text()
              let detail = `Seed failed (${res.status}).`
              try {
                const body = JSON.parse(raw) as { error?: string }
                if (body?.error) detail = body.error
                else if (raw) detail = raw.slice(0, 500)
              } catch {
                if (raw) detail = raw.slice(0, 500)
              }
              throw new Error(detail)
            }
            setSeeded(true)
            return true
          })(),
          {
            loading: 'Seeding with data....',
            success: <SuccessMessage />,
            error: (err) =>
              err instanceof Error ? err.message : 'An error occurred while seeding.',
          },
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
      } finally {
        setLoading(false)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  )
}
